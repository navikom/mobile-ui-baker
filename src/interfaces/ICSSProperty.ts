import React from 'react';
import { CSSValueType } from 'types/commonTypes';

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
  inject?: string;
  units?: string[];
  unit?: string;
  valueWithUnit: string | number;

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

  switchEnabled(): void;

  updateProperties(props: { [key: string]: string | number | boolean }): void;

  setControlProps(props: { [key: string]: any }): void;
}
