import {writeJsonFile} from 'write-json-file'; // Import the write-json-file module
import tokenData from './tokenData.json';

async function fetchVersion(token: string) {
  const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/version';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();
  console.log('Storing version data');

  // Save the entire version data to a JSON file
  await writeJsonFile('versionData.json', data);
  return data ;
}

export default fetchVersion;
fetchVersion(tokenData.access_token);