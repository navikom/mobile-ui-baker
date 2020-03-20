import { action, computed, observable } from "mobx";
import { IImage } from "interfaces/IImage";

class ImagesStore {
  @observable items: IImage[] = [];

  getById(id: number): IImage | undefined {
    return computed(() => this.items.find((e: any) => e.imageId === id)).get();
  }

  has(id?: number): boolean {
    return computed(() => this.items.some((e: any) => id === e.imageId)).get();
  }

  @action
  getOrCreate(data: IImage) {
    if (!this.has(data.imageId)) {
      this.items.push(data);
    }
    return this.getById(data.imageId);
  }
}

export const Images = new ImagesStore();
