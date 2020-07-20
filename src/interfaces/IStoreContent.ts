import React from 'react';
import ITransitStyle from './ITransitSyle';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';
import { TextMetaEnum } from 'enums/TextMetaEnum';
import { ControlEnum } from '../enums/ControlEnum';

interface IStoreContent {
  type: ControlEnum;
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
  toString(nameSpace: string): string;
}

export default IStoreContent;
