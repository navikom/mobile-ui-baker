import { computed } from "mobx";
import { IImage, IProjectsImages } from "interfaces/IImage";
import settings from "config/server";

export class ImageStore implements IImage {
  imageId: number;
  width?: number;
  height?: number;
  ProjectsImages?: IProjectsImages;

  path(userId: number): string {
    return computed(
      () =>
        `${settings.domain}/image/${userId}/${this.imageId}`
    ).get();
  }

  constructor(
    {imageId, width, height, ProjectsImages}: IImage) {
    this.imageId = imageId;
    this.width = width;
    this.height = height;
    this.ProjectsImages = ProjectsImages;
  }

  static from(model: IImage) {
    return new ImageStore(model);
  }

  setSort(sort: number) {
    this.ProjectsImages!.sorting = sort;
  }
}
