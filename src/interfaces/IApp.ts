import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { IAppsImages } from "interfaces/IAppsImages";

export interface IApp extends WithPrimaryKey {
  appId: number;
  title?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  categoryId?: number;
  images?: IAppsImages[];

  plainData: string[][];
  update(model: IApp): void;
}
