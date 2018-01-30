
import {WindowModel} from '../app.services/window-service/models/window-model';
import {WindowMessage} from '../app.services/window-service/models/window-message';
import * as electron from 'electron';

const windowService = electron.remote.require('./app.services/window-service/electron-window.service').ElectronWindowService;
const me: WindowModel = windowService.getWindow('main');

export const title = 'Welcome to Sash';

export function init(): void {
  if (me) {
    me.messages$.subscribe(
      (msg: WindowMessage) => {
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
  windowService.sendMessage(new WindowMessage('about', 'main', msg));
}

export function about() {
  windowService.openWindow('about', 'About', 'about/about.component.html', {width: 800, height: 600});
}