const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    console.log('dist/index.html')
  } else {
    mainWindow.loadURL('http://localhost:5173');
    console.log('http://localhost:5173')
  }

  // 👉 DEBUG
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);