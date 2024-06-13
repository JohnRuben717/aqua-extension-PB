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

  //next run in 25 minutes
  setTimeout(runMainScript, 10000);
};
 
runMainScript();
