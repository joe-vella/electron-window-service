import * as electron from 'electron';
import {WindowService} from './app.services/window-service/window.service';

// Module to control application life.
const app = electron.app;
const windowService = WindowService;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  windowService.openWindow('main', 'Main Window', 'app.component.html', {width: 800, height: 600});
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (mainWindow === null) {
  //   createMain();
  // }

  windowService.openWindow('main', 'Main Window', 'app/app.component.html', {width: 800, height: 600});
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
