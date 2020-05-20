import { action, IObservableArray, observable, runInAction } from 'mobx';
import { Errors } from 'models/Errors';
import { ControlEnum } from 'enums/ControlEnum';
import IControl from 'interfaces/IControl';
import IProject, { IBackgroundColor, IProjectData } from 'interfaces/IProject';
import { whiteColor } from 'assets/jss/material-dashboard-react';
import { Mode } from 'enums/ModeEnum';
import PluginStore from 'models/PluginStore';
import ProjectStore from 'models/Project/ProjectStore';
import ProjectEnum from 'enums/ProjectEnum';
import CreateControl from 'models/Control/ControlStores';
import ProjectsStore from 'models/Project/ProjectsStore';
import { DeviceEnum } from '../enums/DeviceEnum';
import ControlStore from './Control/ControlStore';
import EditorDictionary from '../views/Editor/store/EditorDictionary';
import html2canvas from 'html2canvas';

class DisplayViewStore extends Errors {
  @observable dictionary = new EditorDictionary();
  @observable device: DeviceEnum = DeviceEnum.IPHONE_6;
  @observable screens: IObservableArray<IControl>;
  @observable currentScreen: IControl;
  @observable background: IBackgroundColor = { backgroundColor: whiteColor };
  @observable statusBarColor: string = whiteColor;
  @observable mode: Mode = Mode.WHITE;
  @observable portrait = true;
  @observable ios = true;
  @observable autoSave = false;
  @observable project: IProject;
  @observable fetchingProject = false;
  @observable successMessage = '';
  @observable loadingPlugin = false;
  pluginStore: PluginStore = new PluginStore(this);

  debug = false;

  get toJSONString() {
    return JSON.stringify({
      screens: this.screens.map(e => e.toJSON),
      background: this.background,
      statusBarColor: this.statusBarColor,
      mode: this.mode,
      title: this.project.title
    })
  }

  constructor(urlQuery: string) {
    super();
    if (urlQuery.length) {
      this.loadingPlugin = true;
      this.pluginStore.fetchMode(urlQuery);
    }
    this.project = ProjectStore.createEmpty(ProjectEnum.PROJECT);
    this.screens = observable([CreateControl(ControlEnum.Grid)]);
    this.currentScreen = this.screens[0];
  }

  @action setLoadingPlugin(value: boolean) {
    this.loadingPlugin = value;
  }

  @action setFetchingProject(value: boolean) {
    this.fetchingProject = value;
  }

  makeProjectScreenshot = () => {
    const element = document.querySelector('#capture') as HTMLElement;
    element && html2canvas(element, { useCORS: true }).then(canvas => {
      const base64 = canvas.toDataURL();
      // const w = window.open("");
      // w!.document.write(`<img src="${base64}"/>`);
      const a = document.createElement('a');
      a.href = base64;
      a.download = `${this.project.title.length ? this.project.title : 'Project'}.png`;
      a.click();
      setTimeout(() => {
        a.remove();
      }, 300);
    })
  };

  @action
  async fetchProjectData(projectId: number) {
    const project = await ProjectsStore.fetchFullData(projectId);
    runInAction(() => {
      this.project = project;
    });
    this.fromJSON(project.version.data as IProjectData);
  }

  @action fromJSON(data: IProjectData) {
    ControlStore.clear();
    this.screens.replace(data.screens.map((e) => CreateControl(ControlEnum.Grid, e)));
    this.currentScreen = this.screens[0];
    this.mode = data.mode;
    this.background = data.background;
    this.statusBarColor = data.statusBarColor;
    this.ios = data.ios;
    this.portrait = data.portrait;
    this.project.update({ title: data.title } as IProject);
    data.projectId !== undefined && this.project.setId(data.projectId);
  }

  @action switchPortrait = () => {
    this.portrait = !this.portrait;
    this.pluginStore.postMessage(PluginStore.LISTENER_ON_SWITCH_ORIENTATION, this.portrait ? 'portrait' : 'landscape');
  };


  @action switchMode() {
    this.mode = this.mode === Mode.WHITE ? Mode.DARK : Mode.WHITE;
  }

  @action setBackground(background: IBackgroundColor) {
    this.background = background;
  }

  @action setStatusBarColor(statusBarColor: string) {
    this.statusBarColor = statusBarColor;
  }

  @action setCurrentScreen(screen: IControl) {
    this.currentScreen = screen;
  }

  @action setScreen(screen: IControl) {
    this.screens.push(screen);
  }

  @action spliceScreen(screen: IControl, index: number) {
    this.screens.splice(index, 0, screen);
  }

  @action setIOS(value: boolean) {
    this.ios = value;
    this.device = this.ios ? DeviceEnum.IPHONE_6 : DeviceEnum.PIXEL_5;
    this.pluginStore.postMessage(PluginStore.LISTENER_ON_SWITCH_ORIENTATION, this.ios ? 'ios' : 'android');
  }

  dispose() {
    this.pluginStore.dispose();
  }

}

export default DisplayViewStore;
