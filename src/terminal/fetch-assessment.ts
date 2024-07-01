import { writeJsonFile } from 'write-json-file'; // Import the write-json-file module
import tokenData from './tokenData.json';

async function fetchAssessment(token: string) {
  const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/assessment';
  
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
  // localStorage.setItem('assessmentData', JSON.stringify(data));

  // Use write-json-file to save the data
  await writeJsonFile('assessmentData.json', data);

  return data;
}

export default fetchAssessment;

fetchAssessment(tokenData.access_token)
