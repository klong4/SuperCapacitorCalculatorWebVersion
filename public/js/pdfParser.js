const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/legacy/build/pdf.worker.js');

const path = require('path');
const fs = require('fs');

async function getTextContent(page) {
  const textContent = await page.getTextContent();
  const strings = textContent.items.map(item => item.str);
  return strings.join(' ');
}

async function extractTablesFromPage(page) {
  const text = await getTextContent(page);
  const lines = text.split('\n');
  const tables = [];
  let currentTable = [];

  for (const line of lines) {
    if (line.trim() === '') {
      if (currentTable.length > 0) {
        tables.push(currentTable);
        currentTable = [];
      }
    } else {
      currentTable.push(line.split(/\s+/));
    }
  }

  if (currentTable.length > 0) {
    tables.push(currentTable);
  }

  return tables;
}

async function processFile(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const allTables = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const tablesOnPage = await extractTablesFromPage(page);
    allTables.push(...tablesOnPage);
  }

  return allTables;
}

process.on('message', async (message) => {
  try {
    const result = await processFile(message.filePath);
    process.send({ result });
  } catch (error) {
    process.send({ error: error.message });
  }
});
