import { action, computed, IObservableArray, observable } from "mobx";
import IControl from "interfaces/IControl";
import IHistory, { IHistoryObject, SettingsPropType, ViewStore } from "interfaces/IHistory";
import { ControlEnum } from "enums/ControlEnum";
import { Mode } from "enums/ModeEnum";
import IProject, { IBackgroundColor } from "interfaces/IProject";
import isTests from "utils/isTests";
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';

export const HIST_CHANGE_TITLE = "changeTitle";
export const HIST_CHANGE_META = "changeMeta";
export const HIST_DELETE_SELF = "deleteSelf";
export const HIST_ADD_CSS_STYLE = "addCSSStyle";
export const HIST_RENAME_CSS_STYLE = "renameCSSStyle";
export const HIST_REMOVE_CSS_STYLE = "removeCSSStyle";
export const HIST_ADD_ACTION = "addAction";
export const HIST_EDIT_ACTION = "editAction";
export const HIST_REMOVE_ACTION = "removeAction";
export const HIST_HANDLE_DROP_CANVAS = "handleDropCanvas";
export const HIST_DROP_PARENT = "handleDropElementParent";
export const HIST_DROP_INDEX = "handleDropElementIndex";
export const HIST_DROP = "handleDropElement";
export const HIST_CSS_PROP = "handleCSSProperty";
export const HIST_SETTINGS = "handleSettings";
export const HIST_CURRENT_SCREEN = "currentScreen";
export const HIST_ADD_SCREEN = "addScreen";
export const HIST_DELETE_SCREEN = "deleteScreen";
export const HIST_CLONE_SCREEN = "cloneScreen";
export const HIST_CLONE_CONTROL = "cloneControl";
export const HIST_CONTROL_PROP_CHANGE = "controlProperties";
export const HIST_PROJECT_TITLE_CHANGE = "projectTitle";

export interface ControlStatic {
  getById(id: string): IControl;
  removeItem: (control: IControl) => void;
  controls: IControl[];
}

const debug = false;

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
    !isTests() && this.viewStore && this.viewStore.save();
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
        control.changeTitle(object.title as string, true);
        break;
      case HIST_CHANGE_META:
        this.viewStore!.setMeta(object.meta as ScreenMetaEnum, control, true);
        break;
      case HIST_DELETE_SELF:
        if (control.parentId) {
          const parent = this.store.getById(control.parentId);
          parent!.spliceChild(object.index as number, control);
        }
        break;
      case HIST_ADD_CSS_STYLE:
        control.removeCSSStyle(object.key as string, true);
        break;
      case HIST_RENAME_CSS_STYLE:
        control.renameCSSStyle(object.oldKey as string, object.key as string, true);
        break;
      case HIST_REMOVE_CSS_STYLE:
        control.setCSSStyle(object.key as string, object.style as { [key: string]: any }[]);
        break;
      case HIST_ADD_ACTION:
        control.removeAction(object.index as number, true);
        break;
      case HIST_EDIT_ACTION: {
        const [action, ...props] = object.action as string[];
        control.editAction(object.index as number, action, props.join("/"), true);
        break;
      }
      case HIST_REMOVE_ACTION:

        control.setAction(object.index as number, object.action as string[]);
        break;
      case HIST_HANDLE_DROP_CANVAS: {
        const screen = this.store.getById(object.screen as string);
        screen.removeChild(control);
        if (control.parentId && control.parentId !== screen.id) {
          const parent = this.store.getById(control.parentId);
          parent!.spliceChild(object.index as number, control);
        } else {
          this.store.removeItem(control);
        }
        break;
      }
      case HIST_DROP_PARENT: {
        const parent = this.store.getById(object.parent as string) as IControl;
        const oldParent = this.store.getById(object.oldParent as string) as IControl;
        parent.removeChild(control);
        oldParent.spliceChild(object.index as number, control);
        break;
      }
      case HIST_DROP_INDEX: {
        const parent = this.store.getById(object.parent as string) as IControl;
        parent.moveChildren(object.index as number, object.oldIndex as number);
        break;
      }
      case HIST_DROP: {
        // "remove control from the parent and from the Control.controls" { control, parent}
        const parent1 = this.store.getById(object.parent as string) as IControl;
        parent1.removeChild(control);
        this.store.removeItem(control);
        break;
      }
      case HIST_CSS_PROP:
        object.method &&
        control.applyPropertyMethod(object.key as string, object.method[0] as string, object.method[1] as string, object.method[2]);
        break;
      case HIST_SETTINGS:
        this.viewStore!.applyHistorySettings(object.key as SettingsPropType, object.value as Mode & string & IBackgroundColor);
        break;
      case HIST_CURRENT_SCREEN:
        this.viewStore!.setCurrentScreen(control, undefined, true);
        break;
      case HIST_ADD_SCREEN: {
        this.viewStore!.removeScreen(control, true);
        const screen = this.store.getById(object.screen as string);
        this.viewStore!.setCurrentScreen(screen, undefined, true);
        break;
      }
      case HIST_DELETE_SCREEN:
        this.viewStore!.setScreen(control);
        object.screen === control.id && this.viewStore!.setCurrentScreen(control, undefined, true);
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
      case HIST_PROJECT_TITLE_CHANGE:
        this.viewStore!.project.update({ title: object.value } as unknown as IProject);
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
      case HIST_CHANGE_META:
        // "need to set meta" { control: this.id, meta }
        this.viewStore!.setMeta(object.meta as ScreenMetaEnum, control, true);
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
      case HIST_EDIT_ACTION: {
        // edit action by index { control: this.id, action: action.slice(), index }
        const [action, ...props] = object.action as string[];
        control.editAction(object.index as number, action, props.join("/"), true);
        break;
      }
      case HIST_REMOVE_ACTION:
        // remove action by index { control: this.id, index }
        control.removeAction(object.index as number, true);
        break;
      case HIST_HANDLE_DROP_CANVAS: {
        // create control if not exists, remove from parent or screen add into the screen
        // { control: control.toJSONString, screen: this.currentScreen.id }
        const screen = this.store.getById(object.screen as string) as IControl;
        if (control.parentId) {
          const parent = this.store.getById(control.parentId as string) as IControl;
          parent.removeChild(control)
        } else {
          screen.removeChild(control);
        }
        screen.addChild(control);
        break;
      }
      case HIST_DROP_PARENT: {
        // remove control from oldParent and splice to the parent by index { control: source.id, parent: parent.id, oldParent: sParent.id, index }
        const oldParent = this.store.getById(object.oldParent as string) as IControl;
        const parent = this.store.getById(object.parent as string) as IControl;
        oldParent.removeChild(control);
        parent.spliceChild(object.index as number, control);
        break;
      }
      case HIST_DROP_INDEX: {
        // move control inside parent from oldIndex to index
        // { control: source.id, parent: pParent.id, index: sourceNewIndex, oldIndex: sourceCurrentIndex  }
        const parent = this.store.getById(object.parent as string) as IControl;
        parent.moveChildren(object.oldIndex as number, object.index as number);
        break;
      }
      case HIST_DROP: {
        // splice control into the parent by index {control: source.id, parent: pParent.id, index: newSourceIndex + 1}
        const parent = this.store.getById(object.parent as string) as IControl;
        parent.spliceChild(object.index as number, control);
        break;
      }
      case HIST_CSS_PROP:
        object.method &&
        control.applyPropertyMethod(object.key as string, object.method[0] as string, object.method[1] as string, object.method[2]);
        break;
      case HIST_SETTINGS:
        this.viewStore!.applyHistorySettings(object.key as SettingsPropType, object.value as Mode & string & IBackgroundColor);
        break;
      case HIST_CURRENT_SCREEN:
        this.viewStore!.setCurrentScreen(control, undefined, true);
        break;
      case HIST_ADD_SCREEN:
        this.viewStore!.setScreen(control);
        this.viewStore!.setCurrentScreen(control, undefined, true);
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
      case HIST_PROJECT_TITLE_CHANGE:
        this.viewStore!.project.update({ title: object.value } as unknown as IProject);
        break;
    }
    this.viewStore!.save();
  }

  clear() {
    this.stack.replace([]);
    this.carriage = -1;
  }
}

export default EditorHistory;
