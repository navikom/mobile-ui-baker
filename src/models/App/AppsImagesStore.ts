import { action, computed, observable, when } from "mobx";
import { IAppsImages } from "interfaces/IAppsImages";
import { Settings } from "models/Settings";

export class AppsImagesStore implements IAppsImages {
  imageId: number;
  @observable sorting?: number;
  @observable private storePath?: string;
  @observable private storeFolder?: string;

  path(width = 300): string {
    return computed(() =>
      `${this.storePath}/image/upload/h_${width}/${this.storeFolder}/${this.imageId}`).get();
  }

  constructor(model: IAppsImages) {
    when(() => Settings.loaded, () => {
      this.storePath = Settings.cloudinaryPath;
      this.storeFolder = Settings.cloudinaryFolder;
    });

    this.imageId = model.imageId;
    this.sorting = model.sorting;
  }

  @action setSort(value: number) {
    this.sorting = value;
  }

  static from(model: IAppsImages) {
    return new AppsImagesStore(model);
  }
}
