import { action, observable } from "mobx";
import ICSSProperty from "interfaces/ICSSProperty";
import React from "react";

export default class CSSProperty implements ICSSProperty {
  key: keyof React.CSSProperties;
  value: string | number;
  @observable enabled: boolean;

  get toJSON() {
    return {
      key: this.key,
      value: this.value,
      enabled: this.enabled
    };
  }

  constructor(key: keyof React.CSSProperties, value: string | number, enabled: boolean = false) {
    this.key = key;
    this.value = value;
    this.enabled = enabled;
  }

  @action switchEnabled(): void {
    this.enabled = !this.enabled;
  }

  @action setValue(value: string | number) {
    this.value = value;
  }

  @action clone() {
    return new CSSProperty(this.key, this.value, this.enabled);
  }

  static fromJSON(json: ICSSProperty) {
    return new CSSProperty(json.key, json.value, json.enabled);
  }
}
