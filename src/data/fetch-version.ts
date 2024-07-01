import papi, { logger } from '@papi/backend';

async function fetchVersion(token: string) {
  const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/version';
  const response = await papi.fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();
  logger.log('Storing version data');

  // Store the entire version data
  localStorage.setItem('versionData', JSON.stringify(data));

  // Extract and store all IDs
  const ids = data.map((item: { id: unknown; }) => item.id); // Assuming data is an array of objects
  localStorage.setItem('versionIds', JSON.stringify(ids));

  return { data, ids };
}

export default fetchVersion;
