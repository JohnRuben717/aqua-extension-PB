// Filename: apicomponent.tsx
import { logger } from '@papi/frontend';
import { jwtDecode } from 'jwt-decode';

logger.info('UserAuth is importing!');

interface UserAuthData {
  username: string;
  password: string;
  token: string;
}
 
class UserAuthManager {
  private authData: UserAuthData | undefined = undefined;

  constructor(
    private username: string,
    private password: string,
  ) {}

  async authenticate() {
    const body = new URLSearchParams({
      grant_type: '',
      username: this.username,
      password: this.password,
      scope: '',
      client_id: '',
      client_secret: '',
    });

    const response = await fetch('https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // Retrieve the error details from the response
      logger.error(`Authentication failed with status ${response.status}: ${errorBody}`);
      throw new Error(`Network response was not ok: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    this.authData = {
      username: this.username,
      password: this.password,
      token: data.access_token,
    };
    return data.access_token;
  }

  getToken() {
    return this.authData?.token;
  }
}

const decodeAndSchedule = async (username: string, password: string) => {
  try {
    const authManager = new UserAuthManager(username, password);
    console.log('username:', username, 'password:', password);
    const token = await authManager.authenticate();
    const decoded = jwtDecode(token);
    if (decoded && decoded.exp) {
      const expirationTimeMs = decoded.exp * 1000; // Convert seconds to milliseconds
      const currentTimeMs = Date.now();
      const delayMs = expirationTimeMs - currentTimeMs;
      const delayMinutes = delayMs / 60000; // Convert milliseconds to minutes
      const reducedDelayMs = delayMs - 300000; // Reduce delay by 5 minutes (300000 milliseconds)
      const reducedDelayMinutes = reducedDelayMs / 60000; // Convert reduced milliseconds to minutes

      logger.log(`Original scheduling time: ${delayMs} milliseconds (${delayMinutes} minutes).`);
      logger.log(
        `Adjusted scheduling time: ${reducedDelayMs} milliseconds (${reducedDelayMinutes} minutes).`,
      );
    } else {
      logger.error('Expiration time not found in token');
    }
  } catch (error) {
    logger.error(`Error retrieving or decoding token: ${error}`);
  }
};

export default decodeAndSchedule;
