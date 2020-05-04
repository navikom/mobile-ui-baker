import {action, observable} from "mobx";
import {IBeefree, ISettings} from "interfaces/ISettings";
import {api, Apis} from "api";
import {Events} from "models/Event/EventsStore";
import {Segments} from "models/Segment/SegmentsStore";

class Beefree implements IBeefree {
 @observable uid: string;
 @observable secret: string;

 constructor(uid: string, secret: string) {
  this.uid = uid;
  this.secret = secret;
 }

 static from(uid: string, secret: string) {
  return new Beefree(uid, secret);
 }
}

class SettingsStore implements ISettings {
 @observable loaded = false;
 beefree: IBeefree;
 bucket: string;
 cloudinaryFolder: string;
 cloudinaryPath: string;

 constructor() {
  this.cloudinaryPath = process.env.REACT_APP_CLOUDINARY_PATH || '';
  this.cloudinaryFolder = process.env.REACT_APP_CLOUDINARY_FOLDER || '';
  this.bucket = process.env.REACT_APP_S3_BUCKET || '';
  this.beefree = Beefree.from(
    process.env.REACT_APP_BEE_PLUGIN_CLIENT_ID || '',
    process.env.REACT_APP_BEE_PLUGIN_CLIENT_SECRET || '');
 }

 @action
 async fetch() {
  try {
   const data = await api(Apis.Main).setting.getData();
   this.update(data);
  } catch (e) {
   console.log("Settings error: %s", e.message);
  }
 }

 @action update(data: ISettings) {
  Events.setSystemEventsList(data.systemEventsList as []);
  Events.setCustomEventsList(data.customEventsList as []);
  Segments.setExpressions(data.expressions as []);
  this.loaded = true;
 }
}

export const Settings = new SettingsStore();
