import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { IUser } from "interfaces/IUser";
import { IApp } from "interfaces/IApp";
import { IDevice } from "interfaces/IDevice";
import { IRegion } from "interfaces/IRegion";

export interface IEvent extends WithPrimaryKey {
  eventId: number;
  userId: number;
  user: IUser;
  app: IApp | null;
  device: IDevice;
  region: IRegion;
  info: { [key: string]: any };
  title: string;
  createdAt: Date;

  hasCustom: boolean;
}
