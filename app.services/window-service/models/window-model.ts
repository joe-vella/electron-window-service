
import {BrowserWindow} from 'electron';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {WindowMessage} from './window-message';

export class WindowModel {
  
  public browser: BrowserWindow;
  private _messages$: BehaviorSubject<WindowMessage>;
  private _messageLog$: BehaviorSubject<WindowMessage[]>;
  private _route$: BehaviorSubject<string>;
  private _state$: BehaviorSubject<any>;

  constructor(
    public name: string,

    private _sharedStateRef$: BehaviorSubject<any>,
    public initialRoute?: string
  ) {
    this._messages$ = new BehaviorSubject<WindowMessage>(undefined);
    this._messageLog$ = new BehaviorSubject<WindowMessage[]>([]);
    this._route$ = new BehaviorSubject<string>(undefined);
    this._state$ = new BehaviorSubject<any>(undefined);

    if (initialRoute) {
      this._route$.next(initialRoute);
    }
  }

  public get messages$(): Observable<WindowMessage> {
    return this._messages$;
  }

  public get route$(): Observable<string> {
    return this._route$;
  }

  public get state$(): Observable<any> {
    return this._state$;
  }

  public get sharedState$(): Observable<any> {
    return this._sharedStateRef$;
  }

  public get messageLog$(): Observable<WindowMessage[]> {
    return this._messageLog$;
  }

  public route(route: string): void {
    this._route$.next(route);
  }

  public state(state: any): void {
    this._state$.next(state);
  }

  public sharedState(state: any): void {
    this._sharedStateRef$.next(state);
  }

  public message(msg: WindowMessage): void {
    const log = this._messageLog$.getValue();
    log.push(msg);
    this._messageLog$.next(log);
    this._messages$.next(msg);
  }
}