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
 @observable cloudinaryPath?: string;
 @observable cloudinaryFolder?: string;
 @observable beefree?: IBeefree;

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
  this.cloudinaryPath = data.cloudinaryPath;
  this.cloudinaryFolder = data.cloudinaryFolder;
  const beefree = data.bee!.split("___");
  this.beefree = Beefree.from(beefree[0], beefree[1]);
  Events.setSystemEventsList(data.systemEventsList as []);
  Events.setCustomEventsList(data.customEventsList as []);
  Segments.setExpressions(data.expressions as []);
  this.loaded = true;
 }
}

export const Settings = new SettingsStore();
