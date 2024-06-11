import papi, { logger } from '@papi/backend';
import type { ExecutionActivationContext, ExecutionToken, IWebViewProvider } from '@papi/core';
import webViewContent from './test.web-view?inline';
import webViewContentStyle from './test.web-view.scss?inline';

logger.info('UserAuth is importing!');

const webViewProvider: IWebViewProvider = {
  async getWebView(savedWebView) {
    return {
      ...savedWebView,
      content: webViewContent,
      styles: webViewContentStyle,
      title: 'Aqua Login',
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

  console.log('Username:', username, 'Password:', password);

  // Now we can feed the username and the password into the webview, if they exist.
  // See if you can find examples of other extension that help you to do that

  // Pull up the web view on startup
  papi.webViews.getWebView(webViewProviderType, undefined, { existingId: '?' });

  context.registrations.add(await webViewPromise);

  logger.info('UserAuth is finished activating!');
}

export async function deactivate() {
  logger.info('Closing the Login');
  return true;
}
