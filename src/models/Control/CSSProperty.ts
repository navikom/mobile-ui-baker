import { action, IObservableArray, observable } from "mobx";
import ICSSProperty from "interfaces/ICSSProperty";
import React from "react";

export default class CSSProperty implements ICSSProperty {
  key: keyof React.CSSProperties;
  value: string | number;
  defaultValue: string | number;
  @observable children: IObservableArray<ICSSProperty> = observable([]);
  @observable expanded: boolean = false;


  get toJSON() {
    return {
      key: this.key,
      value: this.value,
      children: this.children.map(child => child.toJSON)
    };
  }

  constructor(key: keyof React.CSSProperties, value: string | number, defaultValue: string | number, children: ICSSProperty[] = []) {
    this.key = key;
    this.value = value;
    this.defaultValue = defaultValue;
    this.children.replace(children);
  }

  @action switchExpanded(): void {
    this.expanded = !this.expanded;
    if(!this.expanded) {
      this.children.forEach(child => (child.value = child.defaultValue));
    }
  }

  @action setValue(value: string | number) {
    this.value = value;
  }

  @action clone() {
    const clone = CSSProperty.fromJSON(this);
    clone.children.replace(this.children.map(child => child.clone()));
    return clone;
  }

  static fromJSON(json: ICSSProperty) {
    return new CSSProperty(json.key, json.value, json.defaultValue, json.children);
  }
}
