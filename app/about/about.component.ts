
import {ElectronWindowModel} from '../../app.services/window-service/models/electron-window-model';
import {ElectronWindowMessage} from '../../app.services/window-service/models/electron-window-message';
import * as electron from 'electron';

let _windowName = '';
const _windowService = electron.remote.require('./app.services/window-service/electron-window.service').ElectronWindowService;
const _me: ElectronWindowModel = _windowService.getWindow('about');
export const title = 'About Electron Window Service';
export function windowName() { return _windowName; };

export function init(): void {
  if (_me) {
    _windowName = _me.name;
    _me.messages$.subscribe(
      (msg: ElectronWindowMessage) => {
        if (msg) {
          const messages = document.getElementById('messages').innerHTML;
          console.log(`Message: ${msg.payload}`);
          document.getElementById('messages').innerHTML = `${messages}<p>${msg.payload}</p>`;
        }
      }
    );
  }
}

export function send(msg: string): void {
  _windowService.sendMessage(new ElectronWindowMessage('main', 'about', msg));
}