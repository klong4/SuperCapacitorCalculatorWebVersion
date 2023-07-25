const { spawn } = require('child_process');
const path = require('path');

async function processFile(filePath) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'python', 'parse_pdf.py');
    const python = spawn('python', [scriptPath, filePath]);

    let output = "";
    python.stdout.on('data', (data) => {
      output += data;
    });

    python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.log(`child process exited with code ${code}`);
        reject(`child process exited with code ${code}`);
      } else {
        console.log(`Output: ${output}`);
        resolve(output);
      }
    });
  });
}

process.on('message', async (filePath) => {
  const output = await processFile(filePath);
  process.send(output);
});
