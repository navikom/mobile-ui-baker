import { IUsersDevices } from "interfaces/IUsersDevices";
import { IDevice } from "interfaces/IDevice";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { DeviceStore } from "models/Device/DeviceStore";

export class UsersDevices implements IUsersDevices {
  createdAt: Date;
  device: IDevice;
  deviceId: number;

  get plainData() {
    const data = [
      [
        Dictionary.defValue(DictionaryService.keys.createdAt),
        Dictionary.timeDateString(this.createdAt) || ""
      ],
      ...this.device.plainData
    ];
    return data;
  }

  constructor(model: IUsersDevices) {
    this.deviceId = model.deviceId;
    this.createdAt = model.createdAt;
    this.device = model.device;
  }

  static from(model: IUsersDevices) {
    model.device = DeviceStore.from(model.device);
    return new UsersDevices(model);
  }
}
