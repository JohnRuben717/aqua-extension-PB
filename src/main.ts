import papi, { logger } from '@papi/backend';
import type { ExecutionActivationContext, ExecutionToken, IWebViewProvider } from '@papi/core';
import type { LoginResponse as BaseLoginResponse } from 'paranext-extension-template';
import webViewContent from './test.web-view?inline';
import webViewContentStyle from './test.web-view.scss?inline';
import { postData, decodeAndSchedule } from './decodeToken';
import fetchAssessment from './fetchAssessment';

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
const usernameKey = 'storedUsername';
const passwordKey = 'storedPassword';
const tokenKey = 'storedToken'; // Add a key for the token

export interface LoginResponse extends BaseLoginResponse {
  token?: string; // Extend the LoginResponse type here
  assessmentData?: any; // Add the assessmentData property
}

export async function activate(context: ExecutionActivationContext): Promise<void> {
  logger.info('UserAuth is activating!');

  // Register the web view provider
  const webViewPromise = papi.webViewProviders.register(webViewProviderType, webViewProvider);

  // Get existing username, password, and token if they exist
  const token: ExecutionToken = context.executionToken;
  let username: string | undefined;
  let password: string | undefined;
  let storedToken: string | undefined;
  try {
    username = await papi.storage.readUserData(token, usernameKey);
    password = await papi.storage.readUserData(token, passwordKey);
    storedToken = await papi.storage.readUserData(token, tokenKey); // Attempt to read the token
  } catch (e) {
    username = undefined;
    password = undefined;
    storedToken = undefined;
  }

  logger.info(`activate - username: ${username}, password: ${password}, token: ${storedToken}`);

  const loginPromise = papi.commands.registerCommand(
    'aqua.login',
    async (user: string, pwd: string): Promise<LoginResponse> => {
      try {
        const authToken = await postData(user, pwd);
        const decToken = await decodeAndSchedule(user, pwd);

        logger.info('Storing user data...');
        // Store the last successful username/password/token
        // TODO: Switch to using encrypted storage when the API is added to PAPI
        await papi.storage.writeUserData(token, usernameKey, user);
        await papi.storage.writeUserData(token, passwordKey, pwd);

        logger.info(`Attempting to store token: ${authToken}`);
        await papi.storage.writeUserData(token, tokenKey, authToken); // Store the token
        logger.info('User data stored successfully.');


        // const fetchAssessmen = await fetchAssessment(token);
        const fetchAssessments = await fetchAssessment(authToken);
        return {
          loginSucceeded: true,
          message: `Login succeeded: auth token size = ${authToken.length}`,
          token: authToken, // Return the token
          assessmentData: fetchAssessments,
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