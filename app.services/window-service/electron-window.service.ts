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
  const _windowNames$ = new BehaviorSubject<string[]>([]);

  /**
   * Subscribe to the list of active window names
   */
  export function windowNames$(): Observable<string[]> {
    return _windowNames$;
  }

  /**
   * Subscribe to state that is shared between all windows
   */
  export function sharedState$(): Observable<undefined> {
    return this._sharedState$;
  }

  /**
   * Open a new Electron window
   * @param name 
   * @param title 
   * @param loadUrl 
   * @param options (BrowserWindow options)
   */
  export function openWindow(name: string, title: string, loadUrl: string, options?: any) {
    if (name && isWindow(name) === false) {
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
      
      // NOTE: I had to remove + '/app/' when using this in an angular app. ~JV
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
          _windowNames$.next(
            _windows.map((w: ElectronWindowModel) => w.name)
          );
      });
  
      _me.next(window);
      _windows.push(window);
      _windowNames$.next(
        _windows.map((w: ElectronWindowModel) => w.name)
      );
    }
  }

  /**
   * 
   * @param msg Send a message to a window
   */
  export function sendMessage(msg: ElectronWindowMessage) {
    const window = getWindow(msg.to);
    if (window) {
      window.message(msg);
    }
  }

  /**
   * Send a new route to a window
   * @param windowName 
   * @param route 
   */
  export function updateRoute(windowName: string, route: string): void {
    const window = getWindow(windowName);
    if (window) {
      window.route(route);
    }
  }

  /**
   * Update a window's state
   */
  export function updateWindowState(windowName: string, state: any): void {
    const window = getWindow(windowName);
    if (window) {
      window.state(state);
    }
  }

  /**
   * Update state shared between all windows
   */
  export function updateSharedState(state: any): void {
    _sharedState$.next(state);
  }

  /**
   * 
   * @param windowName Close a window
   */
  export function close(windowName: string): void {
    const w = getWindow(windowName);
    if (w && w.browser) {
      w.browser.close();
    } 
  }

  /**
   * Get an ElectronWindowModel object containing the Electron BrowserWindow
   * @param windowName 
   */
  export function getWindow(windowName: string): ElectronWindowModel {
    for(let i = 0; i < _windows.length; i++) {
      if (_windows[i].name === windowName) {
        return _windows[i];
      }
    }
  }

  /**
   * Subscribe to the state from a window
   * @param windowName 
   */
  export function getWindowState$(windowName: string): Observable<any> {
    for(let i = 0; i < _windows.length; i++) {
      if (_windows[i].name === windowName) {
        return _windows[i].state$;
      }
    }
  }

  /**
   * Get the window for a particular renderer process. Note, this only works once!
   */
  export function getMe(): ElectronWindowModel {
    const w = _me.getValue();
    _me.next(undefined);
    return w;
  }

  /**
   * 
   * @param windowName Determine if a window exists
   */
  export function isWindow(windowName: string): boolean {
    let result = false;
    for(let i = 0; i < _windows.length; i++) {
      if (_windows[i].name === windowName) {
        result = true;
      }
    }
    return result;
  }
}

export default ElectronWindowService;