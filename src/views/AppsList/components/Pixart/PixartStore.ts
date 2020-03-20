import { action, observable } from "mobx";

// interfaces
import { IPixart } from "interfaces/Pixart/IPixart";
import { ICategory } from "interfaces/Pixart/ICategory";
import { IPicture } from "interfaces/Pixart/IPicture";
import { IPagination } from "interfaces/IPagination";

import { PixartPicturesStore } from "views/AppsList/components/Pixart/PixartPicturesStore";
import { IAppDataLocal } from "interfaces/IAppDataLocal";
import { api, Apis } from "api";

type PixartPicturesType = {
  pageData: IPicture[];
  addData(data: IPicture[]): void;
};

class PixartStore implements IPixart {
  @observable categories: ICategory[] = [];
  @observable pictures: IPagination<IPicture> & PixartPicturesType = new PixartPicturesStore();
  @observable pictureDropZoneOpen = false;

  mainAppStore!: IAppDataLocal;

  @action setDropZoneOpen(value = true) {
    this.pictureDropZoneOpen = value;
  }

  @action async savePictures(files: any) {
    this.mainAppStore.setFetching();
    this.setDropZoneOpen(false);
    try {
      const formData = new FormData();
      formData.append("categoryId", "1");
      files.forEach((file: any, key: number) => formData.append("file", file));
      const data = await api(Apis.Main).pixartPicture.save(formData) as IPicture[];
      setTimeout(() => {
        this.pictures.addData(data);
      }, 4000);
      this.mainAppStore.setSuccessRequest(true);
      this.mainAppStore.setTimeOut(() => this.mainAppStore.setSuccessRequest(false), 5000);
    } catch (e) {
      this.mainAppStore.setError(e.message);
      this.mainAppStore.setTimeOut(() => this.mainAppStore.setError(null), 6000);
    }
    this.mainAppStore.setFetching(false);
  }

  setMainAppStore(store: IAppDataLocal) {
    this.mainAppStore = store;
  }
}

export default new PixartStore();
