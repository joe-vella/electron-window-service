
import {ElectronWindowModel} from '../app.services/window-service/models/electron-window-model';
import {ElectronWindowMessage} from '../app.services/window-service/models/electron-window-message';
import * as electron from 'electron';

let _windowName = '';
const _windowService = electron.remote.require('./app.services/window-service/electron-window.service').ElectronWindowService;
const _me: ElectronWindowModel = _windowService.getMe();

export const title = "Welcome to Electron Window Service";
export function windowName() { return _windowName; };

export function init(): void {
  if (_me) {
    _windowName = _me.name;
    watchMessages();
    watchWindowNames();
  }
}

export function send(msg: string): void {
  _windowService.sendMessage(new ElectronWindowMessage('about', 'main', msg));
}

export function about(): void {
  _windowService.openWindow('about', 'About', 'about/about.component.html', {width: 800, height: 600});
}

export function closeAbout(): void {
  _windowService.close('about');
}

function watchMessages(): void {
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

function watchWindowNames(): void {
  _windowService.windowNames$().subscribe(
    (names: string[]) => {
      const list = document.getElementById('windowList');
      let items = '';
      names.forEach(
        (name: string) => items = `${items}${name}<br/>`
      );
      list.innerHTML = items;
    }
  );
}