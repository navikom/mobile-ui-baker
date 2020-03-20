import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { IRole, RoleType } from "interfaces/IRole";
import { IUsersApps } from "interfaces/IUsersApps";
import { IUsersRegions } from "interfaces/IUsersRegions";
import { IUsersDevices } from "interfaces/IUsersDevices";
import { IUsersEvents } from "interfaces/IUsersEvents";
import { IPagination } from "interfaces/IPagination";
import { IObservableArray } from "mobx";
import { IUsersRoles } from "interfaces/IUsersRoles";
import { FemaleType, MaleType } from "types/commonTypes";

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
  apps?: IUsersApps[];
  roles: IObservableArray<IUsersRoles>;
  devices?: IUsersDevices[];
  events: IUsersEvents;
  regions?: IUsersRegions[];
  location?: IUsersRegions;
  lastEvent?: Date;
  referrals: IPagination<IUser>;
  anonymous: boolean;

  fullDataLoaded: boolean;

  fullName?: string;
  anonymousString?: string;

  update(model: IUser): void;
  updateForm(model: IUser): void;
  setFullDataLoaded(value?: boolean): void;
  hasRole(roleId: number): boolean;
  updateRoles(roles: IUsersRoles[]): void;
  totalTime: string;
}
