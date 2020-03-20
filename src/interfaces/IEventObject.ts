import { IObject } from "interfaces/IObject";

export interface IEventObject extends IObject {
  fetching: boolean;
  setFetching(value: boolean): void;
  fetchKeys(): void;
}
