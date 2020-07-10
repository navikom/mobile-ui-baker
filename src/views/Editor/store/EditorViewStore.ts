import { action, computed, IReactionDisposer, observable, reaction, runInAction } from 'mobx';
import html2canvas from 'html2canvas';

import EditorDictionary from 'views/Editor/store/EditorDictionary';
import IControl, { IGrid } from 'interfaces/IControl';
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
  HIST_HANDLE_DROP_CANVAS,
  HIST_PROJECT_TITLE_CHANGE,
  HIST_SETTINGS
} from 'views/Editor/store/EditorHistory';
import { IHistoryObject, SettingsPropType } from 'interfaces/IHistory';
import IProject, { IBackgroundColor, IProjectVersion } from 'interfaces/IProject';
import ProjectsStore from 'models/Project/ProjectsStore';
import ProjectStore from 'models/Project/ProjectStore';
import ProjectEnum from 'enums/ProjectEnum';
import { Mode } from 'enums/ModeEnum';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { App } from 'models/App';
import { ErrorHandler } from 'utils/ErrorHandler';
import {
  ERROR_DATA_IS_INCOMPATIBLE,
  ERROR_ELEMENT_DOES_NOT_EXIST,
  ERROR_USER_DID_NOT_LOGIN, MODE_DEVELOPMENT,
  ROUTE_EDITOR,
  ROUTE_SCREENS
} from 'models/Constants';
import ControlStore from 'models/Control/ControlStore';
import { SharedControls } from 'models/Project/ControlsStore';
import { OwnComponents } from 'models/Project/OwnComponentsStore';
import PluginStore from 'models/PluginStore';
import DisplayViewStore from 'models/DisplayViewStore';
import { whiteColor } from 'assets/jss/material-dashboard-react';
import { OwnProjects } from 'models/Project/OwnProjectsStore';
import AccessEnum from 'enums/AccessEnum';
import GenerateService from 'services/Generator/reactNative/GenerateService';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';
import { TextMetaEnum } from 'enums/TextMetaEnum';
import IGenerateService from 'interfaces/IGenerateService';
import ProjectVersionStore from '../../../models/Project/ProjectVersionStore';

export interface DragAndDropItem {
  typeControl?: ControlEnum;
  type: string;
  control: IControl;
  index?: number;
}

class EditorViewStore extends DisplayViewStore {
  static STORE_JSON = 'storeJson';
  static AUTO_SAVE = 'autoSave';
  static TABS = [EditorDictionary.keys.project, EditorDictionary.keys.controls];
  static CONTROLS = ControlEnum;
  @observable history = ControlStore.history;
  @observable selectedControl?: IControl;
  @observable tabToolsIndex = 1;
  @observable saving = false;
  @observable savingProject = false;
  @observable generatorShowDialog = false;
  @observable generatorDialogContent: string[] | null = null;
  generator: IGenerateService | null = null;
  reactionDisposer: IReactionDisposer;

  moveOpened = true;
  debug = false;
  timer?: NodeJS.Timeout;

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
      versionId: this.project ? this.project.version.versionId : 0
    }
  }

  get toJSONString() {
    return JSON.stringify(this.toJSON);
  }

  @computed get currentScreenMetaList() {
    const screenMetaMap = this.screensMetaMap.get(this.currentScreen.id);

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
        clearProject: () => this.newProject(),
        deleteProject: () => this.deleteProject(),
        setAccess: (access: AccessEnum) => this.setAccess(access),
        switchStatusBar: () => this.switchStatusBar(),
        navigation: this.navigation,
        setNavigation: (navigation: (string | number)[]) => this.setNavigation(navigation),
        generate: () => this.generate()
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
        setMeta: (meta: ScreenMetaEnum, control: IControl) => this.setMeta(meta, control)
      }
    ];
    return props[this.tabToolsIndex];
  }

  constructor(urlQuery: string) {
    super(urlQuery);

    this.history.setFabric(CreateControl);
    this.history.setViewStore(this);
    this.currentScreen.changeTitle('Screen', true);
    this.currentScreen.addChild(CreateControl(ControlEnum.Grid));
    this.reactionDisposer = reaction(() => this.generatorDialogContent, (content) => {
      if(content) {
        this.openGeneratorDialog();
      }
    });
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
      OwnComponents.push([{ type: json.type, projectId: 0, versions: [json], title: json.title } as IProject]);
    } catch (e) {
      this.setError(Dictionary.value(e.message, Dictionary.defValue(DictionaryService.keys.component)));
      this.setTimeOut(() => this.setError(null), 5000);
    }
  }

  saveProject = async (toFile?: boolean) => {

    if (toFile) {
      this.importToFile(this.toJSON);
      return;
    }
    const json = this.toJSONString;
    this.pluginStore.postMessage(PluginStore.LISTENER_ON_SAVE_PROJECT, json);
    if (this.pluginStore.proMode) {
      return;
    }
    this.setSavingProject(true);
    try {
      if (!App.loggedIn) {
        throw new ErrorHandler(ERROR_USER_DID_NOT_LOGIN);
      }

      this.project.version.update({ data: json } as unknown as IProjectVersion);
      await ProjectsStore.save(this.project);
      App.loggedIn && this.project.userId === App.user!.userId && OwnProjects.push([this.project]);
      runInAction(() => {
        this.successMessage = Dictionary.defValue(DictionaryService.keys.dataSavedSuccessfully, this.project.title);
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
      this.setError(Dictionary.defValue(DictionaryService.keys.dataSaveError, [this.project.title, Dictionary.value(err.message)]));
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
      this.importToFile({ ...control.instance!.JSON, type: control.instance!.type });
      return;
    }
    const [file, base64] = await this.makeScreenshot(control);
    this.pluginStore.postMessage(PluginStore.LISTENER_ON_SAVE_COMPONENT, [json, base64]);
    if (this.pluginStore.proMode) {
      return;
    }
    control.setSaving(true);
    try {
      if (!App.loggedIn) {
        throw new ErrorHandler(ERROR_USER_DID_NOT_LOGIN);
      }
      await ProjectsStore.save(control.instance as IProject, [file]);
      (control.instance!.type === ProjectEnum.CONTROL ? SharedControls : OwnComponents).push([control.instance!]);
      runInAction(() => {
        this.successMessage = Dictionary.defValue(DictionaryService.keys.dataSavedSuccessfully, control.title);
      });

      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (err) {
      this.setError(Dictionary.defValue(DictionaryService.keys.dataSaveError, [control.title, Dictionary.value(err.message)]));
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

  importToFile(data: { [key: string]: any }) {
    const content = JSON.stringify(data, null, '\t');
    const a = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = `${data.title}.json`;
    a.click();
  }

  deleteControl = async (control: IControl) => {
    try {
      await (control.instance!.type === ProjectEnum.CONTROL ? SharedControls : OwnComponents).delete(control.instance!);
      runInAction(() => {
        this.successMessage = Dictionary.defValue(DictionaryService.keys.dataDeletedSuccessfully, control.title);
      });
      this.setSuccessRequest(true);
      this.setTimeOut(() => this.setSuccessRequest(false), 5000);
    } catch (err) {
      this.setError(Dictionary.defValue(DictionaryService.keys.dataDeleteError, [control.title, Dictionary.value(err.message)]));
      this.setTimeOut(() => this.setError(null), 5000);
    }
  };

  @action openGeneratorDialog() {
    this.generatorShowDialog = true;
  }

  @action setContentGeneratorDialog(msg: string[] | null) {
    this.generatorDialogContent = msg;
  }

  @action closeGeneratorDialog = () => {
    this.generatorShowDialog = false;
    this.setContentGeneratorDialog(null);
    this.generator = null;
  }

  @action completeCodeGeneration = () => {
    if(this.generator) {
      this.generator.generateZip();
    }
    this.closeGeneratorDialog();

  }

  @action clearLocalStorage() {
    localStorage.removeItem(EditorViewStore.AUTO_SAVE);
    localStorage.removeItem(EditorViewStore.STORE_JSON);
  }

  @action newProject() {
    this.clearLocalStorage();
    this.clear();
    this.project = ProjectStore.createEmpty(ProjectEnum.PROJECT);
    this.screens = observable([CreateControl(ControlEnum.Grid)]);
    this.currentScreen = this.screens[0];
    this.placeContent(this.screens[0]);
    this.currentScreen.changeTitle('Screen', true);
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
        this.successMessage = Dictionary.defValue(DictionaryService.keys.dataDeletedSuccessfully, this.project.title);
      });
      this.setSuccessRequest(true);
      this.newProject();
      this.setTimeOut(() => {
        this.setSuccessRequest(false);
      }, 3000);
    } catch (err) {
      this.setError(Dictionary.defValue(DictionaryService.keys.dataDeleteError, [this.project.title, Dictionary.value(err.message)]));
      this.setTimeOut(() => this.setError(null), 5000);
    }
  }

  async generate() {
    this.generator = await new GenerateService(this).generateRN();
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
    this[key] = value;
  }

  @action switchStatusBar() {
    super.switchStatusBar();
    this.save();
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

  @action setMeta(meta: ScreenMetaEnum | TextMetaEnum, control: IControl, noHistory?: boolean) {
    const undo = { control: control.id, meta: control.meta };
    if(control.type === ControlEnum.Grid) {
      this.setScreenMeta(meta as ScreenMetaEnum, this.currentScreen, control as IGrid);
    } else {
      control.setMeta(meta);
    }

    const redo = { control: control.id, meta: control.meta };
    !noHistory && ControlStore.history.add([HIST_CHANGE_META, undo, redo]);
  }

  @action switchMode() {
    const undo = { control: this.currentScreen.id, key: 'mode', value: this.mode } as unknown as IHistoryObject;

    super.switchMode();
    const redo = { control: this.currentScreen.id, key: 'mode', value: this.mode } as unknown as IHistoryObject;
    this.history.add([HIST_SETTINGS, undo, redo]);
  }

  @action changeProjectTitle = (value: string) => {
    if (value.length > 150) {
      return;
    }
    const undo = { control: this.currentScreen.id, value: this.project.title } as unknown as IHistoryObject;
    this.project.update({ title: value } as IProject);
    const redo = { control: this.currentScreen.id, value: this.project.title } as unknown as IHistoryObject;
    this.history.add([HIST_PROJECT_TITLE_CHANGE, undo, redo]);
  };

  @action setBackground(background: IBackgroundColor) {
    const undo = {
      control: this.currentScreen.id,
      key: 'background',
      value: { ...this.background }
    } as unknown as IHistoryObject;
    super.setBackground(background);
    const redo = {
      control: this.currentScreen.id,
      key: 'background',
      value: { ...this.background }
    } as unknown as IHistoryObject;
    this.history.add([HIST_SETTINGS, undo, redo]);
  }

  @action setStatusBarColor(statusBarColor: string) {
    const undo = {
      control: this.currentScreen.id,
      key: 'statusBarColor',
      value: this.statusBarColor
    } as unknown as IHistoryObject;
    super.setStatusBarColor(statusBarColor);
    const redo = {
      control: this.currentScreen.id,
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
      screen: this.currentScreen.id,
      index: -1
    };
    const redo = {
      control: control.toJSON,
      screen: this.currentScreen.id,
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
      redo.index = this.currentScreen.children.indexOf(control);
      redo.index > -1 && (redo.parent = this.currentScreen.id);
      undo.index = redo.index;
      this.currentScreen.removeChild(control);
    }
    this.currentScreen.addChild(control);

    this.history.add([HIST_HANDLE_DROP_CANVAS, undo, redo]);
  };

  @action addScreen = () => {
    const screen = CreateControl(ControlEnum.Grid);
    screen.changeTitle('Screen');
    this.screens.push(screen);
    const undo = { control: screen.id, screen: this.currentScreen.id };
    this.currentScreen = screen;
    this.currentScreen.addChild(CreateControl(ControlEnum.Grid));
    const redo = { control: this.currentScreen.toJSON };
    this.history.add([HIST_ADD_SCREEN, undo, redo]);
    return screen;
  };

  @action removeScreen = (screen: IControl, noHistory?: boolean) => {
    const undo = { control: screen.toJSON, screen: this.currentScreen.id };
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

  @action selectControl = (control?: IControl, screen?: IControl) => {
    this.tabToolsIndex = 1;
    this.selectedControl = control;
    if(control && screen) {
      if(this.currentScreen !== screen) {
        this.setCurrentScreen(screen);
      }
    }
  };

  @action addItem(control: IControl) {
    this.currentScreen.addChild(control);
  }

  @action handleTabTool = (_: any, index: number) => {
    this.tabToolsIndex = index;
  };

  dispose() {
    super.dispose();
    this.reactionDisposer && this.reactionDisposer();
  }
}

export default EditorViewStore;
