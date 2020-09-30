import { action, computed } from 'mobx';
import { Pagination } from 'models/Pagination';
import { UserStore } from 'models/User/UserStore';
import { IUser } from 'interfaces/IUser';
import { api, Apis } from 'api';
import { Dictionary } from 'services/Dictionary/Dictionary';
import { MODE_DEVELOPMENT } from '../Constants';

export class UsersStore extends Pagination<IUser> {

  @computed get userTableData() {
    return this.tableData((e: IUser) =>
      [e.userId.toString(), Dictionary.timeDateString(e.createdAt), e.fullName, e.email, e.anonymousString, e.eventsCount!.toString()]);
  }

  constructor() {
    super("userId",
      "user",
      50,
      "pagination",
      undefined,
      undefined,
      50)
  }

  @action push(data: IUser[]) {
    let l = data.length, i = 0;
    while (l--) {
      if(!this.has(data[i].userId)) {
        this.items.push(UserStore.from(data[i]));
      }
      i++;
    }
  }

  @action async loadFullData(user: IUser) {
    if(user.fullDataLoaded) return;
    try {
      user.update(await api(Apis.Main).user.fullData(user.userId));
      user.setFullDataLoaded();
    } catch (err) {
      this.setError(err.message);
    }
  }

  @action async fetchReferrals(user: IUser) {
    try {
      await user.referrals.fetchItems();
    } catch (e) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log("Fetch referrals error: %s", e.message);
    }
  }

  @action getByIdFullData(id: number): IUser {
    let user: IUser;
    if(!this.has(id)) {
      user = UserStore.from({userId: id} as IUser);
      this.items.push(user);
    } else {
      user = this.getById(id) as IUser;
    }
    this.loadFullData(user);
    return user;
  }

  @action getOrCreate(data: IUser): IUser {
    if(!this.has(data.userId)) {
      this.push([data]);
    }
    return this.getById(data.userId) as IUser;
  }

  async clearUsersTable(date: Date) {
    try {
      const result = await api(Apis.Main).user.clearTable(date);
      console.log('Users table removed', result);
    } catch(err) {
      console.log('Clear users table error: %s', err.message);
    }
  }
}

export const Users = new UsersStore();
