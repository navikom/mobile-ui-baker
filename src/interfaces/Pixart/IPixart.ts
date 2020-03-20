import { IPicture } from "interfaces/Pixart/IPicture";
import { ICategory } from "interfaces/Pixart/ICategory";
import { IPagination } from "interfaces/IPagination";

export interface IPixart {
  pictures: IPagination<IPicture>;
  categories: ICategory[];

  savePictures(files: any): void;
}
