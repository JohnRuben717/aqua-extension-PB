import papi, { logger } from '@papi/backend';
import type { ExecutionActivationContext, ExecutionToken, IWebViewProvider } from '@papi/core';
import type { LoginResponse } from 'paranext-extension-template';
import webViewContent from './test.web-view?inline';
import webViewContentStyle from './test.web-view.scss?inline';
import { postData, decodeAndSchedule } from './decodeToken';

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

export async function activate(context: ExecutionActivationContext): Promise<void> {
  logger.info('UserAuth is activating!');

  // Register the web view provider
  const webViewPromise = papi.webViewProviders.register(webViewProviderType, webViewProvider);

  // Get existing username and password if they exists
  const token: ExecutionToken = context.executionToken;
  let username: string | undefined;
  let password: string | undefined;
  try {
    username = await papi.storage.readUserData(token, usernameKey);
    password = await papi.storage.readUserData(token, passwordKey);
  } catch (e) {
    username = undefined;
    password = undefined;
  }

  logger.info(`activate - username: ${username}, password: ${password}`);
  const loginPromise = papi.commands.registerCommand(
    'aqua.login',
    async (user: string, pwd: string): Promise<LoginResponse> => {
      try {
        const authToken = await postData(user, pwd);
        const decToken = await decodeAndSchedule(user, pwd);

        // Store the last successful username/password so we can reuse them for refreshing tokens
        // TODO: Switch to using encrypted storage when the API is added to PAPI
        await papi.storage.writeUserData(token, usernameKey, user);
        await papi.storage.writeUserData(token, passwordKey, pwd);
        return {
          loginSucceeded: true,
          message: `Login succeeded: auth token size = ${authToken.length}`,
        };
      } catch (error) {
        return { loginSucceeded: false, message: `Login failed` };
      }
    },
  );
  // decodeAndSchedule('platform.bible.test', 'coOpacqF6tW6');

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
