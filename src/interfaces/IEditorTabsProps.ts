import { IBackgroundColor, Mode } from "views/Editor/store/EditorViewStore";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import IControl from "interfaces/IControl";

export default interface IEditorTabsProps {
  mode?: Mode;
  background?: IBackgroundColor;
  switchMode?: () => void;
  setBackground?: (background: IBackgroundColor) => void;
  statusBarColor?: string;
  setStatusBarColor?: (color: string) => void;
  dictionary?: EditorDictionary;
  selectedControl?: IControl;
  selectControl?: (control?: IControl) => void;
  cloneControl?: (control: IControl) => void;
  isSelected?: (control: IControl) => boolean;
  screens?: IControl[];
  autoSave?: boolean;
  switchAutoSave?: () => void;
}
