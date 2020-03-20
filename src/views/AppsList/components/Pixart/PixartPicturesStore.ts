import { action, computed } from "mobx";

// models
import { Pagination } from "models/Pagination";
import { PictureStore } from "models/Pixart/PictureStore";

// interfaces
import { IPicture } from "interfaces/Pixart/IPicture";

export class PixartPicturesStore extends Pagination<IPicture> {
  @computed get pageData() {
    return this.tableData((e: IPicture) => e);
  }

  constructor() {
    super(
      "pictureId",
      "pixartPicture",
      20,
      "pagination",
      [6, 12, 36, 60, 120],
      null,
      6
    );
  }

  @action addData(data: IPicture[]) {
    this.push(data);
    this.setCount(this.count + data.length);
  }

  @action push(data: IPicture[]) {
    let l = data.length;
    while (l--) {
      if (!this.has(data[l].pictureId)) {
        this.items.push(PictureStore.from(data[l]));
      }
    }
  }
}
