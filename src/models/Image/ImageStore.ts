import { IImage } from "interfaces/IImage";
import { computed, observable } from "mobx";
import { Settings } from "models/Settings";

export class ImageStore implements IImage {
  imageId: number;

  path(width = 300): string {
    return computed(
      () =>
        `${Settings.cloudinaryPath}/image/upload/c_scale,h_${width}/${
          Settings.cloudinaryFolder
        }/${this.imageId}`
    ).get();
  }

  constructor(imageId: number) {
    this.imageId = imageId;
  }

  static from(imageId: number) {
    return new ImageStore(imageId);
  }
}
