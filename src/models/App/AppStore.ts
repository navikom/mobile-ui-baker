import { IApp } from "interfaces/IApp";
import { action, observable } from "mobx";
import { IAppsImages } from "interfaces/IAppsImages";
import { AppsImagesStore } from "models/App/AppsImagesStore";

export class AppStore implements IApp {
  appId!: number;
  categoryId?: number;
  createdAt?: Date;
  deletedAt!: Date;

  @observable description?: string;
  @observable title?: string;
  @observable updatedAt?: Date;
  @observable images: IAppsImages[] = [];

  pk = "appId";

  get plainData() {
    const data = [
      ["Title", this.title || "—"],
    ];
    this.description && data.push(["Description", this.description]);
    return data;
  }

  @action
  update(model: IApp) {
    this.appId = model.appId;
    this.categoryId = model.categoryId;
    this.title = model.title;
    this.description = model.description;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
    if(model.images) {
      model.images.forEach((e: IAppsImages) => {
        const image = this.images.find((image) => e.imageId === image.imageId);
        if(image) {
          e.sorting && image.setSort(e.sorting);
        } else {
          this.images.push(AppsImagesStore.from(e));
        }
      })
    }
  }

  static from(model: IApp) {
    const app = new AppStore();
    app.update(model);
    return app;
  }
}
