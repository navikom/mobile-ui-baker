import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { IUser } from "interfaces/IUser";
import { IDevice } from "interfaces/IDevice";
import { IRegion } from "interfaces/IRegion";

export interface IEvent extends WithPrimaryKey {
  eventId: number;
  userId: number;
  user: IUser;
  device: IDevice;
  region: IRegion;
  info: { [key: string]: any };
  title: string;
  createdAt: Date;

  hasCustom: boolean;
}
