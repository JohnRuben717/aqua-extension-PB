// import jwt, { JwtPayload } from 'jsonwebtoken';
import { logger } from '@papi/frontend';
import postData from './apicomponent';

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
    try {
      // Assuming postData() takes username and password and returns a JWT token
      // const token = await postData(this.username, this.password);
      const token = await postData();
      this.authData = {
        username: this.username,
        password: this.password,
        token,
      };
      // Send data to main.ts for storage using papi.storage
      // This doesn't work here. You need the execution token to call the read of write functions on papi.storage
      // and that token is only available in main.ts
      // I don't know how to fix this right now.
      // await papi.storage.writeUserData({ username: this.username }, JSON.stringify(this.authData));
      return token;
    } catch (error) {
      logger.error('Authentication failed:', error);
      throw error;
    }
  }

  getToken() {
    return this.authData?.token;
  }
}

// What are you trying to do here?
// const runMainScript = () => {
//   logger.log('Executing script...');
//   exec('npx tsx apicomponent.tsx', (error, stdout, stderr) => {
//     if (error) {
//       logger.error(`Error: ${error.message}`);
//       return;
//     }
//     if (stdout) logger.log(`Output: ${stdout}`);
//     if (stderr) logger.error(`Error: ${stderr}`);
//   });
// };

const decodeAndSchedule = async (username: string, password: string) => {
  try {
    console.log('here');
    const authManager = new UserAuthManager(username, password);
    const token = await authManager.authenticate();
    // Quick and dirty type fix
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    // This doesn't work. Use a different package to handle the token
    // const decoded = jwt.decode(token) as JwtPayload;
    const decoded = undefined;
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

      // setTimeout(runMainScript, reducedDelayMs);
    } else {
      logger.error('Expiration time not found in token');
    }
  } catch (error) {
    logger.error(`Error retrieving or decoding token: ${error}`);
  }
};

export default decodeAndSchedule;
