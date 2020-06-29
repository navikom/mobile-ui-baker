import React from 'react';
import ITransitStyle from './ITransitSyle';

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

  hasAction: boolean;
  add(child: IStoreContent): void;
  toJSON: { [key: string]: any };
  toString(component: React.FC): string;
}

export default IStoreContent;
