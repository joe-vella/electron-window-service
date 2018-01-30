import {BrowserWindow} from 'electron';
import {WindowModel} from './models/window-model';
import {WindowMessage} from './models/window-message';
import {Observable} from 'rxjs/observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as path from 'path';
import * as url from 'url';

export module ElectronWindowService {

  let main: BrowserWindow;
  let windows: WindowModel[] = [];
  const sharedState$ = new BehaviorSubject<any>(undefined);

  export function openWindow(name: string, title: string, loadUrl: string, options?: any) {
    if (!windows.find(
      (w: WindowModel) => w.name === name
    )) {
      const window = new WindowModel(name, sharedState$, loadUrl) ;
      let dir = __dirname.slice(0, __dirname.lastIndexOf('\\'));
      dir = dir.slice(0, dir.lastIndexOf('\\'));
  
      if (name !== 'main') {
        if (!options) {
          options = {parent: main};
        } else { 
          options.parent = main;
        }
      }
      
      window.browser = new BrowserWindow(options);
      window.browser.setTitle(title);
      
      window.browser.loadURL(url.format({
        pathname: path.join(dir + '/app/', loadUrl),
        protocol: 'file:',
        slashes: true
      }));
  
      // Open the DevTools.
      window.browser.webContents.openDevTools();
      if (name === 'main') {
        main = window.browser;
      }
  
      window.browser.on('closed', function () {
          window.browser = null;
          windows = windows.filter(
            (w: WindowModel) => w.name !== name
          );
      });
  
      windows.push(window);
    }
  }

  export function sendMessage(msg: WindowMessage) {
    const window = getWindow(msg.to);
    if (window) {
      window.message(msg);
    }
  }

  export function updateRoute(windowName: string, route: string): void {
    const window = getWindow(windowName);
    if (window) {
      window.route(route);
    }
  }

  export function updateState(windowName: string, route: string): void {
    const window = getWindow(windowName);
    if (window) {
      window.route(route);
    }
  }


  export function getWindow(windowName: string): WindowModel {
    for(let i = 0; i < windows.length; i++) {
      if (windows[i].name === windowName) {
        return windows[i];
      }
    }
  }

  export function getWindowState(windowName: string): Observable<any> {
    for(let i = 0; i < windows.length; i++) {
      if (windows[i].name === windowName) {
        return windows[i].state$;
      }
    }
  }
}

export default ElectronWindowService;