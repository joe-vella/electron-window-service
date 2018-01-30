

export class ElectronWindowMessage {
  constructor(
    public to: string,
    public from: string,
    public payload: any
  ) {} 
}