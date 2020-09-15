import { action, computed, IReactionDisposer, observable, reaction, runInAction, when } from 'mobx';
import html2canvas from 'html2canvas';

import EditorDictionary from 'views/Editor/store/EditorDictionary';
import IControl, { IGrid, IScreen } from 'interfaces/IControl';
import { ControlEnum } from 'enums/ControlEnum';
import { DropEnum } from 'enums/DropEnum';
import CreateControl from 'models/Control/ControlStores';
import {
  HIST_ADD_SCREEN,
  HIST_CHANGE_META,
  HIST_CLONE_CONTROL,
  HIST_CLONE_SCREEN,
  HIST_DELETE_SCREEN,
  HIST_DROP,
  HIST_DROP_INDEX,
  HIST_DROP_PARENT,
  HIST_HANDLE_DROP_CANVAS, HIST_PROJECT_COLOR,
  HIST_PROJECT_TITLE_CHANGE,
  HIST_SETTINGS
} from 'views/Editor/store/EditorHistory';
import { ErrorHandler } from 'utils/ErrorHandler';
import {
  ERROR_DATA_IS_INCOMPATIBLE,
  ERROR_ELEMENT_DOES_NOT_EXIST,
  ERROR_USER_DID_NOT_LOGIN, MODE_DEVELOPMENT,
  ROUTE_EDITOR,
  ROUTE_SCREENS
} from 'models/Constants';
import ProjectsStore from 'models/Project/ProjectsStore';
import ProjectStore from 'models/Project/ProjectStore';
import { App } from 'models/App';
import ControlStore from 'models/Control/ControlStore';
import { SharedControls } from 'models/Project/ControlsStore';
import { OwnComponents } from 'models/Project/OwnComponentsStore';
import PluginStore from 'models/PluginStore';
import DisplayViewStore from 'models/DisplayViewStore';
import { OwnProjects } from 'models/Project/OwnProjectsStore';
import ProjectVersionStore from 'models/Project/ProjectVersionStore';
import { whiteColor } from 'assets/jss/material-dashboard-react';
import AccessEnum from 'enums/AccessEnum';
import { TextMetaEnum } from 'enums/TextMetaEnum';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';
import ProjectEnum from 'enums/ProjectEnum';
import { Mode } from 'enums/ModeEnum';
import IGenerateService from 'interfaces/IGenerateService';
import { IHistoryObject, SettingsPropType } from 'interfaces/IHistory';
import IProject, { IBackgroundColor, IProjectVersion } from 'interfaces/IProject';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import GenerateService from 'services/Generator/reactNative/GenerateService';
import ConvertService from 'services/Converter/figma/ConvertService';
import { IFigmaConverter } from 'services/Converter/figma/IFigmaConverter';
import ColorsStore from 'models/ColorsStore';

export interface DragAndDropItem {
  typeControl?: ControlEnum;
  type: string;
  control: IControl;
  index?: number;
}

class EditorViewStore extends DisplayViewStore {
  static STORE_JSON = 'storeJson';
  static AUTO_SAVE = 'autoSave';
  static PROJECT = 'Project';
  static TABS = [EditorDictionary.keys.project, EditorDictionary.keys.screen, EditorDictionary.keys.controls];
  static CONTROLS = ControlEnum;
  @observable history = ControlStore.history;
  @observable selectedControl?: IControl;
  @observable tabToolsIndex = 2;
  @observable saving = false;
  @observable savingProject = false;
  @observable generatorShowDialog = false;
  @observable generatorDialogContent: string[] | null = null;
  @observable generator: IGenerateService | null = null;
  @observable figmaConverter: IFigmaConverter | null = null;
  @observable converterShowDialog = false;
  @observable converterDialogContent: string[] | null = null;
  @observable fetchAssetsEnabled = false;
  generatorMessageReactionDisposer: IReactionDisposer;
  converterMessageReactionDisposer: IReactionDisposer;
  whenReactionDisposer?: IReactionDisposer;

  moveOpened = true;
  debug = false;
  timer?: NodeJS.Timeout;

  static get MAX_ZOOM() {
    return DisplayViewStore.MAX_ZOOM;
  }

  static get MIN_ZOOM() {
    return DisplayViewStore.MIN_ZOOM;
  }

  isCurrent = (screen: IControl) => {
    return computed(() => this.currentScreen === screen).get();
  };

  isSelected = (control: IControl) => {
    return computed(() => this.selectedControl === control).get();
  };

  get toJSON() {
    const screensMetaMap: any[] = [];
    this.screensMetaMap.forEach((value, key) => {
      screensMetaMap.push([key, Array.from(value.entries())]);
    });
    return {
      screens: this.screens.map(e => e.toJSON),
      screensMetaMap: screensMetaMap,
      navigation: this.navigation,
      background: this.background,
      statusBarEnabled: this.statusBarEnabled,
      statusBarColor: this.statusBarColor,
      mode: this.mode,
      title: this.project.title,
      ios: this.ios,
      portrait: this.portrait,
      projectId: this.project ? this.project.projectId : 0,
      versionId: this.project ? this.project.version.versionId : 0,
      owner: this.project.owner && this.project.owner!.toJSON()
    }
  }

  get toJSONString() {
    return JSON.stringify(this.toJSON);
  }

  get progress() {
    return this.figmaConverter && this.figmaConverter.progress;
  }

  @computed get currentScreenMetaList() {
    const screenMetaMap = this.screensMetaMap.get(this.currentScreen!.id);

    return Object.values(ScreenMetaEnum)
      .filter(value => !(screenMetaMap && screenMetaMap.has(value as ScreenMetaEnum)))
      .map(value => [value, this.dictionary.value(value)]);
  }

  @computed get tabProps() {
    const props = [
      {
        mode: this.mode,
        background: this.background,
        statusBarColor: this.statusBarColor,
        statusBarEnabled: this.statusBarEnabled,
        setStatusBarColor: (statusBar: string) => this.setStatusBarColor(statusBar),
        switchMode: () => this.switchMode(),
        setBackground: (background: IBackgroundColor) => this.setBackground(background),
        dictionary: this.dictionary,
        autoSave: this.autoSave,
        switchAutoSave: this.switchAutoSave,
        saveProject: this.saveProject,
        project: this.project,
        changeProjectTitle: this.changeProjectTitle,
        importProject: () => this.importProject(),
        importFromFigma: (token: string, key: string) => this.figmaConvert(token, key),
        clearProject: () => this.newProject(),
        deleteProject: () => this.deleteProject(),
        setAccess: (access: AccessEnum) => this.setAccess(access),
        switchStatusBar: () => this.switchStatusBar(),
        navigation: this.navigation,
        setNavigation: (navigation: (string | number)[]) => this.setNavigation(navigation),
        generate: () => this.generate(),
        loadAssetsEnabled: this.fetchAssetsEnabled,
        switchLoadAssets: () => this.switchFetchAssetsEnabled(),
        setColor: (oldColor: string, newColor: string) => this.setColor(oldColor, newColor),
        setBorder: (oldBorder: string, newBorder: string) => this.setBorder(oldBorder, newBorder),
      },
      {
        dictionary: this.dictionary,
        screen: this.currentScreen,
        cloneControl: this.cloneScreen,
      },
      {
        deleteControl: this.deleteControl,
        selectedControl: this.selectedControl,
        isSelected: this.isSelected,
        cloneControl: this.cloneControl,
        selectControl: this.selectControl,
        dictionary: this.dictionary,
        screens: this.screens,
        saveControl: this.saveControl,
        saveComponent: this.saveComponent,
        importControl: () => this.importControl(),
        importComponent: () => this.importComponent(),
        metaList: this.currentScreenMetaList,
        setMeta: (meta: ScreenMetaEnum, control: IControl) => this.setMeta(meta, control),
        ownComponents: this.pluginStore.components
      }
    ];
    return props[this.tabToolsIndex];
  }

  constructor(urlQuery: string) {
    super(urlQuery);

    this.history.setFabric(CreateControl);
    this.history.setViewStore(this);
    this.currentScreen!.addChild(CreateControl(ControlEnum.Grid));
    this.applyHistorySettings('background', { backgroundColor: whiteColor } as Mode & string & IBackgroundColor);
    this.applyHistorySettings('statusBarColor', whiteColor as Mode & string & IBackgroundColor);
    this.generatorMessageReactionDisposer = reaction(() => this.generatorDialogContent, (content) => {
      if (content) {
        this.openGeneratorDialog();
      }
    });
    this.converterMessageReactionDisposer = reaction(() => this.converterDialogContent, (content) => {
      if (content) {
        this.openConverterDialog();
      }
    });
    setTimeout(() => {
      this.toCenter();
    }, 500);
  }

  importData(): Promise<string> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files![0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = readerEvent => {
          const content = readerEvent.target!.result as string;
          resolve(content);
        }
      }
      input.click();
    });
  }

  async importProject() {
    try {
      const data = await this.importData();
      const json = JSON.parse(data);
      if (!json.screens) {
        throw new ErrorHandler(ERROR_DATA_IS_INCOMPATIBLE);
      }
      json.projectId = 0;
      this.fromJSON(json);
    } catch (e) {
      this.setError(Dictionary.value(e.message, Dictionary.defValue(DictionaryService.keys.project)));
      this.setTimeOut(() => this.setError(null), 5000);
    }
  }

  async importControl() {
    try {
      const data = await this.importData();
      const json = JSON.parse(data);
      if (json.versionId === undefined) {
        throw new ErrorHandler(ERROR_DATA_IS_INCOMPATIBLE);
      }
      SharedControls.push([{ type: json.type, projectId: 0, versions: [json], title: json.title } as IProject]);
    } catch (e) {
      this.setError(Dictionary.value(e.message, Dictionary.defValue(DictionaryService.keys.control)));
      this.setTimeOut(() => this.setError(null), 5000);
    }
  }

  async importComponent() {
    try {
      const data = await this.importData();
      const json = JSON.parse(data);
      if (json.versionId === undefined) {
        throw new ErrorHandler(ERROR_DATA_IS_INCOMPATIBLE);
      }
      OwnComponents.push([
        { type: json.type, projectId: OwnComponents.size, versions: [json], title: json.title, temp: true } as IProject
      ]);
    } catch (e) {
      this.setError(Dictionary.value(e.message, Dictionary.defValue(DictionaryService.keys.component)));
      this.setTimeOut(() => this.setError(null), 5000);
    }
  }

  saveProject = async (toFile?: boolean) => {
    this.setSavingProject(true);
    if (toFile) {
      this.exportToFile(this.toJSON);
      return;
    }
    const json = this.toJSONString;
    this.pluginStore.postMessage(PluginStore.LISTENER_ON_SAVE_PROJECT, json);
    if (this.pluginStore.proMode) {
      return;
    }

    try {
      if (!App.loggedIn) {
        throw new ErrorHandler(ERROR_USER_DID_NOT_LOGIN);
      }

      this.project.version.update({ data: json } as unknown as IProjectVersion);
      await ProjectsStore.save(this.project);
      App.loggedIn && this.project.userId === App.user!.userId && OwnProjects.push([this.project]);
      runInAction(() => {
        this.successMessage = this.dictionary.defValue(EditorDictionary.keys.dataSavedSuccessfully, this.project.title);
      });
      this.setSuccessRequest(true);
      this.setTimeOut(() => {
        this.setSuccessRequest(false);
        const path = ROUTE_EDITOR + '/' + this.project.projectId;
        if (window.location.pathname !== path) {
          App.navigationHistory && App.navigationHistory.replace(ROUTE_EDITOR + '/' + this.project.projectId);
        }
      }, 5000);
    } catch (err) {
      this.setError(this.dictionary.defValue(EditorDictionary.keys.dataSaveError, [this.project.title, Dictionary.value(err.message)]));
      this.setTimeOut(() => this.setError(null), 5000);
      this.pluginStore.postMessage(PluginStore.LISTENER_ON_ERROR, err.message);
    }
    this.setSavingProject(false);
  };

  private makeScreenshot(control: IControl): Promise<[File, string]> {
    const element = document.querySelector('#capture_' + control.id) as HTMLElement;
    return new Promise((resolve, reject) => {
      if (element) {
        html2canvas(element, { useCORS: true }).then(canvas => {
          canvas.toBlob((blob) => {
            const file = new File([blob as BlobPart], 'capture.png', {
              type: 'image/png'
            });
            resolve([file, canvas.toDataURL()]);
          });
        });
      } else {
        reject(new ErrorHandler(ERROR_ELEMENT_DOES_NOT_EXIST));
      }
    });
  }

  saveControl = async (control: IControl, toFile?: boolean) => {

    if (!control.instance) {
      const instance = ProjectStore.createEmpty(ProjectEnum.CONTROL);
      control.setInstance(instance);
      instance.update({ title: control.title } as IProject);
    }
    const json = control.toJSON;
    control.instance!.version.update({ data: json } as IProjectVersion);
    if (toFile) {
      this.exportToFile({ ...control.instance!.JSON, type: control.instance!.type });
      return;
    }
    const res = await this.makeScreenshot(control);
    this.pluginStore.postMessage(PluginStore.LISTENER_ON_SAVE_COMPONENT, [json, res[1]]);
    if (this.pluginStore.proMode) {
      return;
    }
    control.setSaving(true);
    try {
      if (!App.loggedIn) {
        throw new ErrorHandler(ERROR_USER_DID_NOT_LOGIN);
      }
      await ProjectsStore.save(control.instance as IProject);
      (control.instance!.type === ProjectEnum.CONTROL ? SharedControls : OwnComponents).push([control.instance!]);
      runInAction(() => {
        this.successMessage = this.dictionary.defValue(EditorDictionary.keys.dataSavedSuccessfully, control.title);
      });

      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (err) {
      this.setError(this.dictionary.defValue(EditorDictionary.keys.dataSaveError, [control.title, Dictionary.value(err.message)]));
      this.setTimeOut(() => this.setError(null), 5000);
      this.pluginStore.postMessage(PluginStore.LISTENER_ON_ERROR, err.message);
    }
    control.setSaving(false);
  };

  saveComponent = async (control: IControl, toFile?: boolean) => {
    if (!control.instance) {
      const instance = ProjectStore.createEmpty(ProjectEnum.COMPONENT);
      control.setInstance(instance);
      instance.update({ title: control.title } as IProject);
    }
    await this.saveControl(control, toFile);
  };

  exportToFile(data: { [key: string]: any }) {
    const content = JSON.stringify(data, null, '\t');
    const a = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = `${data.title}.json`;
    a.click();
    this.setSavingProject(false);
    this.fileCreatedNotification([EditorDictionary.keys.file, data.title, 'json']);
  }

  deleteControl = async (control: IControl) => {
    try {
      await (control.instance!.type === ProjectEnum.CONTROL ? SharedControls : OwnComponents).delete(control.instance!);
      runInAction(() => {
        this.successMessage = this.dictionary.defValue(EditorDictionary.keys.dataDeletedSuccessfully, control.title);
      });
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (err) {
      this.setError(this.dictionary.defValue(EditorDictionary.keys.dataDeleteError, [control.title, Dictionary.value(err.message)]));
      this.setTimeOut(() => this.setError(null), 5000);
    }
  };

  @action switchFetchAssetsEnabled() {
    this.fetchAssetsEnabled = !this.fetchAssetsEnabled;
  }

  @action openGeneratorDialog() {
    this.generatorShowDialog = true;
  }

  @action openConverterDialog() {
    this.converterShowDialog = true;
  }

  @action setContentGeneratorDialog(msg: string[] | null) {
    this.generatorDialogContent = msg;
  }

  @action setContentConverterDialog(msg: string[] | null) {
    this.converterDialogContent = msg;
  }

  @action closeGeneratorDialog = (leaveProgress?: boolean) => {
    this.generatorShowDialog = false;
    this.setContentGeneratorDialog(null);
    !leaveProgress && this.generator!.setFinished();
  }

  @action closeConverterDialog = () => {
    this.converterShowDialog = false;
    this.setContentConverterDialog(null);
  }

  @action completeCodeGeneration = () => {
    if (this.generator) {
      this.generator.generateZip();
    }
    this.closeGeneratorDialog(true);
  }

  @action clearLocalStorage() {
    localStorage.removeItem(EditorViewStore.AUTO_SAVE);
    localStorage.removeItem(EditorViewStore.STORE_JSON);
  }

  @action newProject() {
    this.clearLocalStorage();
    this.clear();
    this.project = ProjectStore.createEmpty(ProjectEnum.PROJECT);
    this.screens = observable([CreateControl(ControlEnum.Screen)]);
    this.currentScreen = this.screens[0];
    this.placeContent(this.screens[0]);
    this.currentScreen.addChild(CreateControl(ControlEnum.Grid));
    this.background = { backgroundColor: whiteColor };
    this.statusBarColor = whiteColor;
    App.navigationHistory && App.navigationHistory.replace(ROUTE_EDITOR);
  }

  @action
  async deleteProject() {
    try {
      await OwnProjects.delete(this.project);
      runInAction(() => {
        this.successMessage = this.dictionary.defValue(EditorDictionary.keys.dataDeletedSuccessfully, this.project.title);
      });
      this.setSuccessRequest(true);
      this.newProject();
      this.setTimeOut(() => {
        this.setSuccessRequest(false);
      }, 3000);
    } catch (err) {
      this.setError(this.dictionary.defValue(EditorDictionary.keys.dataDeleteError, [this.project.title, Dictionary.value(err.message)]));
      this.setTimeOut(() => this.setError(null), 5000);
    }
  }

  async generate() {
    if (this.whenReactionDisposer) {
      return;
    }
    this.setSavingProject(true);
    this.generator = await new GenerateService(this).generateRN();
    this.whenReactionDisposer = when(() => {
      return this.generator !== null && this.generator.finished;
    }, () => {
      this.setSavingProject(false);
      this.generator = null;
      this.whenReactionDisposer = undefined;
    });
  }

  @action fileCreatedNotification(messages: string[]) {
    runInAction(() => {
      this.successMessage = this.dictionary.defValue(EditorDictionary.keys.fileCreatedSuccessfully, messages);
    });
    this.setSuccessRequest(true);
    this.setTimeOut(() => this.setSuccessRequest(false), 15000);
  }

  async figmaConvert(token: string, key: string) {
    if (this.whenReactionDisposer) {
      return;
    }
    this.setSavingProject(true);
    // '55587-de2833b2-2101-4361-be55-7923873c031f',
    //   'Q09rBNMM7vskgeyXmJqEYu'
    this.figmaConverter = new ConvertService(this, token, key).convert();
    this.whenReactionDisposer = when(() => {
      return this.figmaConverter !== null && this.figmaConverter.finished;
    }, () => {
      this.setScreens(this.figmaConverter!.screensList);
      this.closeConverter()
    });
  }

  closeConverter() {
    this.setSavingProject(false);
    this.figmaConverter = null;
    this.whenReactionDisposer = undefined;
  }

  @action setScreens(screens: IControl[]) {
    ControlStore.clear();
    this.screens.replace(screens.map((e) => CreateControl(ControlEnum.Screen, e)));
    this.currentScreen = this.screens[0];
    this.placeContent(this.screens[0]);
  }

  @action clear() {
    this.history.clear();
    ControlStore.clear();
  }

  @action setSavingProject(value: boolean) {
    this.savingProject = value;
  }

  @action
  async fetchProjectData(projectId: number) {
    if (this.project.projectId === projectId && this.autoSave) {
      return;
    }
    this.setFetchingProject(true);
    try {
      await super.fetchProjectData(projectId);
      if (!App.user || !App.loggedIn || (this.project.owner && this.project.owner.userId !== App.user.userId)) {
        if (this.project) {
          if (this.project.access === AccessEnum.READ_BY_LINK) {
            App.navigationHistory && App.navigationHistory.replace(`${ROUTE_SCREENS}/${this.project.projectId}`);
          } else if (this.project.access !== AccessEnum.EDIT_BY_LINK) {
            this.project = ProjectStore.from({ ...this.project, projectId: 0, userId: App.user!.userId });
            this.project.updateVersions([ProjectVersionStore.createEmpty()]);
            App.navigationHistory && App.navigationHistory.replace(ROUTE_EDITOR);
          }
        }
      }
      this.save();

    } catch (err) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Fetch full instance data error %s', err);
      App.navigationHistory && App.navigationHistory.replace(ROUTE_EDITOR);
    }
    this.setFetchingProject(false);
  }

  @action
  async setAccess(access: AccessEnum) {
    try {
      await ProjectsStore.setAccess(this.project, access);
    } catch (e) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Change access error: %s', e.message);
    }
  }

  @action
  async checkLocalStorage() {
    const autoSave = await localStorage.getItem(EditorViewStore.AUTO_SAVE);
    autoSave && this.setAutoSave(true);
    const json = await localStorage.getItem(EditorViewStore.STORE_JSON);
    if (this.autoSave && json) {
      try {
        const data = JSON.parse(json);
        this.fromJSON(data);
      } catch (err) {
        process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('LocalStorage json data parse error %s', err.message);
      }
    }
    this.setFetchingProject(false);
  }

  @action save() {
    const json = this.toJSONString;
    this.pluginStore.postMessage(PluginStore.LISTENER_ON_DATA, json);
    if (!this.autoSave) {
      return;
    }
    this.saving = true;
    localStorage.setItem(EditorViewStore.STORE_JSON, json);
    if (!this.timer) {
      this.timer = setTimeout(() => {

        runInAction(() => {
          this.saving = false;
        });
        this.timer = undefined;
      }, 1000)
    }
  }

  @action switchAutoSave = () => {
    this.autoSave = !this.autoSave;
    if (this.autoSave) {
      localStorage.setItem(EditorViewStore.AUTO_SAVE, EditorViewStore.AUTO_SAVE);
    } else {
      this.clearLocalStorage();
    }
  };

  @action setAutoSave(value: boolean) {
    this.autoSave = value;
  }

  @action moveControl = (
    parent: IControl,
    source: IControl,
    dropAction: DropEnum,
  ) => {
    if (!this.moveOpened) {
      return;
    }
    this.moveOpened = false;
    setTimeout(() => {
      if (dropAction === DropEnum.Inside && source.hasChild(parent)) {
        return;
      }
      if (parent === source) {
        return;
      }
      parent && parent.setTarget(dropAction);
      this.moveOpened = true;
    }, 100)

  };

  @action applyHistorySettings(key: SettingsPropType, value: Mode & string & IBackgroundColor) {
    if (key === 'background') {
      const object = { id: EditorViewStore.PROJECT, background: this.background.backgroundColor } as IScreen;
      ColorsStore.deleteColor(object, true);
      ColorsStore.addColor(
        Object.assign({}, object, { background: (value as IBackgroundColor).backgroundColor }), true);
    } else if (key === 'statusBarColor') {
      const object = { id: EditorViewStore.PROJECT, statusBarColor: this.statusBarColor } as IScreen;
      ColorsStore.deleteColor(object, false);
      ColorsStore.addColor(
        Object.assign({}, object, { statusBarColor: value }), false);
    }
    this[key] = value;
  }

  @action switchStatusBar() {
    super.switchStatusBar();
    this.save();
  }

  @action setStatusBarEnabled(enabled: boolean) {
    super.setStatusBarEnabled(enabled);
    this.save();
    const object = { id: EditorViewStore.PROJECT, statusBarColor: this.statusBarColor } as IScreen;
    enabled ?
      ColorsStore.addColor(object, false) :
      ColorsStore.deleteColor(object, false);
  }

  @action switchPortrait() {
    super.switchPortrait();
    this.save();
  }

  @action setIOS(ios: boolean) {
    super.setIOS(ios);
    this.save();
  }

  @action setNavigation(navigation: (string | number)[]) {
    super.setNavigation(navigation);
    this.save();
  }

  @action setScreenMeta(meta: ScreenMetaEnum, screen: IControl, control: IGrid) {
    if (!this.screensMetaMap.has(screen.id)) {
      this.screensMetaMap.set(screen.id, new Map());
    }
    const screenMetaMap = this.screensMetaMap.get(screen.id) as Map<ScreenMetaEnum, string>;
    if (screenMetaMap.has(control.meta as ScreenMetaEnum)) {
      screenMetaMap.delete(control.meta as ScreenMetaEnum);
    }
    if (meta !== ScreenMetaEnum.COMPONENT) {
      screenMetaMap.set(meta, control.id);
    }
    control.setMeta(meta);
  }

  // ####### apply history start ######## //

  @action setColor(oldColor: string, newColor: string, noHistory?: boolean) {
    const undo = { control: this.currentScreen!.id, oldValue: newColor, value: oldColor } as unknown as IHistoryObject;
    const redo = { control: this.currentScreen!.id, oldValue: oldColor, value: newColor } as unknown as IHistoryObject;
    ColorsStore.setColor(oldColor, newColor, this);
    !noHistory && ControlStore.history.add([HIST_PROJECT_COLOR, undo, redo]);
  }

  @action setBorder(oldBorder: string, newBorder: string, noHistory?: boolean) {
    const undo = { control: this.currentScreen!.id, oldValue: newBorder, value: oldBorder } as unknown as IHistoryObject;
    const redo = { control: this.currentScreen!.id, oldValue: oldBorder, value: newBorder } as unknown as IHistoryObject;
    ColorsStore.setBorder(oldBorder, newBorder);
    !noHistory && ControlStore.history.add([HIST_PROJECT_COLOR, undo, redo]);
  }

  @action setMeta(meta: ScreenMetaEnum | TextMetaEnum, control: IControl, noHistory?: boolean) {
    const undo = { control: control.id, meta: control.meta };
    if (control.type === ControlEnum.Grid) {
      this.setScreenMeta(meta as ScreenMetaEnum, this.currentScreen!, control as IGrid);
    } else {
      control.setMeta(meta);
    }

    const redo = { control: control.id, meta: control.meta };
    !noHistory && ControlStore.history.add([HIST_CHANGE_META, undo, redo]);
  }

  @action switchMode() {
    const undo = { control: this.currentScreen!.id, key: 'mode', value: this.mode } as unknown as IHistoryObject;

    super.switchMode();
    const redo = { control: this.currentScreen!.id, key: 'mode', value: this.mode } as unknown as IHistoryObject;
    this.history.add([HIST_SETTINGS, undo, redo]);
  }

  @action changeProjectTitle = (value: string) => {
    if (value.length > 150) {
      return;
    }
    const undo = { control: this.currentScreen!.id, value: this.project.title } as unknown as IHistoryObject;
    this.project.update({ title: value } as IProject);
    const redo = { control: this.currentScreen!.id, value: this.project.title } as unknown as IHistoryObject;
    this.history.add([HIST_PROJECT_TITLE_CHANGE, undo, redo]);
  };

  @action setBackground(background: IBackgroundColor) {
    const object = { id: EditorViewStore.PROJECT, background: this.background.backgroundColor } as IScreen;
    ColorsStore.deleteColor(object, true);
    ColorsStore.addColor(
      Object.assign({}, object, { background: background.backgroundColor }),
      true);
    const undo = {
      control: this.currentScreen!.id,
      key: 'background',
      value: { ...this.background }
    } as unknown as IHistoryObject;
    super.setBackground(background);
    const redo = {
      control: this.currentScreen!.id,
      key: 'background',
      value: { ...this.background }
    } as unknown as IHistoryObject;
    this.history.add([HIST_SETTINGS, undo, redo]);
  }

  @action setStatusBarColor(statusBarColor: string) {
    const object = { id: EditorViewStore.PROJECT, statusBarColor: this.statusBarColor } as IScreen;
    ColorsStore.deleteColor(object, false);
    ColorsStore.addColor(Object.assign({}, object, { statusBarColor }), false);
    const undo = {
      control: this.currentScreen!.id,
      key: 'statusBarColor',
      value: this.statusBarColor
    } as unknown as IHistoryObject;
    super.setStatusBarColor(statusBarColor);
    const redo = {
      control: this.currentScreen!.id,
      key: 'statusBarColor',
      value: statusBarColor
    } as unknown as IHistoryObject;
    this.history.add([HIST_SETTINGS, undo, redo]);
  }

  // 2. source.parent is not null and parent.parent is not null
  //  2.1 source.parent === parent.parent
  //   2.1.1 dropAction === Inside && parent.allowChildren -> source.parent remove source drop source inside parent (2.1.1 and 2.2.1)
  //   2.1.2 dropAction === Above -> drop source above parent\ / sort items inside \
  //   2.1.3 dropAction === Below -> drop source below parent/ \ the same parent   /
  //  2.2 source.parent !== parent.parent
  //   2.2.1 dropAction === Inside && parent.allowChildren -> source.parent remove source drop source inside parent (2.1.1 and 2.2.1)
  //   2.2.2 dropAction === Above -> source.parent remove source drop inside parent.parent above parent\ / sort items inside the same parent \
  //   2.2.3 dropAction === Below -> source.parent remove source drop inside parent.parent below parent/ \  which equal parent.parent        /
  // 4. source.parent is null parent.parent is not null
  //  4.1 dropAction === Inside && parent.allowChildren -> drop source inside parent
  //  4.2 dropAction === Above -> drop source inside parent.parent above parent \ / sort items inside the same parent \
  //  4.3 dropAction === Below -> drop source inside parent.parent below parent / \  which equal parent.parent        /
  @action handleDropElement = (parent: IControl, source: IControl, dropAction: DropEnum) => {

    if (!ControlStore.has(source.id)) {
      source = CreateControl(source.type);
    }

    if (source.instance) {
      source = source.clone();
    }

    const sParent = source.parentId ? ControlStore.getById(source.parentId) : undefined;
    const pParent = parent.parentId ? ControlStore.getById(parent.parentId) : undefined;

    if (source.hasChild(parent)) {
      return;
    }

    if (!pParent) {
      return;
    }

    if (parent === source) {
      return;
    }

    if (sParent && pParent) { // 2
      if (sParent === pParent) { // 2.1.

        if (dropAction === DropEnum.Inside) { // 2.1.1.
          this.debug && console.log('2.1.1 DropEnum.Inside', parent.title, source.title);
          if (parent.allowChildren) {
            this.history.add([HIST_DROP_PARENT, {
              control: source.id,
              parent: parent.id,
              oldParent: source.parentId,
              index: sParent.children.indexOf(source)
            }, {
              control: source.id,
              parent: parent.id,
              oldParent: source.parentId,
              index: parent.children.length
            }]);
            sParent.removeChild(source);
            parent.addChild(source);
          }

        } else if (dropAction === DropEnum.Above) { // 2.1.2.
          this.debug && console.log('2.1.2 DropEnum.Above', parent.title, source.title);
          const sourceCurrentIndex = sParent.children.indexOf(source);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.moveChildren(sourceCurrentIndex, sourceNewIndex);
          this.history.add([HIST_DROP_INDEX, {
            control: source.id,
            parent: pParent.id,
            index: sourceNewIndex,
            oldIndex: sourceCurrentIndex
          }, {
            control: source.id,
            parent: pParent.id,
            index: sourceNewIndex,
            oldIndex: sourceCurrentIndex
          }]);

        } else { // 2.1.3.
          // dropAction === DropEnum.Below
          this.debug && console.log('2.1.3 DropEnum.Below', parent.title, source.title);
          const sourceCurrentIndex = sParent.children.indexOf(source);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.moveChildren(sourceCurrentIndex, sourceNewIndex);
          this.history.add([HIST_DROP_INDEX, {
            control: source.id,
            parent: pParent.id,
            index: sourceNewIndex,
            oldIndex: sourceCurrentIndex
          }, {
            control: source.id,
            parent: pParent.id,
            index: sourceNewIndex,
            oldIndex: sourceCurrentIndex
          }]);
        }
      } else { // 2.2.
        // source.parent !== parent.parent
        const removeIndex = sParent.children.indexOf(source);
        sParent.removeChild(source);

        if (dropAction === DropEnum.Inside) { // 2.2.1.
          this.debug && console.log('2.2.1 DropEnum.Inside', parent.title, source.title);
          if (parent.allowChildren) {
            this.history.add([HIST_DROP_PARENT, {
              control: source.id,
              parent: parent.id,
              oldParent: source.parentId,
              index: removeIndex
            }, {
              control: source.id,
              parent: parent.id,
              oldParent: source.parentId,
              index: parent.children.length
            }]);
            parent.addChild(source);
          }

        } else if (dropAction === DropEnum.Above) { // 2.2.2.
          this.debug && console.log('2.2.2 DropEnum.Above', parent.title, source.title);

          const newSourceIndex = pParent.children.indexOf(parent);

          this.history.add([HIST_DROP_PARENT, {
            control: source.id,
            parent: pParent.id,
            oldParent: source.parentId,
            index: removeIndex
          }, {
            control: source.id,
            parent: pParent.id,
            oldParent: source.parentId,
            index: newSourceIndex
          }]);
          pParent.spliceChild(newSourceIndex, source);

        } else { // 2.2.3
          //dropAction === DropEnum.Below
          this.debug && console.log('2.2.3 DropEnum.Below', parent.title, source.title);

          const newSourceIndex = pParent.children.indexOf(parent);

          this.history.add([HIST_DROP_PARENT, {
            control: source.id,
            parent: pParent.id,
            oldParent: source.parentId,
            index: removeIndex
          }, {
            control: source.id,
            parent: pParent.id,
            oldParent: source.parentId,
            index: newSourceIndex + 1
          }]);
          pParent.spliceChild(newSourceIndex + 1, source);

        }
      }

    } else if (!sParent && pParent) { // 4.

      if (dropAction === DropEnum.Inside) { // 4.1.
        this.debug && console.log('4.1 DropEnum.Inside', parent.title, source.title);
        if (parent.allowChildren) {
          this.history.add([HIST_DROP, { control: source.id, parent: parent.id },
            { control: source.toJSON, parent: parent.id, index: parent.children.length }]);
          parent.addChild(source);
        }

      } else if (dropAction === DropEnum.Above) { // 4.2.
        this.debug && console.log('4.2 DropEnum.Above', parent.title, source.title);

        const newSourceIndex = pParent.children.indexOf(parent);

        this.history.add([HIST_DROP, { control: source.id, parent: pParent.id },
          { control: source.toJSON, parent: pParent.id, index: newSourceIndex }]);
        pParent.spliceChild(newSourceIndex, source);

      } else { // 4.3.
        this.debug && console.log('4.3 DropEnum.Below', parent.title, source.title)
        //dropAction === DropEnum.Below

        const newSourceIndex = pParent.children.indexOf(parent);

        this.history.add([HIST_DROP, { control: source.id, parent: pParent.id },
          { control: source.toJSON, parent: pParent.id, index: newSourceIndex + 1 }]);

        pParent.spliceChild(newSourceIndex + 1, source);
      }
    }

    this.debug && console.log('document state', source.parentId, sParent && sParent.children.length, pParent && pParent.children.length);
  };

  @action handleDropCanvas = (item: DragAndDropItem) => {
    let control = item.control;
    if (!control) return;

    if (!ControlStore.has(control.id)) {
      control = CreateControl(control.type);
    }

    if (control.instance) {
      control = control.clone();
    }

    const undo = {
      control: control.id,
      screen: this.currentScreen!.id,
      index: -1
    };
    const redo = {
      control: control.toJSON,
      screen: this.currentScreen!.id,
      parent: control.parentId,
      index: -1
    };

    if (control.parentId) {
      const parent = ControlStore.getById(control.parentId);
      if (parent) {
        redo.index = parent.children.indexOf(control);
        undo.index = redo.index;
        parent.removeChild(control);
      }
    } else {
      redo.index = this.currentScreen!.children.indexOf(control);
      redo.index > -1 && (redo.parent = this.currentScreen!.id);
      undo.index = redo.index;
      this.currentScreen!.removeChild(control);
    }
    this.currentScreen!.addChild(control);

    this.history.add([HIST_HANDLE_DROP_CANVAS, undo, redo]);
  };

  @action addScreen = () => {
    const screen = CreateControl(ControlEnum.Screen);
    this.screens.push(screen);
    const undo = { control: screen.id, screen: this.currentScreen!.id };
    this.currentScreen = screen;
    this.currentScreen.addChild(CreateControl(ControlEnum.Grid));
    const redo = { control: this.currentScreen.toJSON };
    this.history.add([HIST_ADD_SCREEN, undo, redo]);
    return screen;
  };

  @action removeScreen = (screen: IControl, noHistory?: boolean) => {
    const undo = { control: screen.toJSON, screen: this.currentScreen!.id };
    const redo = { control: screen.id };
    this.screens.splice(this.screens.indexOf(screen), 1);
    if (this.currentScreen === screen) {
      this.currentScreen = this.screens[0];
    }
    !noHistory && this.history.add([HIST_DELETE_SCREEN, undo, redo]);
  };

  @action cloneScreen = (screen: IControl) => {
    const clone = screen.clone();
    const undo = { control: clone.id };
    const index = this.screens.indexOf(screen);
    this.screens.splice(index + 1, 0, clone);
    const redo = { control: clone.toJSON, index: index + 1 };
    this.history.add([HIST_CLONE_SCREEN, undo, redo]);
  };

  @action cloneControl = (control: IControl) => {
    const clone = control.clone();
    const undo = { control: clone.id };
    const redo = { control: clone.toJSON, parent: control.parentId, index: -1 };
    if (control.parentId) {
      const parent = ControlStore.getById(control.parentId);
      const index = parent!.children.indexOf(control);
      parent!.spliceChild(index + 1, clone);
      redo.index = index + 1;
    }
    this.history.add([HIST_CLONE_CONTROL, undo, redo]);
  };

  // ####### apply history end ######## //

  @action setCurrentScreen(screen: IControl, behavior?: string[]) {
    super.setCurrentScreen(screen, behavior);
  }

  @action spliceScreen(screen: IControl, index: number) {
    this.screens.splice(index, 0, screen);
  }

  @action selectControl = (control?: IControl, screen?: IControl, fromDevice?: boolean) => {
    this.tabToolsIndex = 2;
    this.selectedControl = control;
    if (control && screen) {
      if (this.currentScreen !== screen) {
        this.setCurrentScreen(screen);
      }
    }
    if (fromDevice && control) {
      control.applyFoSelected();
      setTimeout(() => {
        control.refObj && control.refObj.scrollIntoView(true);
      }, 400);

    }

  };

  @action addItem(control: IControl) {
    this.currentScreen!.addChild(control);
  }

  @action handleTabTool = (_: any, index: number) => {
    this.tabToolsIndex = index;
  };

  dispose() {
    super.dispose();
    this.generatorMessageReactionDisposer && this.generatorMessageReactionDisposer();
    this.whenReactionDisposer && this.whenReactionDisposer();
    this.clear();
  }
}

export default EditorViewStore;
