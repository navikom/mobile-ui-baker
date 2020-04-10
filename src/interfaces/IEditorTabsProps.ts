import EditorDictionary from "views/Editor/store/EditorDictionary";
import IControl from "interfaces/IControl";
import { Mode } from "enums/ModeEnum";
import IProject, { IBackgroundColor } from "interfaces/IProject";

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
  saveProject?: () => void;
  savingProject?: boolean;
  saveControl?: (control: IControl) => void;
  saveComponent?: (control: IControl) => void;
  changeProjectTitle?: (value: string) => void;
  project?: IProject;
}
