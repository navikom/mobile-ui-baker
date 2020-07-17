import React from 'react';
import IStoreContent from 'interfaces/IStoreContent';
import ITransitStyle from 'interfaces/ITransitSyle';
import { TextMetaEnum } from 'enums/TextMetaEnum';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';

class StoreContent implements IStoreContent {
  path: string[];
  id: string;
  screenId: string;
  styleId: string;
  classes: string[];
  placeIndex: number[];
  action?: string[][];
  isObservable: boolean;
  title: string;
  text?: string;
  isTextChildren: boolean;
  transitStyles?: ITransitStyle[];
  children: IStoreContent[] = [];
  hash: string;
  meta: ScreenMetaEnum | TextMetaEnum;

  get hasAction() {
    return this.action !== undefined && this.action.length > 0;
  }

  get toJSON() {
    return {
      id: this.id,
      screenId: this.screenId,
      title: this.title,
      path: this.path,
      classes: this.classes,
      styleId: this.styleId,
      isAllChildrenAreText: this.isTextChildren,
      transitStyles: this.transitStyles,
      action: this.action,
      text: this.text,
      placeIndex: this.placeIndex,
    }
  }

  constructor(
    id: string,
    screenId: string,
    path: string[],
    classes: string[],
    styleId: string,
    placeIndex: number[],
    title: string,
    hash: string,
    isTextChildren: boolean,
    isObservable: boolean,
    meta: ScreenMetaEnum | TextMetaEnum,
    transitStyles?: ITransitStyle[],
    action?: string[][],
    text?: string
  ) {
    this.id = id;
    this.screenId = screenId;
    this.path = path;
    action && action.length > 0 && (this.action = action);
    this.text = text;
    this.classes = classes;
    this.styleId = styleId;
    this.isTextChildren = isTextChildren;
    this.placeIndex = placeIndex;
    this.hash = hash;
    this.isObservable = isObservable;
    this.meta = meta;
    this.title = title;
    this.transitStyles = transitStyles;
  }

  add(child: IStoreContent) {
    this.children.push(child);
  }

  toString(component: React.FC): string {
    component = this.isObservable ? `observer(${component})` as unknown as React.FC : component;
    let content = '{\n';
    content += `    id: "${this.id}",\n`;
    content += `    title: "${this.title}",\n`;
    content += `    path: ${JSON.stringify(this.path)},\n`;
    content += `    classes: ${JSON.stringify(this.classes)},\n`;
    content += `    styleId: "${this.styleId}",\n`;
    content += `    isTextChildren: ${this.isTextChildren},\n`;
    content += `    transitStyles: ${this.transitStyles ? '[' + this.transitStyles.map(e => e.toString()) + ']' : undefined},\n`;
    content += `    action: ${JSON.stringify(this.action)},\n`;
    content += `    text: "${this.text}",\n`;
    content += `    meta: "${this.meta}",\n`;
    content += `    placeIndex: ${JSON.stringify(this.placeIndex)},\n`;
    content += `    component: ${component}\n`;
    content += '  }';
    return content;
  }

}

export default StoreContent;
