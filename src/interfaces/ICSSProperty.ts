import React from 'react';
import { CSSValueType } from 'types/commonTypes';
import IControl from './IControl';
import { DeviceEnum } from '../enums/DeviceEnum';

export default interface ICSSProperty {
  controlProps?: { [key: string]: any };
  key: keyof React.CSSProperties;
  value: string | number;
  toJSON: { [key: string]: any };
  expanded?: boolean;
  enabled: boolean;
  category: string;
  defaultValue: string | number;
  showWhen?: string[];
  description?: string[];
  options?: string[];
  title: string;
  valueType: CSSValueType;
  isNumber: boolean;
  isString: boolean;
  isColor: boolean;
  isSelect: boolean;
  isBorder: boolean;
  inject?: string;
  units?: string[];
  unit?: string;
  cssValue: string | number;

  setEnabled(value: boolean): void;
  valueWithUnit(device: DeviceEnum, isPortrait: boolean): string | number;

  setUnits(unit: string, units: string[]): ICSSProperty;

  setUnit(unit: string): void;

  makeExpandable(): void;

  setInjectable(inject?: string): ICSSProperty;

  setShowWhen(showWhen?: string[]): ICSSProperty;

  setDescription(description?: string[]): ICSSProperty;

  setOptions(options?: string[]): ICSSProperty;

  setValue(value: string | number): void;

  clone(): ICSSProperty;

  switchExpanded(): void;

  switchEnabled(control: IControl, styleName: string): void;

  updateProperties(props: { [key: string]: string | number | boolean }, control: IControl, styleName: string, isMenu?: boolean): void;

  setControlProps(props: { [key: string]: any }): void;

  toString(): void;
}
