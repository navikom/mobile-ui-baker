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
  cssStyles: Map<string, IObservableArray<ICSSProperty>>;
  styles: React.CSSProperties;
  dropTarget?: DropEnum;
  visible: boolean;
  lockedChildren: boolean;
  toJSON: {[key: string]: any};
  classes: string[];
  actions: string[][];

  setParent(parentId?: string): void;
  setTarget(target: DropEnum): void;
  switchVisibility(): void;
  deleteSelf(): void;
  clone(): IControl;
  mergeStyles(props: Map<string, ICSSProperty[]>): void;
  switchLockChildren(): void;
  addClass(value: string): void;
  removeClass(value: string): void;
  addCSSStyle(): void;
  renameCSSStyle(oldKey: string, newKey: string): void;
  removeCSSStyle(key: string): void;
  addAction(actions: string[]): void;
  editAction(index: number, action: string, props: string): void;
  removeAction(index: number): void;
  applyActions(cb?: (screen: IControl) => void): void;
}

export interface IGrid extends IControl {
}

export interface IButton extends IControl {}

export interface IDrawer extends IControl {}

export interface IText extends IControl {
}
