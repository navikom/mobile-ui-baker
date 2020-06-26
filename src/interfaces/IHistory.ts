import { ControlEnum } from "enums/ControlEnum";
import IControl from "interfaces/IControl";
import { Mode } from "enums/ModeEnum";
import IProject, { IBackgroundColor } from "interfaces/IProject";
import IMobileUIView from './IMobileUIView';
import { ScreenMetaEnum } from '../enums/ScreenMetaEnum';

export interface IHistoryObject {
  control: string | { [key: string]: any };
  title?: string;
  meta?: ScreenMetaEnum;
  key?: string;
  oldKey?: string;
  style?: { [key: string]: any }[];
  action?: string[];
  index?: number;
  screen?: string;
  parentId?: string;
  parent?: string;
  oldParent?: string;
  oldIndex?: number;
  method?: (string | number | boolean | undefined)[];
  value?: Mode & string & IBackgroundColor;
  model?: { [key: string]: any };
}

export interface ViewStore extends IMobileUIView {
  applyHistorySettings(key: SettingsPropType, value: Mode & string & IBackgroundColor): void;
  setCurrentScreen(screen: IControl, behavior?: string[], noHistory?: boolean): void;
  removeScreen(screen: IControl, noHistory?: boolean): void;
  setScreen(screen: IControl): void;
  spliceScreen(screen: IControl, index: number): void;
  save(): void;
  setMeta(meta: ScreenMetaEnum, control: IControl, noHistory?: boolean): void;
}

export type SettingsPropType = "mode" | "background" | "statusBarColor";

export default interface IHistory {
  stack: [string, IHistoryObject, IHistoryObject][];
  carriage: number;
  canUndo: boolean;
  canRedo: boolean;
  undo(): void;
  redo(): void;
  size: number;
  add(item: [string, IHistoryObject, IHistoryObject]): void;
  setFabric(fabric: (type: ControlEnum, json?: IControl) => IControl): void;
  setViewStore(store: ViewStore): void;
  clear(): void;
}
