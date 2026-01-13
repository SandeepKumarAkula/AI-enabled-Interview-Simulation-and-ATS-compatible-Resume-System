const { contextBridge, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcMain.invoke('get-app-version'),
});
