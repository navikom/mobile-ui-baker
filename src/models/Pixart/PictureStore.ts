import { IPicture } from "interfaces/Pixart/IPicture";
import { IUser } from "interfaces/IUser";
import { computed } from "mobx";
import { Settings } from "models/Settings";

export class PictureStore implements IPicture {
  categoryId: number;
  createdAt: Date;
  pictureId: number;
  users!: IUser;
  pk = "pictureId";

  path(width = 300): string {
    return computed(() => `${Settings.cloudinaryPath}/image/upload/Pixart/${this.pictureId}`).get();
  }

  constructor(model: IPicture) {
    this.categoryId = model.categoryId;
    this.pictureId = model.pictureId;
    this.createdAt = model.createdAt;
  }

  static from(model: IPicture) {
    return new PictureStore(model);
  }
}
