import { IApp } from "interfaces/IApp";

export interface IUsersApps {
  appId: number;
  subscrExpires: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  app: IApp;

  plainData: string[][];
}
