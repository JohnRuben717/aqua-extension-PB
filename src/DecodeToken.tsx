// import papi from '@papi/backend';
import papi from '@papi/frontend';

import { jwtDecode } from 'jwt-decode';

console.log('UserAuth is importing!');
// logger.info('Token Auto is loaded!');

const postData = async (username: string, password: string): Promise<string> => {
  const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/token';
  const params = new URLSearchParams();
  params.append('grant_type', '');
  params.append('username', username);
  params.append('password', password);
  params.append('scope', '');
  params.append('client_id', '');
  params.append('client_secret', '');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  };

  try {
    const response = await papi.fetch(url, {
      method: 'POST',
      headers,
      body: params.toString(),
      mode: 'no-cors' ,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data:', data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const decodeAndSchedule = async (username: string, password: string) => {
  try {
    const token = await postData(username, password);
    console.log('username:', username, 'password:', password);
    const decoded = jwtDecode(token);
    if (decoded && decoded.exp) {
      const expirationTimeMs = decoded.exp * 1000; // Convert seconds to milliseconds
      const currentTimeMs = Date.now();
      const delayMs = expirationTimeMs - currentTimeMs;
      const reducedDelayMs = delayMs - 300000; // Reduce delay by 5 minutes (300000 milliseconds)

      console.log(`Adjusted scheduling time: ${reducedDelayMs} milliseconds.`);

      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = reducedDelayMs - now - 300000; // Update time left
        if (timeLeft <= 0) {
          clearInterval(interval);
          decodeAndSchedule(username, password); // Reschedule when time runs out
        } else {
          console.log(`Time left until next refresh: ${timeLeft} milliseconds.`);
        }
      }, 60000); // Update every minute
    } else {
      console.error('Expiration time not found in token');
    }
  } catch (error) {
    console.error(`Error retrieving or decoding token: ${error}`);
  }
};

export default decodeAndSchedule;
// decodeAndSchedule('platform.bible.test', 'coOpacqF6tW6');
