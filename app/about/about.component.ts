
import {WindowModel} from '../../app.services/window-service/models/window-model';
import {WindowMessage} from '../../app.services/window-service/models/window-message';
import * as electron from 'electron';

const windowService = electron.remote.require('./app.services/window-service/window.service').WindowService;
const me: WindowModel = windowService.getWindow('about');
export const title = 'About Sash';

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
  windowService.sendMessage(new WindowMessage('main', 'about', msg));
}