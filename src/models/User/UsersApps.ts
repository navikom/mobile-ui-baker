// interfaces
import { IUsersApps } from "interfaces/IUsersApps";
import { IApp } from "interfaces/IApp";

//models
import { Apps } from "models/App/AppsStore";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

export class UsersApps implements IUsersApps {
  app: IApp;
  appId: number;
  createdAt: Date;
  deletedAt: Date;
  subscrExpires: Date;
  updatedAt: Date;

  get plainData() {
    const data = [
      [Dictionary.defValue(DictionaryService.keys.createdAt), Dictionary.timeDateString(this.createdAt) || ""],
      ...(this.app.plainData || [])
    ];
    this.subscrExpires && data.push([Dictionary.defValue(DictionaryService.keys.subscrExpires), Dictionary.timeDateString(this.subscrExpires) || ""]);
    return data;
  }

  constructor(model: IUsersApps) {
    this.app = model.app;
    this.appId = model.appId;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    this.deletedAt = model.deletedAt;
    this.subscrExpires = model.subscrExpires;
  }

  static from(model: IUsersApps) {
    model.app = Apps.getOrCreate(model.app) as IApp;
    return new UsersApps(model);
  }
}
