import { IAndroidDevice, IIOSDevice } from "interfaces/ISegmentDevice";

export interface IDeviceInfoData {
  name: string;
  version: string;
  properties: IAndroidDevice | IIOSDevice;
}
export interface IDeviceInfo {
  BROWSER: IDeviceInfoData;
  OS: IDeviceInfoData;
  headers: string;
  params: { [key: string]: string };
}
