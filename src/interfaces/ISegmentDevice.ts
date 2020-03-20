
import { IDateFilter, INumberFilter, IStringFilter } from "interfaces/IFilters.ts";
import { ISegmentViewForm } from "interfaces/ISegmentViewForm";

export interface ISegmentDevice {
  appInstallationDate?: IDateFilter;
  lastSeen?: IDateFilter;
  totalTimeSpent?: INumberFilter;
  appVersionName?: IStringFilter;
  appId?: IStringFilter;
  appVersionCode?: INumberFilter;
  advertisingId?: INumberFilter;
  apiVersion?: INumberFilter;
  sdkVersion?: INumberFilter;
  model?: IStringFilter;
  locale?: IStringFilter;
}

export interface IAndroidDevice extends ISegmentDevice {
  androidId?: INumberFilter;
  manufacturer?: IStringFilter;
  brand?: IStringFilter;
}

export interface IIOSDevice extends ISegmentDevice {
  vendorId?: INumberFilter;
}

export interface ISegmentDevice extends ISegmentViewForm {
  currentPropertyName?: string;
  date?: Date;
  from?: Date;
  to?: Date;

  setPropertyName(name: string): void;
  clear(): void;
}
