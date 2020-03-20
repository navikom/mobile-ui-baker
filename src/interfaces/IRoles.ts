import { IObservableArray } from "mobx";
import { IRole } from "interfaces/IRole";

export interface IRoles {
  items: IObservableArray<IRole>;
  getById(id: number): IRole | undefined;
}
