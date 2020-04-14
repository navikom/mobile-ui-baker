import { ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_USER } from "models/Constants";

export type RoleType =
  | typeof ROLE_USER
  | typeof ROLE_ADMIN
  | typeof ROLE_SUPER_ADMIN;

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
