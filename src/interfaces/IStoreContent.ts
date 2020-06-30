import React from 'react';
import ITransitStyle from './ITransitSyle';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';
import { TextMetaEnum } from 'enums/TextMetaEnum';

interface IStoreContent {
  path: string[];
  id: string;
  screenId: string;
  classes: string[];
  styleId: string;
  placeIndex: number[];
  title: string;
  hash: string;
  isObservable: boolean;
  action?: string[][];
  text?: string;
  transitStyles?: ITransitStyle[];
  children: IStoreContent[];
  meta: ScreenMetaEnum | TextMetaEnum;

  hasAction: boolean;
  add(child: IStoreContent): void;
  toJSON: { [key: string]: any };
  toString(component: React.FC): string;
}

export default IStoreContent;
