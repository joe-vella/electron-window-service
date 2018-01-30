

export class WindowMessage {
  constructor(
    public to: string,
    public from: string,
    public payload: any
  ) {} 
}