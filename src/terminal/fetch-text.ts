import { writeJsonFile } from 'write-json-file';
import tokenData from './tokenData.json';
import ids from './versionData.json';

async function fetchBook(token) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  for (const revision of ids) {
    const { id, name } = revision;
    const url = `https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest/text?revision_id=${id}`;
    console.log(`fetchBook - token: ${token}, revisionId: ${id}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.access_token}` },
        signal: controller.signal
      });

      clearTimeout(timeoutId); // Clear the timeout if the request completes

      if (!response.ok) {
        console.error(`Failed to fetch data for revision ${id}: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      console.log(`Data fetched for revision ${id}`);
      await writeJsonFile(`books/${name}.json`, data);
    } catch (error) {
      console.error(`Error fetching data for revision ${id}: ${error.message}`);
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      }
    }
  }
}

fetchBook(tokenData);
