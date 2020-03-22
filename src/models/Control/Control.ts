import { action, IObservableArray, IObservableObject, observable } from "mobx";
import React from "react";
import IControl from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { whiteOpacity } from "assets/jss/material-dashboard-react";
import { DropEnum } from "models/DropEnum";
import Movable from "models/Movable";
import { IScreen } from "interfaces/IScreen";

abstract class Control extends Movable implements IControl {
  type: ControlEnum;
  id: string;
  readonly allowChildren: boolean;
  @observable screen?: IScreen;
  @observable title: string;
  @observable parent?: IControl;
  @observable styles: React.CSSProperties = observable({
    transition: "all 0.1s",
    padding: "1rem",
    backgroundColor: whiteOpacity(0.5),
    cursor: "move",
  });
  @observable dropTarget?: DropEnum;

  protected constructor(type: ControlEnum, id: string, title: string, allowChildren: boolean = true, screen?: IScreen) {
    super();
    this.screen = screen;
    this.id = id;
    this.type = type;
    this.allowChildren = allowChildren;
    this.title = title;
  }


  @action setParent(parent?: IControl): void {
    this.parent = parent;
  }

  @action setStyle<K extends keyof React.CSSProperties>(key: K, value: any): void {
    this.styles[key] = value;
  }

  @action setTarget(target?: DropEnum): void {
    this.dropTarget = target;
  }

  @action setScreen(screen: IScreen) {
    this.screen = screen;
  }

}

export default Control;
