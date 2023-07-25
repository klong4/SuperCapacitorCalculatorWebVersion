// app.js
const { app, ipcMain } = require('electron');
const express = require('express');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const { fork } = require('child_process');

const appExpress = express();

appExpress.use(express.json({ limit: '500mb' }));
appExpress.use(express.urlencoded({ limit: '500mb', extended: true }));
appExpress.use(express.static(path.join(__dirname, 'public')));

appExpress.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

appExpress.get('/pdf-parse', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pdf-parse.html'));
});

appExpress.post('/api/parse-pdf', upload.single('pdf'), async (req, res) => {
  const filePath = req.file.path;
  console.log(`Processing file at path: ${filePath}`);  // Log the file path
  try {
    const pdfParserChild = fork(path.join(__dirname, 'public', 'js', 'pdfParserChild.js'));
    pdfParserChild.send(filePath);
    pdfParserChild.on('message', (output) => {
      res.json({ output });
    });
  } catch (error) {
    console.error('Error in /api/parse-pdf:', error);
    res.status(500).json({ error: 'Error parsing PDF file' });
  } finally {
    fs.unlinkSync(filePath);
  }
});

const port = process.env.PORT || 3000;

app.on('ready', () => {
  if (app.dock) {
    app.dock.hide();
  }

  appExpress.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
