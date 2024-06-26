declare module 'aqua-extension' {
  // Add extension types exposed on the papi for other extensions to use here
  // More instructions can be found in the README

  export type LoginResponse = {
    loginSucceeded: boolean;
    message: string;
    token?: string;
    assessmentData?: unknown; 
    versionData?: unknown; 

  };
}

declare module 'papi-shared-types' {
  import type { LoginResponse } from 'aqua-extension';

  export interface CommandHandlers {
    /**
     * Login to the AQuA service
     *
     * @param username Username for authentication
     * @param password Password for authentication
     * @returns `LoginResponse` indicating the response
     */
    'aqua.login': (username: string, password: string) => Promise<LoginResponse>;
  }
}
