import IControl from "interfaces/IControl";
import { IObservableArray } from "mobx";

export default interface IMovable {
  children: IObservableArray<IControl>;
  opened: boolean;
  title: string;

  changeTitle(title: string): void;
  setOpened(opened: boolean): void;
  switchOpened(): void;
  addChild(child: IControl): void;
  removeChild(child: IControl): void;
  hasChild(control: IControl): boolean;
  moveChildren(dropIndex: number, hoverIndex: number): void;
  spliceChild(index: number, child: IControl): void;
}
