import React from "react";
import { IObservableArray } from "mobx";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";
import IMovable from "interfaces/IMovable";
import ICSSProperty from "interfaces/ICSSProperty";

export default interface IControl extends IMovable {
  type: ControlEnum;
  id: string;
  allowChildren: boolean;
  parentId?: string;
  cssProperties: IObservableArray<ICSSProperty>;
  styles: React.CSSProperties;
  dropTarget?: DropEnum;
  visible: boolean;
  toJSON: {[key: string]: any};

  setParent(parentId?: string): void;
  setTarget(target: DropEnum): void;
  switchVisibility(): void;
  deleteSelf(): void;
  clone(): IControl;
  mergeProperties(props: ICSSProperty[]): void;
}

export interface IGrid extends IControl {
}

export interface IButton extends IControl {}

export interface IDrawer extends IControl {}

export interface IText extends IControl {
}
