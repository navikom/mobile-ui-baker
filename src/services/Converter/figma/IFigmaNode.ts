import React from 'react';

export enum FigmaTypeEnum {
  DOCUMENT = 'DOCUMENT',
  COMPONENT = 'COMPONENT',
  CANVAS = 'CANVAS',
  FRAME = 'FRAME',
  INSTANCES = 'INSTANCES',
  VECTOR = 'VECTOR',
  BOOLEAN_OPERATION = 'BOOLEAN_OPERATION',
  RECTANGLE = 'RECTANGLE',
  ELLIPSE = 'ELLIPSE',
  LINE = 'LINE',
  STAR = 'STAR',
  REGULAR_POLYGON = 'REGULAR_POLYGON',
  TEXT = 'TEXT',
}

interface IColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface IFills {
  opacity?: number;
  color?: IColor;
  gradientStops?: IFills[];
  imageRef?: string;
  scaleMode?: string;
  type?: string;
  visible: boolean;
}

interface IEffect {
  type: string;
  color: IColor;
  offset: { x: number; y: number };
  radius: number;
  visible: boolean;
}

export interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum Constrains {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  CENTER = 'CENTER',
  SCALE = 'SCALE',
  TOP_BOTTOM = 'TOP_BOTTOM',
  LEFT_RIGHT = 'LEFT_RIGHT',
}

export interface IFigmaNode {
  id: string;
  name: string;
  visible: boolean;
  type: FigmaTypeEnum;
  children: IFigmaNode[];
  absoluteBoundingBox: IBoundingBox;
  effects: IEffect[];
  fills: IFills[];
  strokes?: IFills[];
  strokeWeight?: number;
  opacity?: number;
  style?: React.CSSProperties;
  cornerRadius?: number;
  rectangleCornerRadii?: number[];
  characters?: string;
  backgroundColor?: IColor;
  transitionNodeID?: string;
  locked?: boolean;
  constraints: { vertical: Constrains; horizontal: Constrains };
  isScreen: boolean;
}
