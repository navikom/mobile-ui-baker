import { action, IObservableArray, observable } from "mobx";
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
  @observable document: IObservableArray<IControl> = observable([GridStore.create()]);
  @observable dictionary = new EditorDictionary();
  @observable background: BackgroundType = { backgroundColor: whiteColor };
  @observable mode: Mode = Mode.WHITE;
  @observable tabToolsIndex: number = 0;
  @observable ios: boolean = true;

  moveOpened: boolean = true;
  debug: boolean = false;

  constructor(newData?: typeof data & IObject) {
    newData && this.dictionary.setData(newData);
  }

  @action createControl(type: ControlEnum) {
    this.document.push(ControlStores[type].create());
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

      const index = this.document.indexOf(source);
      index > -1 && this.document.splice(index, 1);

      if(dropAction === DropEnum.Inside) { // 1.1.
        this.debug && console.log('1.1 DropEnum.Inside', parent.name, source.name);
        if(parent.allowChildren) {
          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 1.2
        this.debug && console.log('1.2 DropEnum.Above', parent.name, source.name);
        const sourceIndex = this.document.indexOf(parent);
        this.document.splice(sourceIndex, 0, source);

      } else { // 1.3.
        // dropAction === DropEnum.Below
        this.debug && console.log('1.3 DropEnum.Below', parent.name, source.name)
        const sourceIndex = this.document.indexOf(parent);
        this.document.splice(sourceIndex + 1, 0, source);

      }
    } else if (sParent && pParent) { // 2
      if(sParent === pParent) { // 2.1.

        if(dropAction === DropEnum.Inside) { // 2.1.1.
          this.debug && console.log('2.1.1 DropEnum.Inside', parent.name, source.name)
          if(parent.allowChildren) {
            sParent.removeChild(source);
            parent.addChild(source);
            source.setParent(parent);
          }

        } else if(dropAction === DropEnum.Above) { // 2.1.2.
          this.debug && console.log('2.1.2 DropEnum.Above', parent.name, source.name)
          const sourceCurrentIndex = sParent.children.indexOf(source);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.moveChildren(sourceCurrentIndex, sourceNewIndex);

        } else { // 2.1.3.
          // dropAction === DropEnum.Below
          this.debug && console.log('2.1.3 DropEnum.Below', parent.name, source.name)
          const sourceCurrentIndex = sParent.children.indexOf(source);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.moveChildren(sourceCurrentIndex, sourceNewIndex);

        }
      } else { // 2.2.
        // source.parent !== parent.parent

        sParent.removeChild(source);

        if(dropAction === DropEnum.Inside) { // 2.2.1.
          this.debug && console.log('2.2.1 DropEnum.Inside', parent.name, source.name)
          if(parent.allowChildren) {

            parent.addChild(source);
            source.setParent(parent);
          }

        } else if(dropAction === DropEnum.Above) { // 2.2.2.
          this.debug && console.log('2.2.2 DropEnum.Above', parent.name, source.name)
          source.setParent(pParent);
          const newSourceIndex = pParent.children.indexOf(parent);
          pParent.spliceChild(newSourceIndex, source);

        } else { // 2.2.3
          //dropAction === DropEnum.Below
          this.debug && console.log('2.2.3 DropEnum.Below', parent.name, source.name)
          source.setParent(pParent);
          const newSourceIndex = pParent.children.indexOf(parent);
          pParent.spliceChild(newSourceIndex + 1, source);

        }
      }

    } else if (sParent && !pParent) { // 3.

      sParent.removeChild(source);

      if(dropAction === DropEnum.Inside) { // 3.1.
        this.debug && console.log('3.1 DropEnum.Inside', parent.name, source.name)
        if(parent.allowChildren) {

          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 3.2.
        this.debug && console.log('3.2 DropEnum.Above', parent.name, source.name)
        source.setParent();
        const newSourceIndex = this.document.indexOf(parent);
        this.document.splice(newSourceIndex, 0, source);

      } else { // 3.3.
        //dropAction === DropEnum.Below
        this.debug && console.log('3.3 DropEnum.Below', parent.name, source.name)
        source.setParent();
        const newSourceIndex = this.document.indexOf(parent);
        this.document.splice(newSourceIndex + 1, 0, source);

      }
    } else if(!sParent && pParent) { // 4.

      const sourceCurrentIndex = this.document.indexOf(source);
      sourceCurrentIndex > -1 && this.document.splice(sourceCurrentIndex, 1);

      if(dropAction === DropEnum.Inside) { // 4.1.
        this.debug && console.log('4.1 DropEnum.Inside', parent.name, source.name)
        if(parent.allowChildren) {
          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 4.2.
        this.debug && console.log('4.2 DropEnum.Above', parent.name, source.name)
        source.setParent(pParent);
        const newSourceIndex = pParent.children.indexOf(parent);
        pParent.spliceChild(newSourceIndex, source);

      } else { // 4.3.
        this.debug && console.log('4.3 DropEnum.Below', parent.name, source.name)
        //dropAction === DropEnum.Below
        source.setParent(pParent);
        const newSourceIndex = pParent.children.indexOf(parent);
        pParent.spliceChild(newSourceIndex + 1, source);
      }
    }
    this.debug && console.log('document state', this.document.length, sParent && sParent.children.length, pParent && pParent.children.length);
  };

  @action handleDropCanvas = (item: DragAndDropItem) => {
    const control = item.control;
    if (!control) return;
    const parent = control.parent;
    if(parent) {
      parent.removeChild(control);
      control.setParent();
    } else {
      const index = this.document.indexOf(control);
      index > -1 && this.document.splice(index, 1);
    }
    this.document.push(control);

  };

  @action addItem(control: IControl) {
    this.document.push(control);
  }

  @action handleTabTool = (_: any, index: number) => {
    this.tabToolsIndex = index;
  };

  @action setIOS(value: boolean) {
    this.ios = value;
  }
}

export default EditorViewStore;
