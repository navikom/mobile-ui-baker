import { action, IObservableArray, observable, runInAction } from 'mobx';
import { Errors } from 'models/Errors';
import { ControlEnum } from 'enums/ControlEnum';
import IControl from 'interfaces/IControl';
import IProject, { IBackgroundColor, IProjectData, IProjectVersion } from 'interfaces/IProject';
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
import AnimationEnum, { AnimationDirectionEnum } from '../enums/AnimationEnum';
import { FIRST_CONTAINER, SECOND_CONTAINER } from './Constants';
import ScreenSwitcherEnum from 'enums/ScreenSwitcherEnum';
import { ScreenMetaEnum } from '../enums/ScreenMetaEnum';

export const getSwitcherParams = (list: (string | number)[], screenSwitcher: ScreenSwitcherEnum) => {
  if (Number(list[0]) === screenSwitcher) {
    return list.slice(1, 4);
  }
  if (list.length > 4) {
    return list.slice(5, 8);
  }
  return undefined;
}

class DisplayViewStore extends Errors {
  @observable dictionary = new EditorDictionary();
  @observable device: DeviceEnum = DeviceEnum.IPHONE_6;
  @observable screens: IObservableArray<IControl>;
  @observable currentScreen: IControl;
  @observable firstScreen?: IControl;
  @observable secondScreen?: IControl;
  @observable background: IBackgroundColor = { backgroundColor: whiteColor };
  @observable statusBarEnabled = true;
  @observable statusBarColor: string = whiteColor;
  @observable mode: Mode = Mode.WHITE;
  @observable portrait = true;
  @observable ios = true;
  @observable autoSave = false;
  @observable project: IProject;
  @observable fetchingProject = false;
  @observable successMessage = '';
  @observable loadingPlugin = false;
  @observable firstContainerVisible = true;
  @observable navigation: (string | number)[] = [ScreenSwitcherEnum.NEXT, AnimationEnum.SLIDE, AnimationDirectionEnum.LEFT, 500];
  @observable screensMetaMap = new Map<string, Map<ScreenMetaEnum, string>>();
  pluginStore: PluginStore = new PluginStore(this);

  debug = false;

  get toJSONString() {
    return JSON.stringify({
      screens: this.screens.map(e => e.toJSON),
      background: this.background,
      statusBarColor: this.statusBarColor,
      navigation: this.navigation,
      ios: this.ios,
      portrait: this.portrait,
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
    this.placeContent(this.screens[0]);
  }

  @action setNavigation(navigation: (string | number)[]) {
    this.navigation = navigation;
  }

  @action setLoadingPlugin(value: boolean) {
    this.loadingPlugin = value;
  }

  @action setFetchingProject(value: boolean) {
    this.fetchingProject = value;
  }

  placeSecondContainer() {
    const container = document.getElementById(SECOND_CONTAINER);
    if (container) {
      container.style.setProperty('left', '-1000px');
    }
  }

  makeProjectScreenshot = () => {
    const element = document.querySelector('#capture') as HTMLElement;
    element && html2canvas(element, { useCORS: true }).then(canvas => {
      canvas.toBlob((blob) => {
        saveAs(blob as Blob, `${this.project.title.length ? this.project.title : 'Project'}.png`);
      });
    });
  };

  @action
  async fetchProjectData(projectId: number) {
    const project = await ProjectsStore.fetchFullData(projectId);
    runInAction(() => {
      this.project = project;
    });
    this.fromJSON(project.version.data as IProjectData);
  }

  @action placeContent(screen?: IControl, toInvisible = false) {
    if (toInvisible) {
      this.firstContainerVisible && (this.secondScreen = screen);
      !this.firstContainerVisible && (this.firstScreen = screen);
    } else {
      this.firstContainerVisible && (this.firstScreen = screen);
      !this.firstContainerVisible && (this.secondScreen = screen);
    }
  }

  @action fromJSON(data: IProjectData) {
    ControlStore.clear();
    this.screens.replace(data.screens.map((e) => CreateControl(ControlEnum.Grid, e)));
    this.currentScreen = this.screens[0];
    this.placeContent(this.screens[0]);
    this.mode = data.mode;
    this.background = data.background;
    data.statusBarEnabled !== undefined && (this.statusBarEnabled = data.statusBarEnabled);
    this.statusBarColor = data.statusBarColor;
    this.ios = data.ios;
    this.portrait = data.portrait;
    data.navigation && (this.navigation = data.navigation);
    this.project.update({ title: data.title } as IProject);
    data.projectId !== undefined && data.projectId !== 0 && this.project.setId(data.projectId);
    data.versionId !== undefined && data.versionId !== 0 && this.project.version.update({versionId: data.versionId} as IProjectVersion);
    if(data.screensMetaMap) {
      this.screensMetaMap = new Map(data.screensMetaMap.map(e => [e[0], new Map(e[1] as any)]));
    } else {
      this.screensMetaMap = new Map<string, Map<ScreenMetaEnum, string>>();
    }

  }

  @action switchStatusBar() {
    this.statusBarEnabled = !this.statusBarEnabled;
  }

  @action switchPortrait() {
    this.portrait = !this.portrait;
    this.pluginStore.postMessage(PluginStore.LISTENER_ON_SWITCH_ORIENTATION, this.portrait ? 'portrait' : 'landscape');
  }


  @action switchMode() {
    this.mode = this.mode === Mode.WHITE ? Mode.DARK : Mode.WHITE;
  }

  @action setBackground(background: IBackgroundColor) {
    this.background = background;
  }

  @action setStatusBarColor(statusBarColor: string) {
    this.statusBarColor = statusBarColor;
  }

  @action effect(behavior: (string | number)[]) {

    const firstContainer = document.getElementById(FIRST_CONTAINER);
    const secondContainer = document.getElementById(SECOND_CONTAINER);

    if (!(firstContainer && secondContainer)) return;

    const visibleContainer = this.firstContainerVisible ? firstContainer : secondContainer;
    const invisibleContainer = this.firstContainerVisible ? secondContainer : firstContainer;

    visibleContainer.style.setProperty('top', '0');
    visibleContainer.style.setProperty('left', '0');
    visibleContainer.style.setProperty('opacity', '1');

    invisibleContainer.style.setProperty('z-index', '2');
    visibleContainer.style.setProperty('z-index', '1');

    const { width, height } = visibleContainer.getBoundingClientRect();

    const invisibleParams = getSwitcherParams(behavior, ScreenSwitcherEnum.NEXT);

    if(invisibleParams) {

      if (invisibleParams[1] === AnimationDirectionEnum.TOP) {
        invisibleContainer.style.setProperty('top', `${height}px`);
        invisibleContainer.style.setProperty('left', '0');
      } else if (invisibleParams[1] === AnimationDirectionEnum.BOTTOM) {
        invisibleContainer.style.setProperty('top', `-${height}px`);
        invisibleContainer.style.setProperty('left', '0');
      } else if (invisibleParams[1] === AnimationDirectionEnum.LEFT) {
        invisibleContainer.style.setProperty('left', `${width}px`);
        invisibleContainer.style.setProperty('top', '0');
      } else if (invisibleParams[1] === AnimationDirectionEnum.RIGHT) {
        invisibleContainer.style.setProperty('left', `-${width}px`);
        invisibleContainer.style.setProperty('top', '0');
      } else {
        invisibleContainer.style.setProperty('left', '0');
        invisibleContainer.style.setProperty('top', '0');
      }

      if (invisibleParams[0] === AnimationEnum.FADE) {
        invisibleContainer.style.setProperty('opacity', '0');
      }

    }

    const visibleParams = getSwitcherParams(behavior, ScreenSwitcherEnum.CURRENT);

    const visibleDuration = visibleParams ? Number(visibleParams[2]) : 0;
    const invisibleDuration = invisibleParams ? Number(invisibleParams[2]) : 0;
    const duration = Math.max(visibleDuration, invisibleDuration);

    setTimeout(() => {

      visibleParams && visibleContainer.style.setProperty('transition', `all ${visibleDuration}ms ease`);
      invisibleParams && invisibleContainer.style.setProperty('transition', `all ${invisibleDuration}ms ease`);

      if(visibleParams) {

        if (visibleParams[1] === AnimationDirectionEnum.TOP) {
          visibleContainer.style.setProperty('top', `-${height}px`);
        } else if (visibleParams[1] === AnimationDirectionEnum.BOTTOM) {
          visibleContainer.style.setProperty('top', `${height}px`);
        } else if (visibleParams[1] === AnimationDirectionEnum.LEFT) {
          visibleContainer.style.setProperty('left', `-${width}px`);
        } else if (visibleParams[1] === AnimationDirectionEnum.RIGHT) {
          visibleContainer.style.setProperty('left', `${width}px`);
        }

        if (visibleParams[0] === AnimationEnum.FADE) {
          visibleContainer.style.setProperty('opacity', '0');
          invisibleContainer.style.setProperty('opacity', '1');
        }
      }


      invisibleContainer.style.setProperty('top', '0');
      invisibleContainer.style.setProperty('left', '0');

      this.firstContainerVisible = !this.firstContainerVisible;

      setTimeout(() => {
        visibleContainer.style.setProperty('transition', 'initial');
        visibleContainer.style.setProperty('left', '-1000px');
        invisibleContainer.style.setProperty('transition', 'initial');
        visibleContainer.style.setProperty('opacity', 'initial');
        invisibleContainer.style.setProperty('opacity', 'initial');
        invisibleContainer.style.setProperty('z-index', '1');
        visibleContainer.style.setProperty('z-index', '-1');
        runInAction(() => {
          this.placeContent(undefined, !!behavior);
        })
      }, duration + 400);

    }, 100);
  }

  @action setCurrentScreenAnimate(screen: IControl, behavior?: (string | number)[]) {
    behavior = behavior && behavior.length > 1 ? behavior : this.navigation;
    this.currentScreen = screen;
    this.placeContent(screen, !!behavior && behavior.length > 1);
    !!behavior && this.effect(behavior);
  }

  @action setCurrentScreen(screen: IControl, behavior?: (string | number)[]) {
    this.currentScreen = screen;
    this.placeContent(screen, !!behavior && behavior.length > 1);

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
