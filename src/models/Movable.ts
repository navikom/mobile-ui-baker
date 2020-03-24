import { action, IObservableArray, observable } from "mobx";
import IMovable from "interfaces/IMovable";
import IControl from "interfaces/IControl";

export default abstract class Movable implements IMovable {
  @observable children: IObservableArray<IControl> = observable([]);
  @observable opened: boolean = false;
  @observable title: string = "Control";

  hasChild(control: IControl) {
    return this.children.some(child => child === control);
  }

  @action changeTitle = (title: string) => {
    this.title = title;
  }

  @action addChild(child: IControl): void {
    this.children.push(child);
    child.setParent((this as unknown as IControl).id);
  }

  @action removeChild(child: IControl): void {
    const index = this.children.indexOf(child);
    index > -1 && this.children.splice(index, 1);
  }

  @action moveChildren(dropIndex: number, hoverIndex: number): void {
    if (dropIndex === hoverIndex) {
      return;
    }
    const moveChild = this.children[dropIndex];
    this.children.splice(dropIndex, 1);
    this.children.splice(hoverIndex, 0, moveChild);
  }

  @action spliceChild(index: number, child: IControl): void {
    this.children.splice(index, 0, child);
    child.setParent((this as unknown as IControl).id);
  }

  @action setOpened(opened: boolean): void {
    this.opened = opened;
  }

  @action switchOpened = () => {
    this.setOpened(!this.opened);
  }

}
