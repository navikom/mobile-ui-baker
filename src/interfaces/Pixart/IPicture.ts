import { IUser } from "interfaces/IUser";
import { WithPrimaryKey } from "interfaces/WithPrimaryKey";

export interface IPicture extends WithPrimaryKey {
  pictureId: number;
  createdAt: Date;
  categoryId: number;
  users: IUser;

  path(width?: number): string;
}
