import { action, computed, IObservableArray, observable } from "mobx";

// interfaces
import { IUsersEvents } from "interfaces/IUsersEvents";
import { GenderType, IUser } from "interfaces/IUser";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// models
import { UserEventsStore } from "models/User/UserEventsStore";

import convertDate from "utils/convertDate";
import { IPagination } from "interfaces/IPagination";
import { UserReferralsStore } from "models/User/UserReferralsStore";
import { ROLE_ADMIN, ROLE_SUPER_ADMIN } from "models/Constants";
import { Roles } from "models/Role/RolesStore";
import { IDevice } from "interfaces/IDevice";
import { IRole } from "interfaces/IRole";
import { DeviceStore } from "models/Device/DeviceStore";
import { IRegion } from "interfaces/IRegion";
import { RegionStore } from "models/Region/RegionStore";

export const MALE = "Male";
export const FEMALE = "Female";

/**
 * User model
 *
 */
export class UserStore implements IUser {
  userId!: number;
  createdAt!: Date;
  lastEvent!: Date;
  email!: string;
  referrer!: number;

  pk = "userId";

  @observable firstName!: string;
  @observable lastName!: string;
  @observable phone!: string;
  @observable gender: GenderType = MALE;
  @observable updatedAt!: Date;
  @observable deletedAt!: Date;
  @observable birthday!: Date;
  @observable emailVerified = false;
  @observable notificationEmail!: boolean;
  @observable notificationSms = false;
  @observable phoneVerified = false;
  @observable subscription = false;
  @observable events: IUsersEvents;
  @observable eventsCount = 1;
  @observable lastLogin!: number;
  @observable fullDataLoaded = false;
  @observable devices?: IDevice[];
  @observable regions?: IRegion[];
  @observable location?: IRegion;
  @observable referrals: IPagination<IUser>;
  @observable anonymous: boolean = true;
  readonly roles: IObservableArray<IRole> = observable<IRole>([]);


  @computed
  get fullName(): string {
    const name = (this.firstName ? this.firstName : "") + (this.lastName ? " " + this.lastName : "");
    return name.length ? name : "No name";
  }

  @computed
  get anonymousString(): string {
    return this.anonymous ? Dictionary.defValue(DictionaryService.keys.anonymous)
      : Dictionary.defValue(DictionaryService.keys.loggedIn);
  }

  @computed get isSuperAdmin() {
    return this.hasRole(ROLE_SUPER_ADMIN);
  }

  @computed get isAdmin() {
    return this.hasRole(ROLE_SUPER_ADMIN) || this.hasRole(ROLE_ADMIN);
  }

  hasRole(roleId: number): boolean {
    return computed(() => {
      if(!this.roles) return false;
      return this.roles!.some((e: IRole) => e.roleId === roleId);
    }).get();
  }

  get totalTime() {
    const ms = Dictionary.moment(this.lastEvent).diff(Dictionary.moment(this.createdAt));
    const diff = Dictionary.moment.duration(ms);
    return [Math.round(diff.asHours()), diff.minutes(), diff.seconds()].join(':');
  }

  constructor(userId: number) {
    this.referrals = new UserReferralsStore(userId);
    this.userId = userId;
    this.events = new UserEventsStore(userId);
  }

  @action setFullDataLoaded(value = true) {
    this.fullDataLoaded = value;
  }

  @action
  update(model: IUser) {
    model.eventsCount && (this.eventsCount = Number(model.eventsCount));
    convertDate(model);
    !this.gender && (this.gender = MALE);
    model.regions && (this.regions = model.regions.map(region =>
      RegionStore.from({...region, createdAt: region.IUsersRegions!.createdAt})));
    model.regions &&
    (this.location = this.regions!.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]);
    model.devices && (this.devices = model.devices.map(device =>
      DeviceStore.from({...device, createdAt: device.IUsersDevices!.createdAt})));
    model.email && (this.email = model.email);
    model.firstName && (this.firstName = model.firstName);
    model.lastName && (this.lastName = model.lastName);
    model.createdAt && (this.createdAt = model.createdAt);
    model.updatedAt && (this.updatedAt = model.updatedAt);
    model.deletedAt && (this.deletedAt = model.deletedAt);
    model.lastLogin && (this.lastLogin = model.lastLogin);
    model.phone && (this.phone = model.phone);
    model.birthday && (this.birthday = model.birthday);
    model.gender && (this.gender = model.gender);
    model.emailVerified !== undefined && (this.emailVerified = model.emailVerified);
    model.phoneVerified !== undefined && (this.phoneVerified = model.phoneVerified);
    model.notificationEmail !== undefined && (this.notificationEmail = model.notificationEmail);
    model.notificationSms !== undefined && (this.notificationSms = model.notificationSms);
    model.subscription !== undefined && (this.subscription = model.subscription);
    model.anonymous !== undefined && (this.anonymous = model.anonymous);
    model.referrer && (this.referrer = model.referrer);
    model.lastEvent && (this.lastEvent = model.lastEvent);
    model.roles && this.updateRoles(model.roles);
  }

  @action updateForm(model: IUser) {
    Object.assign(this, model);
  }

  @action updateRoles(roles: IRole[]) {
    this.roles.replace([]);
    roles.forEach((role: IRole) =>
      this.roles.push(Roles.getOrCreate({...role, createdAt: role.UsersRoles!.createdAt})));
  }

  static from(model: IUser): UserStore {
    const user = new UserStore(model.userId);
    user.update(model);
    return user;
  }

  static emptyUser(): UserStore {
    const user = new UserStore(0);
    user.update({
      userId: 0,
      email: "",
      firstName: "",
      lastName: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      lastLogin: 0,
      phone: undefined,
      birthday: new Date(),
      gender: MALE,
      emailVerified: false,
      phoneVerified: false,
      notificationEmail: false,
      notificationSms: false,
      subscription: false,
      referrer: undefined,
      eventsCount: 0,
      regions: undefined,
      location: undefined,
      lastEvent: undefined
    } as IUser);
    return user;
  }

}
