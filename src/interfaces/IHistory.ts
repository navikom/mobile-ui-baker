import { ControlEnum } from "models/ControlEnum";
import IControl from "interfaces/IControl";
import { IBackgroundColor, Mode } from "views/Editor/store/EditorViewStore";

export interface IHistoryObject {
  control: string | { [key: string]: any };
  title?: string;
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

export interface ViewStore {
  applyHistorySettings(key: SettingsPropType, value: Mode & string & IBackgroundColor): void;
  setCurrentScreen(screen: IControl, noHistory?: boolean): void;
  removeScreen(screen: IControl, noHistory?: boolean): void;
  setScreen(screen: IControl): void;
  spliceScreen(screen: IControl, index: number): void;
  save(): void;
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
