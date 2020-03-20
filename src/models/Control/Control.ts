import { action, IObservableArray, IObservableObject, observable } from "mobx";
import React from "react";
import IControl from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { whiteOpacity } from "assets/jss/material-dashboard-react";
import { DropEnum } from "models/DropEnum";

abstract class Control implements IControl {
  type: ControlEnum;
  id: string;
  readonly allowChildren: boolean;
  @observable name: string;
  @observable children: IObservableArray<IControl> = observable([]);
  @observable parent?: IControl;
  @observable styles: React.CSSProperties = observable({
    padding: "1rem",
    backgroundColor: whiteOpacity(0.5),
    cursor: "move",
  });
  @observable dropTarget?: DropEnum;

  protected constructor(type: ControlEnum, id: string, name: string, allowChildren: boolean = true) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.allowChildren = allowChildren;
  }

  hasChild(control: IControl) {
    return this.children.some(child => child === control);
  }

  @action addChild(child: IControl): void {
    this.children.push(child);
  }

  @action removeChild(child: IControl): void {
    this.children.splice(this.children.indexOf(child), 1);
  }

  @action setParent(parent?: IControl): void {
    this.parent = parent;
  }

  @action setName(value: string): void {
    this.name = value;
  }

  @action setStyle<K extends keyof React.CSSProperties>(key: K, value: any): void {
    this.styles[key] = value;
  }

  @action setTarget(target?: DropEnum): void {
    this.dropTarget = target;
  }

  @action moveChildren(dropIndex: number, hoverIndex: number): void {
    if(dropIndex === hoverIndex) {
      return;
    }
    const moveChild = this.children[dropIndex];
    this.children.splice(dropIndex, 1);
    this.children.splice(hoverIndex, 0, moveChild);
  }

  @action spliceChild(index: number, child: IControl): void {
    this.children.splice(index, 0, child);
  }

}

export default Control;
