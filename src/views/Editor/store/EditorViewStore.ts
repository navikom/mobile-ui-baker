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

  currentDropAction?: DropEnum;
  currentDropParent?: IControl;

  constructor(newData?: typeof data & IObject) {
    newData && this.dictionary.setData(newData);
  }

  @action createControl(type: ControlEnum) {
    this.document.push(ControlStores[type].create());
  }

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
  @action moveControl = (
    parent: IControl,
    source: IControl,
    dropAction: DropEnum,
    newItem: boolean,
    dropIndex: number,
    hoverIndex: number
  ) => {
    parent && parent.setTarget(dropAction);
    if (newItem) {
      this.currentDropParent = parent;
      this.currentDropAction = dropAction;
      return false;
    }

    const sParent = source.parent;
    const pParent = parent.parent;

    if(!sParent && !pParent) { // 1.
      if(dropAction === DropEnum.Inside) { // 1.1.

        if(parent.allowChildren) {
          this.document.splice(this.document.indexOf(source), 1);
          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 1.2

        const sourceCurrentIndex = this.document.indexOf(source);
        this.document.splice(sourceCurrentIndex, 1);
        const sourceNewIndex = this.document.indexOf(parent);
        this.document.splice(sourceNewIndex, 0, source);

      } else { // 1.3.
        // dropAction === DropEnum.Below

        const sourceCurrentIndex = this.document.indexOf(source);
        this.document.splice(sourceCurrentIndex, 1);
        const sourceNewIndex = this.document.indexOf(parent);
        this.document.splice(sourceNewIndex + 1, 0, source);

      }
    } else if (sParent && pParent) { // 2
      if(sParent === pParent) { // 2.1.
        if(dropAction === DropEnum.Inside) { // 2.1.1.

          if(parent.allowChildren) {
            sParent.removeChild(source);
            parent.addChild(source);
            source.setParent(parent);
          }

        } else if(dropAction === DropEnum.Above) { // 2.1.2.

          const sourceCurrentIndex = sParent.children.indexOf(source);
          sParent.children.splice(sourceCurrentIndex, 1);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.children.splice(sourceNewIndex, 0, source);

        } else { // 2.1.3.
          // dropAction === DropEnum.Below

          const sourceCurrentIndex = sParent.children.indexOf(source);
          sParent.children.splice(sourceCurrentIndex, 1);
          const sourceNewIndex = pParent.children.indexOf(parent);
          pParent.children.splice(sourceNewIndex + 1, 0, source);

        }
      } else { // 2.2.
        // source.parent !== parent.parent
        if(dropAction === DropEnum.Inside) { // 2.2.1.
          if(parent.allowChildren) {
            sParent.removeChild(source);
            parent.addChild(source);
            source.setParent(parent);
          }

        } else if(dropAction === DropEnum.Above) { // 2.2.2.

          sParent.removeChild(source);
          source.setParent(pParent);
          const newSourceIndex = pParent.children.indexOf(parent);
          pParent.spliceChild(newSourceIndex, source);

        } else { // 2.2.3
          //dropAction === DropEnum.Below

          sParent.removeChild(source);
          source.setParent(pParent);
          const newSourceIndex = pParent.children.indexOf(parent);
          pParent.spliceChild(newSourceIndex + 1, source);

        }
      }

    } else if (sParent && !pParent) { // 3.
      if(dropAction === DropEnum.Inside) { // 3.1.
        if(parent.allowChildren) {
          sParent.removeChild(source);
          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 3.2.

        sParent.removeChild(source);
        const newSourceIndex = this.document.indexOf(parent);
        this.document.splice(newSourceIndex, 0, source);
        console.log(111111111, newSourceIndex, this.document.length);

      } else { // 3.3.
        //dropAction === DropEnum.Below

        sParent.removeChild(source);
        const newSourceIndex = this.document.indexOf(parent);
        this.document.splice(newSourceIndex + 1, 0, source);

      }
    } else if(!sParent && pParent) { // 4.
      if(dropAction === DropEnum.Inside) { // 4.1.

        if(parent.allowChildren) {
          parent.addChild(source);
          source.setParent(parent);
        }

      } else if(dropAction === DropEnum.Above) { // 4.2.

        source.setParent(pParent);
        const newSourceIndex = pParent.children.indexOf(parent);
        pParent.spliceChild(newSourceIndex, source);

      } else { // 4.3.
        //dropAction === DropEnum.Below
        source.setParent(pParent);
        const newSourceIndex = pParent.children.indexOf(parent);
        pParent.spliceChild(newSourceIndex, source);
      }
    }
  };

  @action moveControl1 = (
    parent: IControl,
    source: IControl,
    dropAction: DropEnum,
    newItem: boolean,
    dropIndex: number,
    hoverIndex: number) => {
    parent && parent.setTarget(dropAction);
    console.log(111111, dropAction, dropIndex, hoverIndex, parent, source,
      source.parent !== undefined, parent.parent !== undefined);
    if (newItem) {
      this.currentDropParent = parent;
      this.currentDropAction = dropAction;
      return false;
    }
    if (source.parent || parent.parent) {
      if (source.parent === parent.parent) {
        if (dropAction === DropEnum.Inside) {
          source.parent!.removeChild(source);
          source.setParent(parent);
          parent.addChild(source);
        } else {
          source.parent!.moveChildren(dropIndex, hoverIndex);
        }
        return false;
      }
    }
    if (this.handleChangeParent(dropAction, source, parent, dropIndex)) {
      return false;
    }
    console.log(32323233232, dropIndex, this.document.length, source.name, parent.name);
    const droppedItem = this.document[dropIndex];
    this.document.splice(dropIndex, 1);
    this.document.splice(hoverIndex, 0, droppedItem);

    return true;
  };

  @action handleChangeParent(dropAction: DropEnum, source: IControl, parent: IControl, dropIndex: number) {
    if (dropAction === DropEnum.Inside && parent.allowChildren) {
      if (!source.parent) {
        const droppedItem = this.document[dropIndex];
        this.document.splice(dropIndex, 1);
        parent.addChild(droppedItem);
        droppedItem.setParent(parent);
      } else if (source.parent !== parent) {
        source.parent!.removeChild(source);
        parent.addChild(source);
        source.setParent(parent);
      } else {
        console.log("Did not handle 111", dropAction, source.name, parent.name, source.parent === parent)
      }
      return true;
    }
    if (dropAction !== DropEnum.Inside && source.parent) {
      console.log("Did not handle 222", dropAction, source.name, parent.name, source.parent === parent);
      return true;
    }
    return false;
  }

  @action handleDrop = (item: DragAndDropItem) => {
    const control = item.control;
    if (!control) return;
    if (item.typeControl === undefined) {
      console.log(32323223, item);
    } else {
      this.dropNewItem(control);
    }
  };

  @action dropNewItem(control: IControl) {
    console.log("Dropped %s", control.id, control.type, this.currentDropAction, this.currentDropParent);
    const index = this.currentDropParent ? this.document.indexOf(this.currentDropParent) : -1;
    if (this.currentDropAction === DropEnum.Above) {
      this.document.splice(index, 0, control);
      this.clearCurrent();
      return;
    } else if (this.currentDropAction === DropEnum.Below) {
      this.document.splice(index + 1, 0, control);
      this.clearCurrent();
      return;
    } else {
      if (this.currentDropParent) {
        this.currentDropParent.addChild(control);
        control.setParent(this.currentDropParent);
        this.clearCurrent();
        return;
      }
    }
    this.document.push(control);
  }

  hoverCanvas = (item: DragAndDropItem) => {
    this.clearCurrent();
    if (item.typeControl !== undefined) {
      return;
    }
    const control = item.control;
    if (control.parent) {
      console.log("Control %s remove parent %s", control.name, control.parent.name);
      control.parent.removeChild(control);
      control.setParent();
      this.document.push(control);
    }
  };

  clearCurrent() {
    this.currentDropParent = undefined;
    this.currentDropAction = undefined;
  }

  @action handleTabTool = (_: any, index: number) => {
    this.tabToolsIndex = index;
  };

  @action setIOS(value: boolean) {
    this.ios = value;
  }
}

export default EditorViewStore;
