import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { IUsersEvents } from "interfaces/IUsersEvents";
import { IPagination } from "interfaces/IPagination";
import { IObservableArray, observable } from 'mobx';
import { FemaleType, MaleType } from "types/commonTypes";
import { IRole } from "interfaces/IRole";
import { IRegion } from "interfaces/IRegion";
import { IDevice } from "interfaces/IDevice";

export type GenderType = MaleType | FemaleType;
export interface IUser extends WithPrimaryKey {
  readonly userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  lastLogin?: number;
  phone?: string;
  birthday?: Date;
  gender?: GenderType;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  notificationEmail?: boolean;
  notificationSms?: boolean;
  subscription?: boolean;
  referrer?: number;
  eventsCount?: number;
  roles: IObservableArray<IRole>;
  devices?: IDevice[];
  events: IUsersEvents;
  regions?: IRegion[];
  location?: IRegion;
  lastEvent?: Date;
  referrals: IPagination<IUser>;
  webpage: string | null;
  uid: string | null;
  secret: string | null;
  anonymous: boolean;
  proPlan: boolean;

  fullDataLoaded: boolean;

  fullName?: string;
  anonymousString?: string;
  isAdmin: boolean;

  update(model: IUser): void;
  updateForm(model: IUser): void;
  setFullDataLoaded(value?: boolean): void;
  hasRole(roleId: number): boolean;
  updateRoles(roles: IRole[]): void;
  totalTime: string;
}
