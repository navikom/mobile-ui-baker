import { action, computed, IObservableArray, observable } from "mobx";
import { whiteColor } from "assets/jss/material-dashboard-react";
import EditorDictionary, { data } from "views/Editor/store/EditorDictionary";
import { IObject } from "services/Dictionary/AbstractDictionary";
import IControl from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";
import Control from "models/Control/Control";
import CreateControl from "models/Control/ControlStores";

export interface IBackgroundColor {
  backgroundColor: string;
}

export interface DragAndDropItem {
  typeControl?: ControlEnum;
  type: string;
  control: IControl;
  index?: number;
}

export interface IBackgroundImage {
  backgroundRepeat: string;
  backgroundSize: string | number;
  backgroundImage: string;
}

export type BackgroundType = IBackgroundColor & IBackgroundImage;

export enum Mode {
  DARK,
  WHITE
}

class EditorViewStore {
  static TABS = [EditorDictionary.keys.controls, EditorDictionary.keys.settings];
  static CONTROLS = ControlEnum;
  @observable screens: IObservableArray<IControl>;
  @observable currentScreen: IControl;
  @observable selectedControl?: IControl;
  @observable dictionary = new EditorDictionary();
  @observable background: IBackgroundColor = { backgroundColor: whiteColor };
  @observable mode: Mode = Mode.WHITE;
  @observable tabToolsIndex: number = 0;
  @observable ios: boolean = false;

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
        selectControl: this.selectControl
      },
      {
        mode: this.mode,
        background: this.background,
        switchMode: this.switchMode,
        setBackground: this.setBackground,
        dictionary: this.dictionary
      }
    ];
    return props[this.tabToolsIndex];
  }

  constructor(newData?: typeof data & IObject) {
    newData && this.dictionary.setData(newData);
    this.screens = observable([CreateControl(ControlEnum.Grid)]);
    this.currentScreen = this.screens[0];
    this.currentScreen.addChild(CreateControl(ControlEnum.Grid));
    // this.selectControl(this.currentScreen.children[0]);
  }

  @action switchMode = () => {
    this.mode = this.mode === Mode.WHITE ? Mode.DARK : Mode.WHITE;
  };

  @action setBackground = (background: IBackgroundColor) => {
    this.background = background;
  };

  @action createControl(type: ControlEnum) {
    this.currentScreen.addChild(CreateControl(type));
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
            sParent.removeChild(source);
            parent.addChild(source);
          }

        } else if (dropAction === DropEnum.Above) { // 2.1.2.
          this.debug && console.log("2.1.2 DropEnum.Above", parent.title, source.title);
          const sourceCurrentIndex = sParent.children.indexOf(source);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.moveChildren(sourceCurrentIndex, sourceNewIndex);

        } else { // 2.1.3.
          // dropAction === DropEnum.Below
          this.debug && console.log("2.1.3 DropEnum.Below", parent.title, source.title);
          const sourceCurrentIndex = sParent.children.indexOf(source);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.moveChildren(sourceCurrentIndex, sourceNewIndex);

        }
      } else { // 2.2.
        // source.parent !== parent.parent

        sParent.removeChild(source);

        if (dropAction === DropEnum.Inside) { // 2.2.1.
          this.debug && console.log("2.2.1 DropEnum.Inside", parent.title, source.title);
          if (parent.allowChildren) {

            parent.addChild(source);
          }

        } else if (dropAction === DropEnum.Above) { // 2.2.2.
          this.debug && console.log("2.2.2 DropEnum.Above", parent.title, source.title);
          const newSourceIndex = pParent.children.indexOf(parent);
          pParent.spliceChild(newSourceIndex, source);

        } else { // 2.2.3
          //dropAction === DropEnum.Below
          this.debug && console.log("2.2.3 DropEnum.Below", parent.title, source.title);
          const newSourceIndex = pParent.children.indexOf(parent);
          pParent.spliceChild(newSourceIndex + 1, source);

        }
      }

    } else if (!sParent && pParent) { // 4.

      if (dropAction === DropEnum.Inside) { // 4.1.
        this.debug && console.log("4.1 DropEnum.Inside", parent.title, source.title)
        if (parent.allowChildren) {
          parent.addChild(source);
        }

      } else if (dropAction === DropEnum.Above) { // 4.2.
        this.debug && console.log("4.2 DropEnum.Above", parent.title, source.title)
        const newSourceIndex = pParent.children.indexOf(parent);
        pParent.spliceChild(newSourceIndex, source);

      } else { // 4.3.
        this.debug && console.log("4.3 DropEnum.Below", parent.title, source.title)
        //dropAction === DropEnum.Below
        const newSourceIndex = pParent.children.indexOf(parent);
        pParent.spliceChild(newSourceIndex + 1, source);
      }
    }
    this.debug && console.log("document state", source.parentId, sParent && sParent.children.length, pParent && pParent.children.length);
  };

  @action handleDropCanvas = (item: DragAndDropItem) => {
    const control = item.control;
    if (!control) return;

    if (control.parentId) {
      const parent = Control.getById(control.parentId);
      parent && parent.removeChild(control);
    } else {
      this.currentScreen.removeChild(control);
    }
    this.currentScreen.addChild(control);
  };

  @action setCurrentScreen = (screen: IControl) => {
    this.currentScreen = screen;
  };

  @action selectControl = (control?: IControl) => {
    this.selectedControl = control;
  };

  @action addScreen = () => {
    const screen = CreateControl(ControlEnum.Grid);
    this.screens.push(screen);
    this.currentScreen = screen;
    this.currentScreen.addChild(CreateControl(ControlEnum.Grid));
    return screen;
  };

  @action removeScreen = (screen: IControl) => {
    this.screens.splice(this.screens.indexOf(screen), 1);
    if (this.currentScreen === screen) {
      this.currentScreen = this.screens[0];
    }
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

  @action cloneScreen = (screen: IControl) => {
    const clone = screen.clone();
    const index = this.screens.indexOf(screen);
    this.screens.splice(index + 1, 0, clone);
  };

  @action cloneControl = (control: IControl) => {
    const clone = control.clone();
    if (control.parentId) {
      const parent = Control.getById(control.parentId);
      const index = parent!.children.indexOf(control);
      parent!.spliceChild(index + 1, clone);
    }
  };
}

export default EditorViewStore;
