/* eslint-disable @typescript-eslint/no-unused-vars */
import { action, computed, observable } from 'mobx';
import ICSSProperty from 'interfaces/ICSSProperty';
import React from 'react';
import { CSSValueType } from 'types/commonTypes';
import {
  CSS_VALUE_BORDER,
  CSS_VALUE_COLOR,
  CSS_VALUE_NUMBER,
  CSS_VALUE_SELECT,
  CSS_VALUE_STRING,
  DEVICE_HEIGHT,
  DEVICE_WIDTH
} from 'models/Constants';
import IControl from 'interfaces/IControl';
import { DeviceEnum } from 'enums/DeviceEnum';
import DeviceSizes from '../DeviceSizes';

export const PROPERTY_EXPANDED = 'expanded';
export const CSS_SWITCH_ENABLED = 'switchEnabled';
export const CSS_SWITCH_EXPANDED = 'switchExpanded';
export const CSS_SET_VALUE = 'setValue';

export default class CSSProperty implements ICSSProperty {
  static BORDER_KEYS = ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft'];
  // colors
  @observable static colors: Map<string, string[]> = new Map<string, string[]>();
  @observable static controlColor: Map<string, string> = new Map<string, string>();
  @observable static controlBackgroundColor: Map<string, string> = new Map<string, string>();
  // borders
  @observable static borders: Map<string, string[]> = new Map<string, string[]>();
  @observable static colorsBorders: Map<string, string[]> = new Map<string, string[]>();
  @observable static controlBorders: Map<string, (string | null)[]> = new Map<string, (string | null)[]>();

  key: keyof React.CSSProperties;
  defaultValue: string | number;
  category: string;
  showWhen?: string[];
  description?: string[];
  options?: string[];
  units?: string[];
  valueType: CSSValueType;
  inject?: string;
  controlProps: { [key: string]: any } = {};
  @observable value: string | number;
  @observable expanded?: boolean;
  @observable enabled: boolean;
  @observable unit?: string;

  get title() {
    const title = [];
    const items = Array.from(this.key);
    while (items.length) {
      const char = items.shift() as string;
      title.push(char === char.toUpperCase() ? '-' + char.toLowerCase() : char);
    }
    return title.join('');
  }

  get cssValue() {
    if (this.isNumber) {
      return this.value;
    } else if (this.isString) {
      return this.value.toString();
    } else if (this.isColor) {
      return this.value.toString();
    }
    return this.value;
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

  get isBorder() {
    return this.valueType === CSS_VALUE_BORDER;
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

  valueWithUnit(device: DeviceEnum, isPortrait: boolean) {
    return computed(() => {
      if (this.unit && [DEVICE_WIDTH, DEVICE_HEIGHT].includes(this.unit)) {
        const size = DeviceSizes[device as DeviceEnum.IPHONE_6];
        const value = this.value as number;
        if (this.unit === DEVICE_WIDTH) {
          return value * (isPortrait ? size.width : size.height);
        }
        return value * (isPortrait ? size.height : size.width);
      }
      return this.unit ? `${this.value}${this.unit}` : this.value
    }).get();
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

  @action switchEnabled = (control: IControl, styleName: string) => {
    this.enabled = !this.enabled;
    if (this.enabled) {
      CSSProperty.addColor(control, styleName, this);
    } else {
      CSSProperty.deleteColor(control, styleName, this.key, this.value as string);
    }
  };

  @action setEnabled(value: boolean) {
    this.enabled = value;
  }

  @action setValue = (value: string | number) => {
    this.value = value;
  };

  //####### add to the history end #######//

  @action updateProperties(props: { [key: string]: string | number | boolean }, control: IControl, styleName: string) {
    Object.assign(this, props);
    if (props.enabled) {
      CSSProperty.addColor(control, styleName, this);
    } else if (!props.enabled) {
      CSSProperty.deleteColor(control, styleName, this.key, this.value as string);
    }

  }

  @action clone() {
    const clone = CSSProperty.fromJSON(this);
    return clone;
  }

  toString() {
    return `{
      key: "${this.key}",
      value: ${this.valueType === CSS_VALUE_NUMBER ? this.value : '"' + this.value + '"'},
      unit: ${this.unit ? '"' + this.unit + '"' : undefined},
    }`
  }

  //######### static ##########//

  @action
  static addColor(control: IControl, styleName: string, property: ICSSProperty) {
    const key = property.key;
    if (!['color', 'backgroundColor'].includes(key)) {
      this.addBorder(control, styleName, property);
      return;
    }
    if(!property.enabled) {
      return;
    }

    const value = property.value as string;
    const id = control.id + '_' + styleName;

    if (!this.colors.has(value)) {
      this.colors.set(value, []);
    }
    !this.colors.get(value)!.includes(id) && this.colors.get(value)!.push(control.id);

    if (key === 'color') {
      this.controlColor.set(id, value);
    } else if (key === 'backgroundColor') {
      this.controlBackgroundColor.set(id, value);
    }
  }

  @action
  static deleteColor(control: IControl, styleName: string, key: keyof React.CSSProperties, value: string) {
    if (!['color', 'backgroundColor'].includes(key)) {
      this.deleteBorder(control, styleName, key, value);
      return;
    }
    const id = control.id + '_' + styleName;
    if (key === 'color') {
      this.controlColor.has(id) && this.controlColor.delete(id);
    } else if (key === 'backgroundColor') {
      this.controlBackgroundColor.has(id) && this.controlBackgroundColor.delete(id);
    }
    if (!this.controlColor.has(id) && !this.controlBackgroundColor.has(id) && this.colors.has(value)) {
      const arr = this.colors.get(value);
      const index = arr!.indexOf(control.id);
      index > -1 && arr!.splice(index, 1);
      if (arr!.length === 0) {
        this.colors.delete(value);
      }
    }
  }

  @action
  static addBorder(control: IControl, styleName: string, property: ICSSProperty) {
    const key = property.key;
    if (!this.BORDER_KEYS.includes(key) || !property.enabled) {
      return;
    }
    const value = property.value as string;

    const [_, __, ...rest] = value.split(' ');
    const color = rest.join(' ');
    const id = control.id + '_' + styleName;

    if (!this.borders.has(value)) {
      this.borders.set(value, []);
    }
    !this.borders.get(value)!.includes(control.id) && this.borders.get(value)!.push(control.id);
    !this.colorsBorders.has(color) && this.colorsBorders.set(color, []);
    !this.colorsBorders.get(color)!.includes(value) && this.colorsBorders.get(color)!.push(value);


    if (!this.controlBorders.has(id)) {
      this.controlBorders.set(id, [null, null, null, null, null]);
    }
    const index = this.BORDER_KEYS.indexOf(key);
    this.controlBorders.get(id)![index] = value;

  }

  @action
  static deleteBorder(control: IControl, styleName: string, key: keyof React.CSSProperties, value: string) {
    if (!['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft'].includes(key)) {
      return;
    }

    const id = control.id + '_' + styleName;

    if(!this.controlBorders.has(id)) {
      return;
    }

    const [_, __, ...rest] = value.split(' ');
    const color = rest.join(' ');
    const index = this.BORDER_KEYS.indexOf(key);
    this.controlBorders.get(id)![index] = null;
    const hasValue = this.controlBorders.get(id)!.find(e => e !== null);
    if(!hasValue) {
      this.controlBorders.delete(id);

      // delete control ids list from borders map if list empty after control id deletion
      const controls = this.borders.get(value);
      const controlsIndex = controls!.indexOf(control.id);
      controls!.splice(controlsIndex, 1);
      !controls!.length && this.borders.delete(value);

      // delete border values list from colorsBorders map if list empty after border value deletion
      const borders = this.colorsBorders.get(color);
      const bordersIndex = borders!.indexOf(value);
      borders!.splice(bordersIndex, 1);
      !borders!.length && this.colorsBorders.delete(color);
    }
  }

  static clear() {
    Array.from(this.colors.keys()).forEach(key => this.colors.delete(key));
    Array.from(this.controlColor.keys()).forEach(key => this.controlColor.delete(key));
    Array.from(this.controlBackgroundColor.keys()).forEach(key => this.controlBackgroundColor.delete(key));

    Array.from(this.borders.keys()).forEach(key => this.borders.delete(key));
    Array.from(this.colorsBorders.keys()).forEach(key => this.colorsBorders.delete(key));
    Array.from(this.controlBorders.keys()).forEach(key => this.controlBorders.delete(key));
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
