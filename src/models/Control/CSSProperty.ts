import { action, computed, observable } from "mobx";
import ICSSProperty from "interfaces/ICSSProperty";
import React from "react";
import { CSSValueType } from "types/commonTypes";
import { CSS_VALUE_COLOR, CSS_VALUE_NUMBER, CSS_VALUE_SELECT, CSS_VALUE_STRING } from "models/Constants";

export const PROPERTY_EXPANDED = "expanded";
export const CSS_SWITCH_ENABLED = "switchEnabled";
export const CSS_SWITCH_EXPANDED = "switchExpanded";
export const CSS_SET_VALUE = "setValue";

export default class CSSProperty implements ICSSProperty {
  key: keyof React.CSSProperties;
  defaultValue: string | number;
  category: string;
  showWhen?: string[];
  description?: string[];
  options?: string[];
  units?: string[];
  valueType: CSSValueType;
  inject?: string;
  controlProps: {[key: string]: any} = {};
  @observable value: string | number;
  @observable expanded?: boolean;
  @observable enabled: boolean;
  @observable unit?: string;

  get title() {
    const title = [];
    const items = Array.from(this.key);
    while (items.length) {
      const char = items.shift() as string;
      title.push(char === char.toUpperCase() ? "-" + char.toLowerCase() : char);
    }
    return title.join("");
  }

  get isNumber() {
    return this.valueType === CSS_VALUE_NUMBER;
  }

  get isString() {
    return this.valueType === CSS_VALUE_STRING;
  }

  get isColor() {
    return this.valueType === CSS_VALUE_COLOR;
  }

  get isSelect() {
    return this.valueType === CSS_VALUE_SELECT;
  }

  @computed get toJSON() {
    return {
      key: this.key,
      value: this.value,
      defaultValue: this.defaultValue,
      category: this.category,
      enabled: this.enabled,
      expanded: this.expanded,
      inject: this.inject,
      valueType: this.valueType,
      unit: this.unit,
      units: this.units,
    };
  }

  @computed get valueWithUnit() {
    return this.unit ? `${this.value}${this.unit}` : this.value;
  }

  constructor(
    key: keyof React.CSSProperties,
    value: string | number,
    defaultValue: string | number,
    category: string,
    enabled = false,
    valueType: CSSValueType = CSS_VALUE_STRING
    ) {
    this.key = key;
    this.value = value;
    this.defaultValue = defaultValue;
    this.category = category;
    this.enabled = enabled;
    this.valueType = valueType;
  }

  makeExpandable() {
    this.expanded = false;
    return this;
  }

  setInjectable(inject?: string): ICSSProperty {
    this.inject = inject;
    return this;
  }

  setUnits(unit: string, units: string[]): ICSSProperty {
    this.unit = unit;
    this.units = units;
    return this;
  }

  setShowWhen(showWhen?: string[]) {
    this.showWhen = showWhen;
    return this;
  }

  setDescription(description?: string[]) {
    this.description = description;
    return this;
  }

  setControlProps(props: { [p: string]: any }) {
    this.controlProps = props;
    return this;
  }

  setOptions(options?: string[]) {
    this.options = options;
    return this;
  }

  @action setUnit = (unit: string) => {
    this.unit = unit;
  };

  //####### add to the history start #######//

  @action switchExpanded = () => {
    this.expanded = !this.expanded;
  };

  @action switchEnabled = () => {
    this.enabled = !this.enabled;
  };

  @action setValue = (value: string | number) => {
    this.value = value;
  };

  //####### add to the history end #######//

  @action updateProperties(props: {[key: string]: string | number | boolean}) {
    Object.assign(this, props);
  }

  @action clone() {
    const clone = CSSProperty.fromJSON(this);
    return clone;
  }

  static fromJSON(json: ICSSProperty) {
    const prop = new CSSProperty(json.key, json.value, json.defaultValue, json.category, json.enabled, json.valueType)
      .setShowWhen(json.showWhen)
      .setControlProps(json.controlProps || {})
      .setDescription(json.description)
      .setInjectable(json.inject)
      .setOptions(json.options);
    json.expanded !== undefined && prop.makeExpandable();
    json.unit && json.units && prop.setUnits(json.unit, json.units);
    return prop;
  }
}
