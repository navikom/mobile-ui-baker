export interface IBeefree {
  uid: string;
  secret: string;
}

export interface ISettings {
  loaded: boolean;
  cloudinaryPath?: string;
  cloudinaryFolder?: string;
  bee?: string;
  beefree?: IBeefree;
  systemEventsList?: string[];
  customEventsList?: string[];
  expressions?: string[];
}
