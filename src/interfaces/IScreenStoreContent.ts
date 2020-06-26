import React from 'react';
import ITransitStyle from './ITransitSyle';

interface IScreenStoreContent {
  path: string[];
  id: string;
  classes: string[];
  styleId: string;
  placeIndex: number[];
  title: string;
  hash: string;
  isObservable: boolean;
  action?: string[][];
  text?: string;
  transitStyles?: ITransitStyle[];
  children: IScreenStoreContent[];

  hasAction: boolean;
  add(child: IScreenStoreContent): void;
  toJSON: { [key: string]: any };
  toString(component: React.FC): string;
}

export default IScreenStoreContent;
