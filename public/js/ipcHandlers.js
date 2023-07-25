const { ipcMain } = require('electron');
const { fork } = require('child_process');
const path = require('path');

let childProcess = null;

function initialize() {
  childProcess = fork(path.join(__dirname, 'pdfParserChild.js'));
}

function parsePDF(filePath) {
  return new Promise((resolve, reject) => {
    childProcess.send(filePath);

    childProcess.once('message', (tables) => {
      resolve(tables);
    });

    childProcess.once('error', (error) => {
      reject(error);
    });
  });
}

module.exports = {
  initialize,
  parsePDF,
};
