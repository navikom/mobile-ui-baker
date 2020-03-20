import { action, computed, observable } from "mobx";
// interfaces
import { IUser } from "interfaces/IUser";
// models
import { Errors } from "models/Errors";
import { api, Apis } from "api";
import { IRole } from "interfaces/IRole";
import { Roles } from "models/Role/RolesStore";

// services

class UserDetailsStore extends Errors {
  @observable user?: IUser;
  @observable fetching = false;
  @observable currentReferral?: IUser;

  @computed get roles(): IRole[] {
    return Roles.items.filter((role: IRole) => !role.deletedAt);
  }

  @action bindUser(user?: IUser) {
    this.user = user;
  }

  @action bindCurrentReferral(userId: string): void{
    this.currentReferral = this.user && this.user.referrals.getById(parseInt(userId));
  }

  @action
  async updateRole(role: IRole) {
    try {
      const data = await api(Apis.Main).user.updateRole(this.user!.userId, role.roleId);
      this.user!.updateRoles(data);
    } catch (e) {
      console.log("User details roles error: %s", e.message);
    }
  }

}

export const UserDetails = new UserDetailsStore();
