
import {ElectronWindowModel} from '../../app.services/window-service/models/electron-window-model';
import {ElectronWindowMessage} from '../../app.services/window-service/models/electron-window-message';
import * as electron from 'electron';

const windowService = electron.remote.require('./app.services/window-service/electron-window.service').ElectronWindowService;
const me: ElectronWindowModel = windowService.getWindow('about');
export const title = 'About Sash';

export function init(): void {
  if (me) {
    me.messages$.subscribe(
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

export function send(msg: string) {
  windowService.sendMessage(new ElectronWindowMessage('main', 'about', msg));
}