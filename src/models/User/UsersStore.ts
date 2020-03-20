import { Pagination } from "models/Pagination";
import { action, computed } from "mobx";
import { UserStore } from "models/User/UserStore";
import { IUser } from "interfaces/IUser";
import { api, Apis } from "api";
import { Dictionary } from "services/Dictionary/Dictionary";

export class UsersStore extends Pagination<IUser> {

  @computed get userTableData() {
    return this.tableData((e: IUser) =>
      [e.userId.toString(), Dictionary.timeDateString(e.createdAt), e.fullName, e.email, e.anonymousString, e.eventsCount!.toString()]);
  }

  constructor() {
    super("userId", "user", 20, "pagination")
  }

  @action push(data: IUser[]) {
    let l = data.length;
    while (l--) {
      if(!this.has(data[l].userId)) {
        this.items.push(UserStore.from(data[l]));
      }
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
      console.log("Fetch referrals error: %s", e.message);
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
}

export const Users = new UsersStore();
