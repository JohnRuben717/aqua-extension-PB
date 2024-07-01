import fetchText from './fetch-text'; // Assuming your function is exported from fetchText.ts

// This function fetches and stores texts for each revision ID stored in localStorage
async function fetchAndStoreTexts(token: string): Promise<void> {
  const versionData = localStorage.getItem('versionData');
  if (!versionData) {
    console.error('Version data not found in localStorage.');
    return;
  }

  const data = JSON.parse(versionData);
  const revisionIds: string[] = data.ids; // Assuming these are stored as strings

  for (const revisionId of revisionIds) {
    try {
      const fetchedData = await fetchText(token, revisionId);
      console.log(`Data fetched for revisionId ${revisionId}:`, fetchedData);
    } catch (error) {
      console.error(`Error fetching data for revisionId ${revisionId}:`, error);
    }
  }
}

// Example usage
// fetchAndStoreTexts('your_access_token_here');
export default fetchAndStoreTexts;
