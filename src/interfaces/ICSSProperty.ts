import React from "react";

export default interface ICSSProperty {
  key: keyof React.CSSProperties;
  value: string | number;
  enabled: boolean;
  toJSON: {[key: string]: any};

  switchEnabled(): void;
  setValue(value: string | number): void;
  clone(): ICSSProperty;
}
