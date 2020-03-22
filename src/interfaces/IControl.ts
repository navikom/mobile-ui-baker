import React from "react";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";
import IMovable from "interfaces/IMovable";
import { IScreen } from "interfaces/IScreen";

export default interface IControl extends IMovable {
  type: ControlEnum;
  id: string;
  allowChildren: boolean;
  parent?: IControl;
  screen?: IScreen;
  styles: React.CSSProperties;
  dropTarget?: DropEnum;

  setParent(parent?: IControl): void;
  setStyle<K extends keyof React.CSSProperties>(key: K, value: string | number): void;
  setTarget(target: DropEnum): void;
  setScreen(screen: IScreen): void;
}

export interface IGrid extends IControl {}

export interface IButton extends IControl {}

export interface IDrawer extends IControl {}

export interface IText extends IControl {}
