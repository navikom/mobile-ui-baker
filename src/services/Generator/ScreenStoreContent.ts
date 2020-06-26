import React from 'react';
import IScreenStoreContent from 'interfaces/IScreenStoreContent';
import ITransitStyle from 'interfaces/ITransitSyle';

class ScreenStoreContent implements IScreenStoreContent {
  path: string[];
  id: string;
  styleId: string;
  classes: string[];
  placeIndex: number[];
  action?: string[][];
  isObservable:boolean;
  title: string;
  text?: string;
  transitStyles?: ITransitStyle[];
  children: IScreenStoreContent[] = [];
  hash: string

  get hasAction() {
    return this.action !== undefined && this.action.length > 0;
  }

  get toJSON() {
    return {
      id: this.id,
      title: this.title,
      path: this.path,
      classes: this.classes,
      styleId: this.styleId,
      transitStyles: this.transitStyles,
      action: this.action,
      text: this.text,
      placeIndex: this.placeIndex,
    }
  }

  constructor(
    id: string,
    path: string[],
    classes: string[],
    styleId: string,
    placeIndex: number[],
    title: string,
    hash: string,
    isObservable: boolean,
    transitStyles?: ITransitStyle[],
    action?: string[][],
    text?: string
  ) {
    this.id = id;
    this.path = path;
    action && action.length > 0 && (this.action = action);
    this.text = text;
    this.classes = classes;
    this.styleId = styleId;
    this.placeIndex = placeIndex;
    this.hash = hash;
    this.isObservable = isObservable;
    this.title = title;
    this.transitStyles = transitStyles;
  }

  add(child: IScreenStoreContent) {
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
    content += `    transitStyles: ${JSON.stringify(this.transitStyles)},\n`;
    content += `    action: ${JSON.stringify(this.action)},\n`;
    content += `    text: "${this.text}",\n`;
    content += `    placeIndex: ${JSON.stringify(this.placeIndex)},\n`;
    content += `    component: ${component}\n`;
    content += '  }'
    return content;
  }

}

export default ScreenStoreContent;
