import { action, computed, IObservableArray, observable, runInAction } from "mobx";
import IControl from "interfaces/IControl";
import IHistory, { IHistoryObject, SettingsPropType, ViewStore } from "interfaces/IHistory";
import { ControlEnum } from "models/ControlEnum";
import { IBackgroundColor, Mode } from "views/Editor/store/EditorViewStore";

export const HIST_CHANGE_TITLE = "changeTitle";
export const HIST_DELETE_SELF = "deleteSelf";
export const HIST_ADD_CSS_STYLE = "addCSSStyle";
export const HIST_RENAME_CSS_STYLE = "renameCSSStyle";
export const HIST_REMOVE_CSS_STYLE = "removeCSSStyle";
export const HIST_ADD_ACTION = "addAction";
export const HIST_EDIT_ACTION = "editAction";
export const HIST_REMOVE_ACTION = "removeAction";
export const HIST_HANDLE_DROP_CANVAS = "handleDropCanvas";
export const HIST_DROP_PARENT = "handleDropElementParent"; // {control, parent, oldParent, index}
export const HIST_DROP_INDEX = "handleDropElementIndex"; // {control, parent, index, oldIndex}
export const HIST_DROP = "handleDropElement"; // {control, parent}
export const HIST_CSS_PROP = "handleCSSProperty";
export const HIST_SETTINGS = "handleSettings";
export const HIST_CURRENT_SCREEN = "currentScreen";
export const HIST_ADD_SCREEN = "addScreen";
export const HIST_DELETE_SCREEN = "deleteScreen";
export const HIST_CLONE_SCREEN = "cloneScreen";
export const HIST_CLONE_CONTROL = "cloneControl";
export const HIST_CONTROL_PROP_CHANGE = "controlProperties";

export interface ControlStatic {
  getById(id: string): IControl;
  removeItem: (control: IControl) => void;
  controls: IControl[];
}

let debug = false;

class EditorHistory implements IHistory {
  @observable stack: IObservableArray<[string, IHistoryObject, IHistoryObject]> = observable([]);
  @observable carriage = -1;
  @observable store: ControlStatic;
  @observable viewStore?: ViewStore;
  fabric?: (type: ControlEnum, json?: IControl) => IControl;
  max = 100;

  @computed
  get size() {
    return this.stack.length;
  }

  @computed
  get canUndo() {
    return this.carriage >= 0;
  }

  @computed
  get canRedo() {
    return this.carriage < this.size - 1;
  }

  constructor(control: ControlStatic) {
    this.store = control;
  }

  setFabric(fabric: (type: ControlEnum, json?: IControl) => IControl) {
    if(this.fabric) {
      return;
    }
    this.fabric = fabric;
  }

  setViewStore(viewStore: ViewStore) {
    this.viewStore = viewStore;

  }

  @action
  add(item: [string, IHistoryObject, IHistoryObject]) {
    if(this.carriage < this.size - 1) {
      this.stack.replace(this.stack.slice(0, this.carriage + 1));
    }
    this.stack.push(item);
    if (this.size >= this.max) {
      this.stack.shift();
    }
    this.carriage = this.size - 1;
    debug && console.log("History add", this.carriage, this.canUndo, this.canRedo, item);
    process.env.NODE_ENV !== "test" && this.viewStore && this.viewStore.save();
  }

  @action
  undo() {
    this.applyHistory(false);
    this.carriage--;
    if (this.carriage < -1) {
      this.carriage = -1;
    }
  }

  @action
  redo() {
    const oldCarriage = this.carriage;
    this.carriage++;
    if (this.carriage >= this.size) {
      this.carriage = this.size - 1;
    }

    oldCarriage !== this.carriage && (this.applyHistory(true));
  }

  @action
  applyHistory(roll: boolean) {
    roll ? this.roll() : this.rollOut();
  }

  @action
  rollOut() {
    const current = this.stack[this.carriage];
    const object = current[1];
    const control = (typeof object.control === "string" ?
      this.store.getById(object.control) :
      this.fabric!(object.control.type, object.control as IControl)) as IControl;
    switch (current[0]) {
      case HIST_CHANGE_TITLE:
        // "need to set title" { control: this.id, title: this.title }
        control.changeTitle(object.title as string, true);
        break;
      case HIST_DELETE_SELF:
        // "need to add control" { control: this.toJSON, index: parent!.children.indexOf(this) }
        if (control.parentId) {
          const parent = this.store.getById(control.parentId);
          parent!.spliceChild(object.index as number, control);
        }
        break;
      case HIST_ADD_CSS_STYLE:
        // "need to delete style by key", { control: this.id, key }
        control.removeCSSStyle(object.key as string, true);
        break;
      case HIST_RENAME_CSS_STYLE:
        // "renameCSSStyle", "need to get style by key and set by oldKey", { control: this.id, key, oldKey }
        control.renameCSSStyle(object.oldKey as string, object.key as string, true);
        break;
      case HIST_REMOVE_CSS_STYLE:
        // "need to set style with key", {
        //       control: this.id,
        //       style: this.cssStyles.get(key)!.map(prop => prop.toJSON),
        //       key
        //     }
        control.setCSSStyle(object.key as string, object.style as { [key: string]: any }[]);
        break;
      case HIST_ADD_ACTION:
        // "need to remove action by index", { control: this.id, index: this.actions.length - 1 }
        control.removeAction(object.index as number, true);
        break;
      case HIST_EDIT_ACTION:
        // "need to replace action by index", {
        //       control: this.id,
        //       action: this.actions[index].slice(),
        //       index
        //     }
        const [action, ...props] = object.action as string[];
        control.editAction(object.index as number, action, props.join("/"), true);
        break;
      case HIST_REMOVE_ACTION:
        // "need to replace action by index", {
        //       control: this.id,
        //       action: this.actions[index].slice(),
        //       index
        //     }
        control.setAction(object.index as number, object.action as string[]);
        break;
      case HIST_HANDLE_DROP_CANVAS:
        // "remove control from the screen set parentId if no parentId remove from Control.controls", {
        //       control: control.id,
        //       screen: this.currentScreen.id,
        //       index
        //     }

        let screen = this.store.getById(object.screen as string);
        screen.removeChild(control);
        if (control.parentId && control.parentId !== screen.id) {
          const parent = this.store.getById(control.parentId);
          parent!.spliceChild(object.index as number, control);
        } else {
          this.store.removeItem(control);
        }
        break;
      case HIST_DROP_PARENT:
        // "remove control from the parent and add to the oldParent by the index", {
        //             control: source.id,
        //             parent: pParent.id,
        //             oldParent: source.parentId,
        //             index: removeIndex
        //           }
        let parent = this.store.getById(object.parent as string) as IControl;
        let oldParent = this.store.getById(object.oldParent as string) as IControl;
        parent.removeChild(control);
        oldParent.spliceChild(object.index as number, control);
        break;
      case HIST_DROP_INDEX:
        // "move control inside the parent from the index to the oldIndex", {
        //             control: source.id,
        //             parent: pParent.id,
        //             index: sourceNewIndex,
        //             oldIndex: sourceCurrentIndex
        //           }
        parent = this.store.getById(object.parent as string) as IControl;
        parent.moveChildren(object.index as number, object.oldIndex as number);
        break;
      case HIST_DROP:
        // "remove control from the parent and from the Control.controls" { control, parent}
        let parent1 = this.store.getById(object.parent as string) as IControl;
        parent1.removeChild(control);
        this.store.removeItem(control);
        break;
      case HIST_CSS_PROP:
        object.method &&
        control.applyPropertyMethod(object.key as string, object.method[0] as string, object.method[1] as string, object.method[2]);
        break;
      case HIST_SETTINGS:
        this.viewStore!.applyHistorySettings(object.key as SettingsPropType, object.value as Mode & string & IBackgroundColor);
      case HIST_CURRENT_SCREEN:
        this.viewStore!.setCurrentScreen(control, true);
        break;
      case HIST_ADD_SCREEN:
        this.viewStore!.removeScreen(control, true);
        let screen1 = this.store.getById(object.screen as string);
        this.viewStore!.setCurrentScreen(screen1, true);
        break;
      case HIST_DELETE_SCREEN:
        this.viewStore!.setScreen(control);
        object.screen === control.id && this.viewStore!.setCurrentScreen(control, true);
        break;
      case HIST_CLONE_SCREEN:
        this.viewStore!.removeScreen(control, true);
        break;
      case HIST_CLONE_CONTROL:
        if (control.parentId) {
          const parent = this.store.getById(control.parentId);
          parent!.removeChild(control);
        }
        this.store.removeItem(control);
        break;
      case HIST_CONTROL_PROP_CHANGE:
        control.applyChanges(object.model as IControl);
        break;
    }
    this.viewStore!.save();
  }

  @action
  roll() {
    const current = this.stack[this.carriage];
    const object = current[2];
    const control = (typeof object.control === "string" ?
      this.store.getById(object.control) :
      this.fabric!(object.control.type, object.control as IControl)) as IControl;
    switch (current[0]) {
      case HIST_CHANGE_TITLE:
        // "need to set title" { control: this.id, title }
        control.changeTitle(object.title as string, true);
        break;
      case HIST_DELETE_SELF:
        // delete control { control: this.id }
        control.deleteSelf(true);
        break;
      case HIST_ADD_CSS_STYLE:
        // add cssStyle { control: this.id }
        control.addCSSStyle(true);
        break;
      case HIST_RENAME_CSS_STYLE:
        // rename cssStyle from oldKey to key { control: this.id, key, oldKey }
        control.renameCSSStyle(object.oldKey as string, object.key as string, true);
        break;
      case HIST_REMOVE_CSS_STYLE:
        // remove cssStyle by key { control: this.id, key }
        control.removeCSSStyle(object.key as string, true);
        break;
      case HIST_ADD_ACTION:
        // add action  { control: this.id, action: action.slice() }
        control.addAction(object.action as string[], true);
        break;
      case HIST_EDIT_ACTION:
        // edit action by index { control: this.id, action: action.slice(), index }
        const [action, ...props] = object.action as string[];
        control.editAction(object.index as number, action, props.join("/"), true);
        break;
      case HIST_REMOVE_ACTION:
        // remove action by index { control: this.id, index }
        control.removeAction(object.index as number, true);
        break;
      case HIST_HANDLE_DROP_CANVAS:
        // create control if not exists, remove from parent or screen add into the screen
        // { control: control.toJSON, screen: this.currentScreen.id }
        const screen = this.store.getById(object.screen as string) as IControl;
        if (control.parentId) {
          const parent = this.store.getById(control.parentId as string) as IControl;
          parent.removeChild(control)
        } else {
          screen.removeChild(control);
        }
        screen.addChild(control);
        break;
      case HIST_DROP_PARENT:
        // remove control from oldParent and splice to the parent by index { control: source.id, parent: parent.id, oldParent: sParent.id, index }
        let oldParent = this.store.getById(object.oldParent as string) as IControl;
        let parent = this.store.getById(object.parent as string) as IControl;
        oldParent.removeChild(control);
        parent.spliceChild(object.index as number, control);
        break;
      case HIST_DROP_INDEX:
        // move control inside parent from oldIndex to index
        // { control: source.id, parent: pParent.id, index: sourceNewIndex, oldIndex: sourceCurrentIndex  }
        parent = this.store.getById(object.parent as string) as IControl;
        parent.moveChildren(object.oldIndex as number, object.index as number);
        break;
      case HIST_DROP:
        // splice control into the parent by index {control: source.id, parent: pParent.id, index: newSourceIndex + 1}
        let parent1 = this.store.getById(object.parent as string) as IControl;
        parent1.spliceChild(object.index as number, control);
        break;
      case HIST_CSS_PROP:
        object.method &&
        control.applyPropertyMethod(object.key as string, object.method[0] as string, object.method[1] as string, object.method[2]);
        break;
      case HIST_SETTINGS:
        this.viewStore!.applyHistorySettings(object.key as SettingsPropType, object.value as Mode & string & IBackgroundColor);
        break;
      case HIST_CURRENT_SCREEN:
        this.viewStore!.setCurrentScreen(control, true);
        break;
      case HIST_ADD_SCREEN:
        this.viewStore!.setScreen(control);
        this.viewStore!.setCurrentScreen(control, true);
        break;
      case HIST_DELETE_SCREEN:
        this.viewStore!.removeScreen(control, true);
        break;
      case HIST_CLONE_SCREEN:
        this.viewStore!.spliceScreen(control, object.index as number);
        break;
      case HIST_CLONE_CONTROL:
        if(object.parent) {
          const parent = this.store.getById(object.parent as string);
          parent.spliceChild(object.index as number, control);
        }
        break;
      case HIST_CONTROL_PROP_CHANGE:
        control.applyChanges(object.model as IControl);
        break;
    }
    this.viewStore!.save();
  }

  clear() {
    this.stack.replace([]);
    this.carriage = 0;
  }
}

export default EditorHistory;
