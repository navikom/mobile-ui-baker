import { action, computed, IObservableArray, observable, runInAction } from "mobx";
import { whiteColor } from "assets/jss/material-dashboard-react";
import EditorDictionary, { data } from "views/Editor/store/EditorDictionary";
import { IObject } from "services/Dictionary/AbstractDictionary";
import IControl from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";
import Control from "models/Control/Control";
import CreateControl from "models/Control/ControlStores";
import {
  HIST_ADD_SCREEN, HIST_CLONE_CONTROL, HIST_CLONE_SCREEN,
  HIST_CURRENT_SCREEN, HIST_DELETE_SCREEN,
  HIST_DROP,
  HIST_DROP_INDEX,
  HIST_DROP_PARENT,
  HIST_HANDLE_DROP_CANVAS, HIST_SETTINGS
} from "views/Editor/store/EditorHistory";
import { IHistoryObject, SettingsPropType } from "interfaces/IHistory";

export interface IBackgroundColor {
  backgroundColor: string;
}

export interface DragAndDropItem {
  typeControl?: ControlEnum;
  type: string;
  control: IControl;
  index?: number;
}

export enum Mode {
  DARK,
  WHITE
}

class EditorViewStore {
  static STORE_JSON = "storeJson";
  static AUTO_SAVE = "autoSave";
  static TABS = [EditorDictionary.keys.controls, EditorDictionary.keys.settings];
  static CONTROLS = ControlEnum;
  @observable history = Control.history;
  @observable screens: IObservableArray<IControl>;
  @observable currentScreen: IControl;
  @observable selectedControl?: IControl;
  @observable dictionary = new EditorDictionary();
  @observable background: IBackgroundColor = { backgroundColor: whiteColor };
  @observable statusBarColor: string = whiteColor;
  @observable mode: Mode = Mode.WHITE;
  @observable tabToolsIndex: number = 0;
  @observable portrait: boolean = true;
  @observable ios: boolean = false;
  @observable autoSave: boolean = false;

  moveOpened: boolean = true;
  debug: boolean = false;

  isCurrent = (screen: IControl) => {
    return computed(() => this.currentScreen === screen).get();
  };

  isSelected = (control: IControl) => {
    return computed(() => this.selectedControl === control).get();
  };

  @computed get tabProps() {
    const props = [
      {
        selectedControl: this.selectedControl,
        isSelected: this.isSelected,
        cloneControl: this.cloneControl,
        selectControl: this.selectControl,
        dictionary: this.dictionary,
        screens: this.screens
      },
      {
        mode: this.mode,
        background: this.background,
        statusBarColor: this.statusBarColor,
        setStatusBarColor: this.setStatusBarColor,
        switchMode: this.switchMode,
        setBackground: this.setBackground,
        dictionary: this.dictionary,
        autoSave: this.autoSave,
        switchAutoSave: this.switchAutoSave
      }
    ];
    return props[this.tabToolsIndex];
  }

  constructor(newData?: typeof data & IObject) {
    this.history.setFabric(CreateControl);
    this.history.setViewStore(this);
    newData && this.dictionary.setData(newData);
    this.screens = observable([CreateControl(ControlEnum.Grid)]);
    this.currentScreen = this.screens[0];
    this.currentScreen.changeTitle("Screen", true);
    this.currentScreen.addChild(CreateControl(ControlEnum.Grid));
    this.selectControl(this.currentScreen.children[0]);

    this.checkLocalStorage();
  }

  @action clearLocalStorage() {
    localStorage.clear();
  }

  @action async checkLocalStorage() {
    const autoSave = await localStorage.getItem(EditorViewStore.AUTO_SAVE);
    autoSave && this.setAutoSave(true);
    const json = await localStorage.getItem(EditorViewStore.STORE_JSON);

    if(this.autoSave && json) {
      try {
        const data = JSON.parse(json);
        runInAction(() => {
          this.screens.replace(data.screens.map((e: IControl) => CreateControl(ControlEnum.Grid, e)));
          this.currentScreen = this.screens[0];
          this.selectControl(this.currentScreen.children[0]);
          this.mode = data.mode;
          this.background = data.background;
          this.statusBarColor = data.statusBarColor;
        })
      } catch(err) {
        console.log("LocalStorage json data parse error %s", err.message);
      }
    }
  }

  @action save() {
    if(!this.autoSave) {
      return;
    }
    const json = JSON.stringify({
      screens: this.screens.map(e => e.toJSON),
      background: this.background,
      statusBarColor: this.statusBarColor,
      mode: this.mode
    });
    localStorage.setItem(EditorViewStore.STORE_JSON, json);
    console.log("Saved to LocalStore");
  }

  @action switchAutoSave = () => {
    this.autoSave = !this.autoSave;
    if(this.autoSave) {
      localStorage.setItem(EditorViewStore.AUTO_SAVE, EditorViewStore.AUTO_SAVE);
    } else {
      localStorage.clear();
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

  @action switchPortrait = () => {
    this.portrait = !this.portrait;
  };

  @action applyHistorySettings(key: SettingsPropType, value: Mode & string & IBackgroundColor) {
    this[key] = value;
  }

  // ####### apply history start ######## //

  @action switchMode = () => {
    const undo = { control: this.currentScreen.id, key: "mode", value: this.mode } as unknown as IHistoryObject;

    this.mode = this.mode === Mode.WHITE ? Mode.DARK : Mode.WHITE;
    const redo = { control: this.currentScreen.id, key: "mode", value: this.mode } as unknown as IHistoryObject;
    this.history.add([HIST_SETTINGS, undo, redo]);
  };

  @action setBackground = (background: IBackgroundColor) => {
    const undo = { control: this.currentScreen.id, key: "background", value: {...this.background} } as unknown as IHistoryObject;
    this.background = background;
    const redo = { control: this.currentScreen.id, key: "background", value: {...this.background} } as unknown as IHistoryObject;
    this.history.add([HIST_SETTINGS, undo, redo]);
  };

  @action setStatusBarColor = (statusBarColor: string) => {
    const undo = { control: this.currentScreen.id, key: "statusBarColor", value: this.statusBarColor } as unknown as IHistoryObject;
    this.statusBarColor = statusBarColor;
    const redo = { control: this.currentScreen.id, key: "statusBarColor", value: this.statusBarColor } as unknown as IHistoryObject;
    this.history.add([HIST_SETTINGS, undo, redo]);
  };

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

    if (!Control.has(source.id)) {
      source = CreateControl(source.type);
    }
    const sParent = source.parentId ? Control.getById(source.parentId) : undefined;
    const pParent = parent.parentId ? Control.getById(parent.parentId) : undefined;

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
          this.debug && console.log("2.1.1 DropEnum.Inside", parent.title, source.title);
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
          this.debug && console.log("2.1.2 DropEnum.Above", parent.title, source.title);
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
          this.debug && console.log("2.1.3 DropEnum.Below", parent.title, source.title);
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
          this.debug && console.log("2.2.1 DropEnum.Inside", parent.title, source.title);
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
          this.debug && console.log("2.2.2 DropEnum.Above", parent.title, source.title);

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
          this.debug && console.log("2.2.3 DropEnum.Below", parent.title, source.title);

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
        this.debug && console.log("4.1 DropEnum.Inside", parent.title, source.title);
        if (parent.allowChildren) {
          this.history.add([HIST_DROP, { control: source.id, parent: parent.id },
            { control: source.toJSON, parent: parent.id, index: parent.children.length }]);
          parent.addChild(source);
        }

      } else if (dropAction === DropEnum.Above) { // 4.2.
        this.debug && console.log("4.2 DropEnum.Above", parent.title, source.title);

        const newSourceIndex = pParent.children.indexOf(parent);

        this.history.add([HIST_DROP, { control: source.id, parent: pParent.id },
          { control: source.toJSON, parent: pParent.id, index: newSourceIndex }]);
        pParent.spliceChild(newSourceIndex, source);

      } else { // 4.3.
        this.debug && console.log("4.3 DropEnum.Below", parent.title, source.title)
        //dropAction === DropEnum.Below

        const newSourceIndex = pParent.children.indexOf(parent);

        this.history.add([HIST_DROP, { control: source.id, parent: pParent.id },
          { control: source.toJSON, parent: pParent.id, index: newSourceIndex + 1 }]);

        pParent.spliceChild(newSourceIndex + 1, source);
      }
    }

    this.debug && console.log("document state", source.parentId, sParent && sParent.children.length, pParent && pParent.children.length);
  };

  @action handleDropCanvas = (item: DragAndDropItem) => {
    let control = item.control;
    if (!control) return;

    if (!Control.has(control.id)) {
      control = CreateControl(control.type);
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
      const parent = Control.getById(control.parentId);
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

  @action setCurrentScreen = (screen: IControl, noHistory?: boolean) => {
    const undo = {control: this.currentScreen.id};
    this.currentScreen = screen;
    const redo = {control: this.currentScreen.id};
    !noHistory && this.history.add([HIST_CURRENT_SCREEN, undo, redo]);
  };

  @action addScreen = () => {
    const screen = CreateControl(ControlEnum.Grid);
    screen.changeTitle("Screen");
    this.screens.push(screen);
    const undo = {control: screen.id, screen: this.currentScreen.id};
    this.currentScreen = screen;
    this.currentScreen.addChild(CreateControl(ControlEnum.Grid));
    const redo = {control: this.currentScreen.toJSON};
    this.history.add([HIST_ADD_SCREEN, undo, redo]);
    return screen;
  };

  @action removeScreen = (screen: IControl, noHistory?: boolean) => {
    const undo = {control: screen.toJSON, screen: this.currentScreen.id};
    const redo = {control: screen.id};
    this.screens.splice(this.screens.indexOf(screen), 1);
    if (this.currentScreen === screen) {
      this.currentScreen = this.screens[0];
    }
    !noHistory && this.history.add([HIST_DELETE_SCREEN, undo, redo]);
  };

  @action cloneScreen = (screen: IControl) => {
    const clone = screen.clone();
    const undo = {control: clone.id};
    const index = this.screens.indexOf(screen);
    this.screens.splice(index + 1, 0, clone);
    const redo = {control: clone.toJSON, index: index + 1};
    this.history.add([HIST_CLONE_SCREEN, undo, redo]);
  };

  @action cloneControl = (control: IControl) => {
    const clone = control.clone();
    const undo = {control: clone.id};
    const redo = {control: clone.toJSON, parent: control.parentId, index: -1};
    if (control.parentId) {
      const parent = Control.getById(control.parentId);
      const index = parent!.children.indexOf(control);
      parent!.spliceChild(index + 1, clone);
      redo.index = index + 1;
    }
    this.history.add([HIST_CLONE_CONTROL, undo, redo]);
  };

  // ####### apply history end ######## //

  @action setScreen(screen: IControl) {
    this.screens.push(screen);
  }

  @action spliceScreen(screen: IControl, index: number) {
    this.screens.splice(index, 0, screen);
  }

  @action selectControl = (control?: IControl) => {
    this.selectedControl = control;
  };

  @action addItem(control: IControl) {
    this.currentScreen.addChild(control);
  }

  @action handleTabTool = (_: any, index: number) => {
    this.tabToolsIndex = index;
  };

  @action setIOS(value: boolean) {
    this.ios = value;
  }

}

export default EditorViewStore;
