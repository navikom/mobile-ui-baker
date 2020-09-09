export interface IBeefree {
  uid: string;
  secret: string;
}

export interface ISettings {
  loaded: boolean;
  cloudinaryPath: string;
  cloudinaryFolder: string;
  beefree: IBeefree;
  systemEventsList?: string[];
  customEventsList?: string[];
  expressions?: string[];
  bucket: string;
  x: number;
  y: number;
  onDrag: (x: number, y: number) => void;
}
