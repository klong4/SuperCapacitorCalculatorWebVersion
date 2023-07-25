window.onload = () => {
  const parseButton = document.getElementById('parse-button');
  const resultArea = document.getElementById('result-area');

  parseButton.addEventListener('click', () => {
    const filePath = document.getElementById('file-path').value;
    window.electron.send('parse-pdf', filePath);
  });

  window.electron.on('pdf-parsed', (tables) => {
    resultArea.value = JSON.stringify(tables, null, 2);
  });
  
  ipcRenderer.on('pdf-parsed', (event, output) => {
    console.log(output);
    // Display the output in the window
  });
};
