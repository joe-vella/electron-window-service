import {BrowserWindow} from 'electron';
import {ElectronWindowModel} from './models/electron-window-model';
import {ElectronWindowMessage} from './models/electron-window-message';
import {Observable} from 'rxjs/observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as path from 'path';
import * as url from 'url';

export module ElectronWindowService {

  let _main: BrowserWindow;
  let _windows: ElectronWindowModel[] = [];
  const _me = new BehaviorSubject<ElectronWindowModel>(undefined);
  const _sharedState$ = new BehaviorSubject<any>(undefined);

  export function openWindow(name: string, title: string, loadUrl: string, options?: any) {
    if (!_windows.find(
      (w: ElectronWindowModel) => w.name === name
    )) {
      const window = new ElectronWindowModel(name, _sharedState$, loadUrl) ;
      let dir = __dirname.slice(0, __dirname.lastIndexOf('\\'));
      dir = dir.slice(0, dir.lastIndexOf('\\'));
  
      if (name !== 'main') {
        if (!options) {
          options = {parent: _main};
        } else { 
          options.parent = _main;
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
        _main = window.browser;
      }
  
      window.browser.on('closed', function () {
          window.browser = null;
          _windows = _windows.filter(
            (w: ElectronWindowModel) => w.name !== name
          );
      });
  
      _windows.push(window);
      _me.next(window);
    }
  }

  export function sendMessage(msg: ElectronWindowMessage) {
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

  export function getWindow(windowName: string): ElectronWindowModel {
    for(let i = 0; i < _windows.length; i++) {
      if (_windows[i].name === windowName) {
        return _windows[i];
      }
    }
  }

  export function windowState$(windowName: string): Observable<any> {
    for(let i = 0; i < _windows.length; i++) {
      if (_windows[i].name === windowName) {
        return _windows[i].state$;
      }
    }
  }

  export function getMe(): ElectronWindowModel {
    const w = _me.getValue();
    _me.next(undefined);
    return w;
  }
}

export default ElectronWindowService;