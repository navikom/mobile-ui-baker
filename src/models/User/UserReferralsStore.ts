import { action, computed } from "mobx";

// interfaces
import { IUser } from "interfaces/IUser";

// models
import { Pagination } from "models/Pagination";
import { Users } from "models/User/UsersStore";
import { Dictionary } from "services/Dictionary/Dictionary";

export class UserReferralsStore extends Pagination<IUser> {
  @computed get userTableData() {
    return this.tableData((e: IUser) => [
      e.userId.toString(),
      Dictionary.timeDateString(e.createdAt),
      e.fullName,
      e.email,
      e.anonymousString
    ]);
  }

  constructor(userId: number) {
    super(
      "userId",
      "user",
      20,
      "pagination",
      [5, 10, 25, 50],
      `/user/${userId}/referrals`
    );
  }

  @action push(data: IUser[]) {
    let l = data.length,
      i = 0;
    while (l--) {
      const user = Users.getOrCreate(data[i++]);
      if (!this.has(user.userId)) {
        this.items.push(user);
      }
    }
  }
}
