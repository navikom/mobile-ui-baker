import React from 'react';
import { IObservableArray } from 'mobx';
import { ControlEnum } from 'enums/ControlEnum';
import { DropEnum } from 'enums/DropEnum';
import IMovable from 'interfaces/IMovable';
import ICSSProperty from 'interfaces/ICSSProperty';
import IProject from 'interfaces/IProject';
import { ScreenMetaEnum } from '../enums/ScreenMetaEnum';
import { TextMetaEnum } from '../enums/TextMetaEnum';
import { Mode } from '../enums/ModeEnum';
import { DeviceEnum } from '../enums/DeviceEnum';

export default interface IControl extends IMovable {
  type: ControlEnum;
  id: string;
  allowChildren: boolean;
  parentId?: string;
  cssStyles: Map<string, IObservableArray<ICSSProperty>>;
  dropTarget?: DropEnum;
  visible: boolean;
  lockedChildren: boolean;
  toJSON: { [key: string]: any };
  hashSumChildren: { [key: string]: any };
  hashSumChildrenWithStyles: { [key: string]: any };
  hashSumChildrenWithStylesAndTitles: { [key: string]: any };
  classes: IObservableArray<string>;
  actions: IObservableArray<IObservableArray<string>>;
  instance?: IProject;
  saving: boolean;
  hashChildren?: string;
  hashChildrenWithStyle?: string;
  hashChildrenWithStyleAndTitles?: string;
  path: string[];
  cssStylesJSON: (string | { [key: string]: string | number | boolean | undefined | null }[])[][];
  hasImage: boolean;
  hasSVG: boolean;
  meta: ScreenMetaEnum | TextMetaEnum;
  refObj?: HTMLDivElement;

  styles(device: DeviceEnum, isPortrait: boolean): React.CSSProperties;

  setRefObject(ref: HTMLDivElement): void;
  setId(value: string): void;

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

  applyActions(cb?: (action: string, screen?: IControl) => void): void;

  setAction(index: number, actions: string[]): void;

  applyChanges(changes: IControl): void;

  setSaving(value: boolean): void;

  setInstance(instance?: IProject): void;

  setChecksum(depth: number, path: string[], index: number, cb: (depth: number, i: number, item: IControl) => void): void;

  deleteSelfTraverseChildren(): void;

  toString(): string;

  setMeta(meta: ScreenMetaEnum | TextMetaEnum): void;

  applyFoSelected(): void;

  /// property
  switchExpanded(key: string, propName: string): () => void;

  switchEnabled(key: string, propName: string): () => void;

  setValue(key: string, propName: string): (value: string | number) => void;

  applyPropertyMethod(styleKey: string, method: string, propName: string, value?: string | number | boolean): void;
}

export interface IGrid extends IControl {
  clone(): IGrid;
}

export interface IScreen extends IControl {
  background: string;
  statusBarExtended: boolean;
  statusBarEnabled: boolean;
  statusBarColor: string;
  mode: Mode;

  setStatusBarExtended(value: boolean, noHistory?: boolean): void;
  setStatusBarEnabled(value: boolean, noHistory?: boolean): void;
  setStatusBarColor(color: string, noHistory?: boolean): void;
  setBackground(background: string, noHistory?: boolean): void;
  setMode(mode: Mode, noHistory?: boolean): void;
  switchMode(): void;
  switchExtended(): void;
  switchStatusBarEnabled(): void;
  setScreenProps(screen: IScreen): IScreen;

  clone(): IScreen;
}

export type IText = IControl;
