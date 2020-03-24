import React from "react";
import { IObservableArray } from "mobx";

export default interface ICSSProperty {
  key: keyof React.CSSProperties;
  value: string | number;
  toJSON: {[key: string]: any};
  expanded: boolean;
  defaultValue: string | number;
  children: IObservableArray<ICSSProperty>;

  setValue(value: string | number): void;
  clone(): ICSSProperty;
  switchExpanded(): void;

}
