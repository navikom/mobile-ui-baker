import React from "react";
import { action, IObservableArray } from "mobx";
import { ControlEnum } from "enums/ControlEnum";
import { DropEnum } from "enums/DropEnum";
import IMovable from "interfaces/IMovable";
import ICSSProperty from "interfaces/ICSSProperty";
import IProject from "interfaces/IProject";

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
  toJSON: { [key: string]: any };
  classes: IObservableArray<string>;
  actions: IObservableArray<IObservableArray<string>>;
  instance?: IProject;
  saving: boolean;
  activeClass(style: string): boolean;

  cssProperty(key: string, propName: string): ICSSProperty | undefined;

  setParent(parentId?: string): void;

  setTarget(target: DropEnum): void;

  switchVisibility(): void;

  deleteSelf(noHistory?: boolean): void;

  clone(): IControl;

  mergeStyles(props: Map<string, ICSSProperty[]>): void;

  switchLockChildren(): void;

  addClass(value: string): void;

  removeClass(value: string, noHistory?: boolean): void;

  switchClass(style: string): void;

  addCSSStyle(noHistory?: boolean): void;

  setCSSStyle(key: string, style: { [key: string]: any }[]): void;

  renameCSSStyle(oldKey: string, newKey: string, noHistory?: boolean): void;

  removeCSSStyle(key: string, noHistory?: boolean): void;

  addAction(actions: string[], noHistory?: boolean): void;

  editAction(index: number, action: string, props: string, noHistory?: boolean): void;

  removeAction(index: number, noHistory?: boolean): void;

  applyActions(cb?: (screen: IControl) => void): void;

  setAction(index: number, actions: string[]): void;

  applyChanges(changes: IControl): void;

  setSaving(value: boolean): void;

  setInstance(instance: IProject): void;

  /// properties
  switchExpanded(key: string, propName: string): () => void;

  switchEnabled(key: string, propName: string): () => void;

  setValue(key: string, propName: string): (value: string | number) => void;

  applyPropertyMethod(styleKey: string, method: string, propName: string, value?: string | number | boolean): void;
}

export interface IGrid extends IControl {
}

export interface IText extends IControl {
}
