import papi, { logger } from '@papi/backend';
import type { ExecutionActivationContext, ExecutionToken, IWebViewProvider } from '@papi/core';
import type { LoginResponse } from 'aqua-extension';
import webViewContent from './login.web-view?inline';
import webViewContentStyle from './login.web-view.scss?inline';
import { postData, decodeAndSchedule } from './data/handle-token';
import fetchAssessment from './data/fetch-assessment';
import fetchVersion from './data/fetch-version';

logger.info('UserAuth is importing!');

const webViewProvider: IWebViewProvider = {
  async getWebView(savedWebView) {
    return {
      ...savedWebView,
      content: webViewContent,
      styles: webViewContentStyle,
      title: 'AQuA Login',
    };
  },
};

const webViewProviderType = 'FirstWebView.view';

export async function activate(context: ExecutionActivationContext): Promise<void> {
  const usernameKey = 'storedUsername';
  const passwordKey = 'storedPassword';
  const tokenKey = 'storedToken'; 
  logger.info('UserAuth is activating!');

  // Register the web view provider
  const webViewPromise = papi.webViewProviders.register(webViewProviderType, webViewProvider);

  // Get existing username, password, and token if they exist
  const token: ExecutionToken = context.executionToken;
  let storedUsername: string | undefined;
  let storedPassword: string | undefined;
  let storedToken: string | undefined;
  try {
    storedUsername = await papi.storage.readUserData(token, usernameKey);
    storedPassword = await papi.storage.readUserData(token, passwordKey);
    storedToken = await papi.storage.readUserData(token, tokenKey); // Attempt to read the token
  } catch (e) {
    storedUsername = undefined;
    storedPassword = undefined;
    storedToken = undefined;
  }

  logger.info(
    `activate - username: ${storedUsername}, password: ${storedPassword}, token: ${storedToken}`,
  );

  const loginPromise = papi.commands.registerCommand(
    'aqua.login',
    async (username: string, password: string): Promise<LoginResponse> => {
      try {
        const authToken = await postData(username, password);
        await decodeAndSchedule(username, password);

        logger.info('Storing user data...');
        // Store the last successful username/password/token
        // TODO: Switch to using encrypted storage when the API is added to PAPI
        await papi.storage.writeUserData(token, usernameKey, username);
        await papi.storage.writeUserData(token, passwordKey, password);

        logger.info(`Attempting to store token: ${authToken}`);
        await papi.storage.writeUserData(token, tokenKey, authToken); // Store the token
        logger.info('User data stored successfully.');

        // const fetchAssessmen = await fetchAssessment(token);
        const fetchversions = await fetchVersion(authToken);
        const fetchAssessments = await fetchAssessment(authToken);
        return {
          loginSucceeded: true,
          message: `Login succeeded: auth token size = ${authToken.length}`,
          token: authToken, // Return the token
          assessmentData: fetchAssessments,
          versionData: fetchversions,
        };
      } catch (error) {
        logger.error(`Error during login: ${error}`);
        return { loginSucceeded: false, message: `Login failed` };
      }
    },
  );

  // Pull up the web view on startup
  await papi.webViews.getWebView(webViewProviderType, undefined, { existingId: '?' });

  context.registrations.add(await webViewPromise);
  context.registrations.add(await loginPromise);

  logger.info('UserAuth is finished activating!');
}

export async function deactivate() {
  logger.info('Closing the Login');
  return true;
}
