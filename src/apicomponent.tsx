// apicomponent.tsx

import axios from 'axios';

const postData = async (): Promise<string> => {
  const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/token';
  const username = 'platform.bible.test';
  const password = 'coOpacqF6tW6';
  const params = new URLSearchParams();
  params.append('grant_type', '');
  params.append('username', username);
  params.append('password', password);
  params.append('scope', '');
  params.append('client_id', '');
  params.append('client_secret', '');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'accept': 'application/json'
  };

  try {
    const response = await axios.post(url, params, { headers });
    return response.data.access_token;
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data.detail);
    } else if (error.request) {
      console.error('Error:', error.request);
    }
    throw error;
  }
};

export { postData };
