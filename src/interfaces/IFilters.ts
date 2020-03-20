import { DateTypes, NumberTypes, StringTypes } from "types/expressions";

export interface INumberFilter {
  is?: NumberTypes;
  value?: number | boolean;
  values?: number[];
  min?: number;
  max?: number;
}

export interface IStringFilter {
  is?: StringTypes;
  value?: string | boolean;
  values?: string[];
}

export interface IDateFilter {
  is?: DateTypes;
  date?: Date;
  from?: Date;
  to?: Date;
}
