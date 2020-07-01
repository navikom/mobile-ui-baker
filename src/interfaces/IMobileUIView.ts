import { IObservableArray } from 'mobx';
import IControl from './IControl';
import IProject, { IBackgroundColor, IProjectData } from './IProject';
import { DeviceEnum } from 'enums/DeviceEnum';
import { Mode } from 'enums/ModeEnum';
import { data } from '../views/Editor/store/EditorDictionary';
import { IObject } from '../services/Dictionary/AbstractDictionary';

interface IMobileUIView {
  dictionary?: { setData: <T extends typeof data>(newData: T & IObject) => void };
  device: DeviceEnum;
  screens: IObservableArray<IControl>;
  currentScreen: IControl;
  firstScreen?: IControl;
  secondScreen?: IControl;
  background: IBackgroundColor;
  statusBarEnabled: boolean;
  statusBarColor: string;
  mode: Mode;
  portrait: boolean;
  ios: boolean;
  autoSave: boolean;
  project: IProject;
  fetchingProject: boolean;
  successMessage: string;
  loadingPlugin: boolean;
  firstContainerVisible: boolean;
  navigation: (string | number)[];

  setLoadingPlugin(value: boolean): void;
  setContentGeneratorDialog?(msg: string[] | null): void;
  closeGeneratorDialog?(): void;

  fromJSON(data: IProjectData): void;
  switchAutoSave?(): void;
  handleScreenshot?(): void;
  switchPortrait(): void;
  setIOS(value: boolean): void;
  setAutoSave?(value: boolean): void;
}

export default IMobileUIView;
