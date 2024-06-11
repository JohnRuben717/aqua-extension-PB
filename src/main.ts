import papi, { logger, DataProviderEngine } from '@papi/backend';
import type {
  ExecutionActivationContext,
  ExecutionToken,
  DataProviderUpdateInstructions,
  IDataProviderEngine,
  IWebViewProvider
} from '@papi/core';
import webViewContent from './test.web-view?inline';
import webViewContentStyle from './test.web-view.scss?inline';
import {UserAuthData} from './DecodeToken';



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


interface UserAuthDataTypes {
  UserAuth: 'UserAuth';
}

interface UserAuthData {
  username: string;
  password: string;
  token: string;
}

class UserAuthDataProviderEngine
  extends DataProviderEngine<UserAuthDataTypes>
  implements IDataProviderEngine<UserAuthDataTypes>
{
  /**
   * User authentication data stored by the Data Provider.
   *
   * - Key is username.
   * - Values are { password: '<password>', token: '<jwt_token>' }
   */
  private authData: { [username: string]: { password: string; token: string } } = {};

  /**
   * Internal set method that doesn't send updates so we can update how we want from setUserAuth
   *
   * @param selector Username
   * @param data UserAuthData containing password and token
   * @returns '*' - update instructions for updating all data types because we want subscribers to
   *   UserAuth data types to update based on this change.
   */
  @papi.dataProviders.decorators.ignore
  async setInternal(
    selector: string,
    data: UserAuthData,
  ): Promise<DataProviderUpdateInstructions<UserAuthDataTypes>> {
    this.authData[selector] = { password: data.password, token: data.token };
    await papi.storage.writeUserData({ username: selector }, JSON.stringify(this.authData[selector]));
    return '*';
  }

  /**
   * Set user authentication data
   *
   * @param username Username to set authentication data for
   * @param data UserAuthData containing password and token
   * @returns '*' - update instructions for updating all data types because we want subscribers to
   *   UserAuth data types to update based on this change.
   */
  async setUserAuth(username: string, data: UserAuthData) {
    return this.setInternal(username, data);
  }

  /**
   * Get user authentication data by username
   *
   * @param username Username to get authentication data for
   * @returns UserAuthData containing password and token for the given username
   */
  async getUserAuth(username: string): Promise<UserAuthData | undefined> {
    if (!this.authData[username]) {
      const loadedData = await papi.storage.readUserData(username);
      if (loadedData) {
        this.authData[username] = JSON.parse(loadedData) as { password: string; token: string };
      }
    }
    return this.authData[username];
  }
}

const webViewProviderType = 'FirstWebView.view';

export async function activate(context: ExecutionActivationContext): Promise<void> {
  logger.info('UserAuth is activating!');


  // Register the web view provider
  const webViewPromise = papi.webViewProviders.register(
    'FirstWebView.view',
    webViewProvider,
  );

  // Pull up the web view on startup
  papi.webViews.getWebView('FirstWebView.view', undefined, { existingId: '?' });

// Set up registered extension features to be unregistered when deactivating the extension

const token: ExecutionToken = context.executionToken;
const engine = new UserAuthDataProviderEngine();

const userAuthDataProvider = await papi.dataProviders.registerEngine(
  'userAuth.userAuth',
  engine,
  );
  
  context.registrations.add(userAuthDataProvider , await webViewPromise);

  logger.info('UserAuth is finished activating!');
}

export async function deactivate() {
  logger.info('Closing the Login');
  return true;
}