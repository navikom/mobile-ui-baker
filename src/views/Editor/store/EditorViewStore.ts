import { action, computed, IObservableArray, IObservableObject, observable } from "mobx";
import { whiteColor } from "assets/jss/material-dashboard-react";
import EditorDictionary, { data } from "views/Editor/store/EditorDictionary";
import { IObject } from "services/Dictionary/AbstractDictionary";
import IControl from "interfaces/IControl";
import GridStore from "models/Control/GridStore";
import { ControlEnum } from "models/ControlEnum";
import TextStore from "models/Control/TextStore";
import ButtonStore from "models/Control/ButtonStore";
import DrawerStore from "models/Control/DrawerStore";
import { DropEnum } from "models/DropEnum";
import { IScreen } from "interfaces/IScreen";
import ScreenStore from "models/Screen/Screen";

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

export type BackgroundType = IBackgroundColor | IBackgroundImage;

export enum Mode {
  DARK,
  WHITE
}

export const ControlStores = {
  [ControlEnum.Grid]: GridStore,
  [ControlEnum.Text]: TextStore,
  [ControlEnum.Button]: ButtonStore,
  [ControlEnum.Drawer]: DrawerStore,
};

class EditorViewStore {
  static TABS = [EditorDictionary.keys.controls, EditorDictionary.keys.settings];
  static CONTROLS = ControlEnum;
  @observable screens: IObservableArray<IScreen>;
  @observable currentScreen: IScreen;
  @observable dictionary = new EditorDictionary();
  @observable background: BackgroundType = { backgroundColor: whiteColor };
  @observable mode: Mode = Mode.WHITE;
  @observable tabToolsIndex: number = 0;
  @observable ios: boolean = true;

  moveOpened: boolean = true;
  debug: boolean = true;

  isCurrent = (screen: IScreen) => {
    return computed(() => this.currentScreen === screen).get();
  };

  constructor(newData?: typeof data & IObject) {
    newData && this.dictionary.setData(newData);
    this.screens = observable([new ScreenStore()]);
    this.currentScreen = this.screens[0];
  }

  @action createControl(type: ControlEnum) {
    this.currentScreen.addChild(ControlStores[type].create(this.currentScreen));
  }

  @action moveControl = (
    parent: IControl,
    source: IControl,
    dropAction: DropEnum,
  ) => {
    if(!this.moveOpened) {
      return;
    }
    this.moveOpened = false;
    setTimeout(() => {
      if(dropAction === DropEnum.Inside && source.hasChild(parent)) {
        return;
      }
      parent && parent.setTarget(dropAction);
      this.moveOpened = true;
    }, 100)

  };

  // 1. source.parent is null and parent.parent is null
  //  1.1 dropAction === Inside && parent.allowChildren -> drop source inside parent  (1.1 and 4.1)
  //  1.2 dropAction === Above -> drop source above parent\ / sort items inside \
  //  1.3 dropAction === Below -> drop source below parent/ \     the canvas    /
  // 2. source.parent is not null and parent.parent is not null
  //  2.1 source.parent === parent.parent
  //   2.1.1 dropAction === Inside && parent.allowChildren -> source.parent remove source drop source inside parent (2.1.1 and 2.2.1 and 3.1)
  //   2.1.2 dropAction === Above -> drop source above parent\ / sort items inside \
  //   2.1.3 dropAction === Below -> drop source below parent/ \ the same parent   /
  //  2.2 source.parent !== parent.parent
  //   2.2.1 dropAction === Inside && parent.allowChildren -> source.parent remove source drop source inside parent (2.1.1 and 2.2.1 and 3.1)
  //   2.2.2 dropAction === Above -> source.parent remove source drop inside parent.parent above parent\ / sort items inside the same parent \
  //   2.2.3 dropAction === Below -> source.parent remove source drop inside parent.parent below parent/ \  which equal parent.parent        /
  // 3. source.paren is not null parent.parent is null
  //  3.1 dropAction === Inside && parent.allowChildren -> source.parent remove source drop source inside parent (2.1.1 and 2.2.1 and 3.1)
  //  3.2 dropAction === Above -> source.parent remove source drop source above parent\ / sort items inside \
  //  3.3 dropAction === Below -> source.parent remove source drop source below parent/ \   the canvas      /
  // 4. source.parent is null parent.parent is not null
  //  4.1 dropAction === Inside && parent.allowChildren -> drop source inside parent (1.1 and 4.1)
  //  4.2 dropAction === Above -> drop source inside parent.parent above parent \ / sort items inside the same parent \
  //  4.3 dropAction === Below -> drop source inside parent.parent below parent / \  which equal parent.parent        /
  @action handleDropElement = (parent: IControl, source: IControl, dropAction: DropEnum) => {

    const sParent = source.parent;
    const pParent = parent.parent;

    if(!sParent && !pParent) { // 1.

      source.screen && source.screen.removeChild(source);

      if(dropAction === DropEnum.Inside) { // 1.1.
        this.debug && console.log('1.1 DropEnum.Inside', parent.title, source.title);
        if(parent.allowChildren) {
          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 1.2
        this.debug && console.log('1.2 DropEnum.Above', parent.title, source.title);
        if(parent.screen) {
          const sourceIndex = parent.screen.children.indexOf(parent);
          parent.screen.spliceChild(sourceIndex, source);
        }


      } else { // 1.3.
        // dropAction === DropEnum.Below
        this.debug && console.log('1.3 DropEnum.Below', parent.title, source.title);
        if(parent.screen) {
          const sourceIndex = parent.screen.children.indexOf(parent);
          parent.screen.spliceChild(sourceIndex + 1, source);
        }

      }

      parent.screen && source.setScreen(parent.screen);

    } else if (sParent && pParent) { // 2
      if(sParent === pParent) { // 2.1.

        if(dropAction === DropEnum.Inside) { // 2.1.1.
          this.debug && console.log('2.1.1 DropEnum.Inside', parent.title, source.title);
          if(parent.allowChildren) {
            sParent.removeChild(source);
            parent.addChild(source);
            source.setParent(parent);
          }

        } else if(dropAction === DropEnum.Above) { // 2.1.2.
          this.debug && console.log('2.1.2 DropEnum.Above', parent.title, source.title);
          const sourceCurrentIndex = sParent.children.indexOf(source);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.moveChildren(sourceCurrentIndex, sourceNewIndex);

        } else { // 2.1.3.
          // dropAction === DropEnum.Below
          this.debug && console.log('2.1.3 DropEnum.Below', parent.title, source.title);
          const sourceCurrentIndex = sParent.children.indexOf(source);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.moveChildren(sourceCurrentIndex, sourceNewIndex);

        }
      } else { // 2.2.
        // source.parent !== parent.parent

        sParent.removeChild(source);

        if(dropAction === DropEnum.Inside) { // 2.2.1.
          this.debug && console.log('2.2.1 DropEnum.Inside', parent.title, source.title);
          if(parent.allowChildren) {

            parent.addChild(source);
            source.setParent(parent);
          }

        } else if(dropAction === DropEnum.Above) { // 2.2.2.
          this.debug && console.log('2.2.2 DropEnum.Above', parent.title, source.title);
          source.setParent(pParent);
          const newSourceIndex = pParent.children.indexOf(parent);
          pParent.spliceChild(newSourceIndex, source);

        } else { // 2.2.3
          //dropAction === DropEnum.Below
          this.debug && console.log('2.2.3 DropEnum.Below', parent.title, source.title);
          source.setParent(pParent);
          const newSourceIndex = pParent.children.indexOf(parent);
          pParent.spliceChild(newSourceIndex + 1, source);

        }
      }

      parent.screen && source.setScreen(parent.screen);

    } else if (sParent && !pParent) { // 3.

      sParent.removeChild(source);

      if(dropAction === DropEnum.Inside) { // 3.1.
        this.debug && console.log('3.1 DropEnum.Inside', parent.title, source.title);
        if(parent.allowChildren) {

          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 3.2.
        this.debug && console.log('3.2 DropEnum.Above', parent.title, source.title);
        source.setParent();
        if(parent.screen) {
          const sourceIndex = parent.screen.children.indexOf(parent);
          parent.screen.spliceChild(sourceIndex, source);
        }

      } else { // 3.3.
        //dropAction === DropEnum.Below
        this.debug && console.log('3.3 DropEnum.Below', parent.title, source.title)
        source.setParent();
        if(parent.screen) {
          const sourceIndex = parent.screen.children.indexOf(parent);
          parent.screen.spliceChild(sourceIndex + 1, source);
        }
      }

      parent.screen && source.setScreen(parent.screen);

    } else if(!sParent && pParent && !source.hasChild(parent)) { // 4.

      source.screen && source.screen.removeChild(source);

      if(dropAction === DropEnum.Inside) { // 4.1.
        this.debug && console.log('4.1 DropEnum.Inside', parent.title, source.title)
        if(parent.allowChildren) {
          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 4.2.
        this.debug && console.log('4.2 DropEnum.Above', parent.title, source.title)
        source.setParent(pParent);
        const newSourceIndex = pParent.children.indexOf(parent);
        pParent.spliceChild(newSourceIndex, source);

      } else { // 4.3.
        this.debug && console.log('4.3 DropEnum.Below', parent.title, source.title)
        //dropAction === DropEnum.Below
        source.setParent(pParent);
        const newSourceIndex = pParent.children.indexOf(parent);
        pParent.spliceChild(newSourceIndex + 1, source);
      }
      parent.screen && source.setScreen(parent.screen);
    }
    this.debug && console.log('document state', source.screen!.title, sParent && sParent.children.length, pParent && pParent.children.length);
  };

  @action handleDropCanvas = (item: DragAndDropItem) => {
    const control = item.control;
    if (!control) return;
    const parent = control.parent;
    if(parent) {
      parent.removeChild(control);
      control.setParent();
    } else {
      this.currentScreen.removeChild(control);
    }
    this.currentScreen.addChild(control);
    control.setScreen(this.currentScreen);
  };

  @action setCurrentScreen = (screen: IScreen) => {
    this.currentScreen = screen;
  };

  @action addScreen = () => {
    const screen = new ScreenStore();
    this.screens.push(screen);
    this.currentScreen = screen;
    return screen;
  };

  @action removeScreen = (screen: IScreen) => {
    this.screens.splice(this.screens.indexOf(screen), 1);
    if(this.currentScreen === screen) {
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
}

export default EditorViewStore;
