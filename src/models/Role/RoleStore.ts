import { IRole } from "interfaces/IRole";
import { action } from "mobx";

export class RoleStore implements IRole {
  roleId: number;
  createdAt?: Date;
  deletedAt!: Date;
  name: string;
  updatedAt!: Date;

  constructor(model: IRole) {
    Object.assign(this, model);
    this.roleId = model.roleId;
    this.name = model.name;
  }

  @action update(model: IRole) {
    Object.assign(this, model);
  }

  static from(model: IRole) {
    return new RoleStore(model);
  }

  static defaultRole() {
    return new RoleStore({
      roleId: 0,
      name: "user"
    } as IRole);
  }
}
