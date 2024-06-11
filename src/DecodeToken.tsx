// DecodeToken.tsx

import { postData } from './apicomponent';
import jwt from 'jsonwebtoken';
import { exec } from 'child_process';

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
    const decoded: any = jwt.decode(token) as any;
    if (decoded && decoded.exp) {
      const expirationTimeMs = decoded.exp * 1000; // Convert seconds to milliseconds
      const currentTimeMs = Date.now();
      const delayMs = expirationTimeMs - currentTimeMs;

      console.log(`Scheduling script to run in ${delayMs} milliseconds.`);

      setTimeout(runMainScript, delayMs);
    } else {
      console.error('Expiration time not found in token');
    }
  } catch (error) {
    console.error(`Error retrieving or decoding token: ${error.message}`);
  }
};

decodeAndSchedule();
