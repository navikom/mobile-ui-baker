import { IDevice } from "interfaces/IDevice";

export interface IUsersDevices {
  deviceId: number;
  createdAt: Date;
  device: IDevice;

  plainData: string[][];
}
