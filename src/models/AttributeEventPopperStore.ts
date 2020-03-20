import React from "react";
import {action, computed, observable, when} from "mobx";
import {SystemEventsMainProperties, UserAttributes, UserOptions, VARIABLES} from "models/Constants";
import {IObject} from "interfaces/IObject";
import {ObjectStore} from "models/ObjectStore";
import {UserAttributeObjectStore} from "models/User/UserAttributeObjectStore";
import {EventObjectStore} from "models/Event/EventObjectStore";
import {Events} from "models/Event/EventsStore";
import {IAttributesEventsPopper} from "interfaces/IPopper";

export class AttributeEventPopperStore implements IAttributesEventsPopper {

 readonly keys = observable<string>([]);
 onChoose?: (value: React.ChangeEvent<HTMLInputElement> | string) => void;

 @observable variables: IObject = new ObjectStore(VARIABLES, UserOptions);
 @observable open = false;
 @observable anchorEl?: HTMLButtonElement;


 @computed get currentProperty() {
  let currentObject: IObject = this.variables;
  this.keys.forEach((key: string) => currentObject = currentObject.items.get(key) as IObject);
  return currentObject;
 }

 @computed get size(): number {
  return this.keys.length;
 }

 @computed get lastKey(): string {
  return this.keys[this.size - 1];
 }

 @computed get variable() {
  const variable = this.keys.reduce((a: string, b: string) => a + `["${b}"]`, "VARIABLES");
  return `{{${variable}}}`;
 }

 @computed get variableMargeTags() {
  const variables: {name: string; value: string}[] = [];
  (function traverse(map: IObject, variableName: string | null, variable: string) {
   const keys: string[] = map.keys;
   keys.forEach((key: string) => {
    const value = `${variable}["${key}"]`;
    const name = variableName ? variableName + " " + key : key;
    if (map.hasNext(key)) {
     traverse(map.items.get(key) as IObject, name, value);
    } else {
     variables.push({name, value: `{{${value}}}`});
    }
   });
  })(this.variables, null, "VARIABLES");
  return variables;
 }

 constructor() {
  this.variables.items.set(UserOptions[0], new UserAttributeObjectStore(UserOptions[0], UserAttributes));

  when(() => Events.systemEventsList !== undefined, () => {
   const eventObject = new EventObjectStore(UserOptions[1], Events.systemEventsList as []);
   eventObject.keys.forEach((key: string) => eventObject.addData(key, SystemEventsMainProperties));
   this.variables.items.set(UserOptions[1], eventObject);
  });
  when(() => Events.customEventsList !== undefined, () => {
   this.variables.items.set(UserOptions[2], new EventObjectStore(UserOptions[2], Events.customEventsList as []));
  });
 }

 @action setOpen(open: boolean) {
  this.open = open;
 }

 @action setAnchorEl(e?: HTMLButtonElement) {
  this.anchorEl = e;
 }

 @action handleClick = (e: HTMLButtonElement, cb: (value: React.ChangeEvent<HTMLInputElement> | string) => void) => {
  this.setOpen(this.anchorEl !== e || !this.open);
  this.setAnchorEl(e);
  this.keys.replace([]);
  this.onChoose = cb;
 };

 @action select = (property: string) => {
  const current = this.currentProperty;
  this.keys.push(property);
  if (!current.hasNext(property)) {
   this.onChoose!(this.variable);
   this.clear();
  }
 };

 @action back = () => {
  this.keys.pop();
 };

 @action clear() {
  this.keys.replace([]);
  this.setAnchorEl();
  this.setOpen(false);
  this.onChoose = undefined;
 }

}
