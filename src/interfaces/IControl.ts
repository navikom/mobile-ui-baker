import React from "react";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";

export default interface IControl {
  type: ControlEnum;
  id: string;
  name: string;
  allowChildren: boolean;
  children: IControl[];
  parent?: IControl;
  styles: React.CSSProperties;
  dropTarget?: DropEnum;

  setName(value: string): void;
  addChild(child: IControl): void;
  removeChild(child: IControl): void;
  setParent(parent?: IControl): void;
  setStyle<K extends keyof React.CSSProperties>(key: K, value: string | number): void;
  setTarget(target: DropEnum): void;
  hasChild(control: IControl): boolean;
  moveChildren(dropIndex: number, hoverIndex: number): void;
  spliceChild(index: number, child: IControl): void;
}

export interface IGrid extends IControl {}

export interface IButton extends IControl {}

export interface IDrawer extends IControl {}

export interface IText extends IControl {}
