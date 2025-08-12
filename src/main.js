// app/src/main.js
const { app, BrowserWindow, session } = require('electron');

let mainWindow; // single window ref

// Dev CSP so fetch() to 127.0.0.1:5000 works
const DEV_CSP = [
  "default-src 'self' data: blob:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' http://127.0.0.1:5000 ws: http: https:",
  "worker-src 'self' blob:"
].join('; ');

// Create (or focus) the single window
function createWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.on('closed', () => { mainWindow = null; });

  // Load renderer
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

// Enforce single-instance
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => createWindow());

  app.whenReady().then(() => {
    // Force dev CSP via header (beats any meta/webpack default)
    session.defaultSession.webRequest.onHeadersReceived((details, cb) => {
      const headers = details.responseHeaders || {};
      headers['Content-Security-Policy'] = [DEV_CSP];
      cb({ responseHeaders: headers });
    });

    createWindow();
  });

  // macOS: re-create when dock icon clicked and no windows open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Win/Linux: quit when all windows closed
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
