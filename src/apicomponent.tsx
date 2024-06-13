const postData = async (username: string, password: string): Promise<string> => {
  const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/token';
  const params = new URLSearchParams({
    grant_type: '', // Typically for password grant type
    // username: 'platform.bible.test',
    username,
    // password: 'coOpacqF6tW6',
    password,
    scope: '', // Update with the actual scope needed
    client_id: '', // Update with the actual client ID
    client_secret: '', // Update with the actual client secret
  });
  // console.log(username);
  // console.log(password);
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  };
 
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: params.toString(),
      mode: 'no-cors',
    });
    const data = await response.json();
    console.log(data.access_token);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return data.access_token;
  } catch (error) {
    console.error('Error during fetch:', error);
    throw new Error('Failed to fetch access from server');
  }
};

postData();
export default postData;

// apicomponent.tsx

// const postData = async (): Promise<string> => {
//   const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/token';
//   const username = 'platform.bible.test';
//   const password = 'coOpacqF6tW6';
//   const params = new URLSearchParams();
//   params.append('grant_type', '');
//   params.append('username', username);
//   params.append('password', password);
//   params.append('scope', '');
//   params.append('client_id', '');
//   params.append('client_secret', '');

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
//     console.log('Data:', data);
//     return data.access_token;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

// export { postData };
// postData();
