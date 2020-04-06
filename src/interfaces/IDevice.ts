import { IDeviceInfo } from "interfaces/IDeviceInfo";

export interface IIUsersDevices {
  createdAt: Date;
}

export interface IDevice {
  info: IDeviceInfo;
  createdAt: Date;
  plainData: string[][];
  IUsersDevices?: IIUsersDevices;
}
