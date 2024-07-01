import papi, { logger } from '@papi/backend';

async function fetchBook(token: string) {
  const url = `https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/text?revision_id=34`;
  // const url = `https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/book?revision_id=34&book=GEN`;

  // logger.info(fetchText - token: ${token}, revisionId: ${revisionId});
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
  console.log(data);
  logger.log('Storing revision data');
  // localStorage.setItem('textData', JSON.stringify(data));
  return data;
}

export default fetchBook;
