import jwt, { JwtPayload } from 'jsonwebtoken';
import { exec } from 'child_process';
import postData from './apicomponent';

const runMainScript = () => {
  console.log('Executing script...');
  exec('npx tsx apicomponent.tsx', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stdout) console.log(`Output: ${stdout}`);
    if (stderr) console.error(`Error: ${stderr}`);
  });
};

const decodeAndSchedule = async () => {
  try {
    const token = await postData();
    // Quick and dirty type fix
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded && decoded.exp) {
      const expirationTimeMs = decoded.exp * 1000; // Convert seconds to milliseconds
      const currentTimeMs = Date.now();
      const delayMs = expirationTimeMs - currentTimeMs;
      const delayMinutes = delayMs / 60000; // Convert milliseconds to minutes
      const reducedDelayMs = delayMs - 300000; // Reduce delay by 5 minutes (300000 milliseconds)
      const reducedDelayMinutes = reducedDelayMs / 60000; // Convert reduced milliseconds to minutes

      console.log(`Original scheduling time: ${delayMs} milliseconds (${delayMinutes} minutes).`);
      console.log(
        `Adjusted scheduling time: ${reducedDelayMs} milliseconds (${reducedDelayMinutes} minutes).`,
      );

      setTimeout(runMainScript, reducedDelayMs);
    } else {
      console.error('Expiration time not found in token');
    }
  } catch (error) {
    console.error(`Error retrieving or decoding token: ${error}`);
  }
};

decodeAndSchedule();
