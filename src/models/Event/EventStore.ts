import { IEvent } from "interfaces/IEvent";
import { IUser } from "interfaces/IUser";
import { Users } from "models/User/UsersStore";
import parseModel from "utils/parseModelRow";
import {DeviceStore} from "models/Device/DeviceStore";
import {RegionStore} from "models/Region/RegionStore";
import {AppStore} from "models/App/AppStore";
import {IApp} from "interfaces/IApp";
import {IDevice} from "interfaces/IDevice";
import {IRegion} from "interfaces/IRegion";

export class EventStore implements IEvent {
  pk = "eventId";
  userId!: number;
  createdAt!: Date;
  eventId!: number;
  app!: IApp | null;
  device!: IDevice;
  region!: IRegion;
  info!: {[key: string]: any};
  title!: string;
  user!: IUser;

  get hasCustom() {
    return Object.keys(this.info).length > 0;
  }

  constructor(model: IEvent) {
    Object.assign(this, model);
  }

  static from(model: IEvent) {
    parseModel(model);
    const userData = model.user;
    model.user = Users.getOrCreate({...(model.user || {}), userId: model.userId}) as IUser;
    userData && model.user.update(userData);
    model.device && (model.device = DeviceStore.from(model.device));
    model.region && (model.region = RegionStore.from(model.region));
    model.app = model.app ? AppStore.from(model.app) : null;

    return new EventStore(model);
  }
}

