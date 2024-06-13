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

// import { logger } from '@papi/frontend';
// import { jwtDecode } from 'jwt-decode';

// console.log('UserAuth is importing!');
// logger.info('Token Auto is loaded!');

// const postData = async (username: string, password: string): Promise<string> => {
//   const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/token';
//   const params = new URLSearchParams();
//   params.append('grant_type', '');
//   params.append('username', username);
//   params.append('password', password);
//   params.append('scope', '');
//   params.append('client_id', '');
//   params.append('client_script', '');

//   const headers = {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     Accept: 'application/json',
//   };

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers,
//       body: params.toString(),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Data:', data.access_token);
//     return data.access_token;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

// const decodeAndSchedule = async () => {
//   let username = localStorage.getItem('username');
//   let password = localStorage.getItem('password');
//   console.log(username, password);


//   while (!username || !password) {
//     console.log('Waiting for username and password...');
//     await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
//     username = localStorage.getItem('username');
//     password = localStorage.getItem('password');
//   }

//   try {
//     const token = await postData(username, password);
//     localStorage.setItem('token', token); // Save the token in localStorage
//     console.log('Token stored:', token);
//     const decoded = jwtDecode(token);
//     if (decoded && decoded.exp) {
//       const expirationTimeMs = decoded.exp * 1000; // Convert seconds to milliseconds
//       const currentTimeMs = Date.now();
//       const delayMs = expirationTimeMs - currentTimeMs;
//       const reducedDelayMs = delayMs - 300000; // Reduce delay by 5 minutes (300000 milliseconds)

//       console.log(`Adjusted scheduling time: ${reducedDelayMs} milliseconds.`);

//       const interval = setInterval(() => {
//         const now = Date.now();
//         const timeLeft = reducedDelayMs - now - 300000; // Update time left
//         if (timeLeft <= 0) {
//           clearInterval(interval);
//           decodeAndSchedule(); // Reschedule when time runs out
//         } else {
//           console.log(`Time left until next refresh: ${timeLeft} milliseconds.`);
//         }
//       }, 60000); // Update every minute
//     } else {
//       console.error('Expiration time not found in token');
//     }
//   } catch (error) {
//     console.error(`Error retrieving or decoding token: ${error}`);
//   }
// };

// export default decodeAndSchedule;
// decodeAndSchedule(); // No need to pass username and password here


// Filename: apicomponent.tsx
