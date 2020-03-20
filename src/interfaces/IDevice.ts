import { IDeviceInfo } from "interfaces/IDeviceInfo";

export interface IDevice {
  info: IDeviceInfo;
  createdAt: Date;
  plainData: string[][];
}
