import {action, observable, runInAction, when} from "mobx";
import Bee from "@mailupinc/bee-plugin";
import {Settings} from "models/Settings";
import {Dictionary} from "services/Dictionary/Dictionary";
import {ErrorHandler} from "utils/ErrorHandler";
import settings from "config/server";
import oneColumn from "assets/emailTemplates/templates/v2/BF-basic-onecolumn.json";
import blank from "assets/emailTemplates/templates/v2/BF-blank-template.json";
import {AttributeEventPopperStore} from "models/AttributeEventPopperStore";

const BASE_TEMPLATE = "https://rsrc.getbee.io/api/templates/m-bee";

const beeConfig = {
 uid: "",
 container: "bee-plugin-container",
 language: Dictionary.locale,
 specialLinks: [{
  type: "Subscription",
  label: "Unsubscribe",
  link: `${settings.mainApi}/users/VARIABLES["User Attributes"]["userId"]/subscription/1/0`
 }, {
  type: "Subscription",
  label: "Subscribe",
  link: `${settings.mainApi}/users/VARIABLES["User Attributes"]["userId"]/subscription/1/1`
 }],
 mergeTags: [{
  name: "Apply dynamic syntax",
  value: "[name]"
 }],
 autosave: true
};

type BeeCallbacks = {
 onSave(jsonFile: any, htmlFile: any): void;
 onSend(htmlFile: any): void;
 onSaveAsTemplate(jsonFile: any): void;
 onError(errorMessage: string): void;
}

export class BeeStore {
 @observable clientId?: string;
 @observable clientSecret?: string;
 @observable started = false;
 @observable attributesEvents = new AttributeEventPopperStore();
 editor = new Bee();

 constructor() {
  when(() => Settings.beefree !== undefined, () => {
   runInAction(() => {
    this.clientId = Settings.beefree!.uid;
    this.clientSecret = Settings.beefree!.secret;
   });
  });
 }

 @action start(callbacks: BeeCallbacks) {
  beeConfig.mergeTags = this.attributesEvents.variableMargeTags;
  Object.assign(beeConfig, callbacks, {uid: this.clientId as string});
  this.editor.start(beeConfig, oneColumn).then(() => {
   runInAction(() => {
    this.started = true;
   });
  }).catch((err) => console.log("Bee start error:", err));
 }

 save = () => {
  this.editor.save();
 };

 preview = () => {
  this.editor.preview();
 };

 @action load(template: any) {
  this.editor.load(template);
 }

 emptyTemplate = () => {
  this.editor.load(blank);
 };

 toggleStructure = () => {
  this.editor.toggleStructure();
 };
 saveAsTemplate = () => {
  this.editor.saveAsTemplate();
 };
 send = () => {
  this.editor.send();
 };

 onFetchBeeToken() {
  if (this.clientId && this.clientSecret) {
   return this.editor.getToken(this.clientId, this.clientSecret);
  }
  throw new ErrorHandler("There is no client id");
 }

 onFetchTemplate() {
  return fetch(BASE_TEMPLATE)
    .then((response) => response.json());
 }
}
