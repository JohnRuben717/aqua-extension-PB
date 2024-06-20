import papi, { logger } from '@papi/backend';

async function fetchAssessment(token: string) {
  const url = 'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/result?assessment_id=1534';
  // logger.info(`fetchAssessment - token: ${JSON.stringify(token)}`);
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
  logger.info(JSON.stringify(data));
  localStorage.setItem('assessmentData', JSON.stringify(data));
  return data;
}

export default fetchAssessment;
