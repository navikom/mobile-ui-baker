import { ADMIN_ROLE, SUPER_ADMIN_ROLE, USER_ROLE } from "models/Constants";

export type RoleType =
  | typeof USER_ROLE
  | typeof ADMIN_ROLE
  | typeof SUPER_ADMIN_ROLE;

export interface IUsersRoles {
  userId: number;
  roleId: number;
  createdAt: Date;
}

export interface IRole {
  roleId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  UsersRoles?: IUsersRoles;
  name: string;
  update(model: IRole): void;
}
