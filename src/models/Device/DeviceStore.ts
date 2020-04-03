import { IDevice } from "interfaces/IDevice";
import { IDeviceInfo } from "interfaces/IDeviceInfo";
import { ANDROID, IOS } from "models/Constants";

export class DeviceStore implements IDevice {
  createdAt: Date;
  info: IDeviceInfo;

  get plainData() {
    const data = [["OS", `${this.info.OS.name}, ${this.info.OS.version}`]];
    if ([ANDROID, IOS].includes(this.info.OS.name)) {
      Object.keys(this.info.params).forEach((key: string) =>
        data.push([key, this.info.params[key]])
      );
    } else {
      this.info.headers && data.push(["OTHERS", this.info.headers]);
    }

    return data;
  }

  constructor(model: IDevice) {
    this.info = model.info;
    this.createdAt = model.createdAt;
  }

  static from(model: IDevice) {
    return new DeviceStore(model);
  }
}
