import { v4 as uuidv4 } from 'uuid';
import { action, observable } from 'mobx';
import IControl, { IScreen } from 'interfaces/IControl';
import { ControlEnum } from 'enums/ControlEnum';
import CreateControl from 'models/Control/ControlStores';
import ControlStore from 'models/Control/ControlStore';
import { whiteColor } from 'assets/jss/material-dashboard-react';
import {
  HIST_SCREEN_BACKGROUND,
  HIST_SCREEN_STATUS_BAR_COLOR,
  HIST_SCREEN_STATUS_BAR_EXTENDED,
  HIST_SCREEN_STATUS_BAR_MODE
} from 'views/Editor/store/EditorHistory';
import { Mode } from 'enums/ModeEnum';
import { IHistoryObject } from 'interfaces/IHistory';
import ColorsStore from '../ColorsStore';

class ScreenStore extends ControlStore implements IScreen {
  @observable background: string = whiteColor;
  @observable statusBarColor: string = whiteColor;
  @observable statusBarExtended = false;
  @observable statusBarEnabled = false;
  @observable mode: Mode = Mode.WHITE;

  get toJSON() {
    return {
      type: this.type,
      title: this.title,
      parentId: this.parentId,
      actions: this.actions.toJS(),
      classes: this.classes.toJS(),
      children: this.children.map(child => child.toJSON),
      id: this.id,
      lockedChildren: this.lockedChildren,
      allowChildren: this.allowChildren,
      cssStyles: this.cssStylesJSON,
      meta: this.meta,
      background: this.background,
      statusBarColor: this.statusBarColor,
      statusBarExtended: this.statusBarExtended,
      statusBarEnabled: this.statusBarEnabled,
      mode: this.mode
    }
  }

  constructor(id: string) {
    super(ControlEnum.Screen, id, 'Screen', true);
  }

  // ###### apply history start ######## //

  @action setBackground(background: string, noHistory?: boolean): void {
    ColorsStore.deleteColor(this, true);
    const undo = { control: this.id, background: this.background };
    this.background = background;
    const redo = { control: this.id, background: this.background };
    !noHistory && ControlStore.history.add([HIST_SCREEN_BACKGROUND, undo, redo]);
    ColorsStore.addColor(this, true);
  }

  @action setStatusBarColor(color: string, noHistory?: boolean): void {
    ColorsStore.deleteColor(this, false);
    const undo = { control: this.id, statusBarColor: this.statusBarColor };
    this.statusBarColor = color;
    const redo = { control: this.id, statusBarColor: this.statusBarColor };
    !noHistory && ControlStore.history.add([HIST_SCREEN_STATUS_BAR_COLOR, undo, redo]);
    ColorsStore.addColor(this, false);
  }

  @action setStatusBarExtended(value: boolean, noHistory?: boolean): void {
    const undo = { control: this.id, statusBarExtended: this.statusBarExtended };
    this.statusBarExtended = value;
    const redo = { control: this.id, statusBarExtended: this.statusBarExtended };
    !noHistory && ControlStore.history.add([HIST_SCREEN_STATUS_BAR_EXTENDED, undo, redo]);
  }

  @action setMode(mode: Mode, noHistory?: boolean): void {
    const undo = { control: this.id, value: this.mode } as unknown as IHistoryObject;
    this.mode = mode;
    const redo = { control: this.id, value: this.mode } as unknown as IHistoryObject;
    !noHistory && ControlStore.history.add([HIST_SCREEN_STATUS_BAR_MODE, undo, redo]);
  }

  @action setStatusBarEnabled(value: boolean, noHistory?: boolean) {
    const undo = { control: this.id, value: this.statusBarEnabled } as unknown as IHistoryObject;
    this.statusBarEnabled = value;
    const redo = { control: this.id, value: this.statusBarEnabled } as unknown as IHistoryObject;
    !noHistory && ControlStore.history.add([HIST_SCREEN_STATUS_BAR_EXTENDED, undo, redo]);
    value ? ColorsStore.addColor(this, false) : ColorsStore.deleteColor(this, false);
  }

  // ###### apply history end ######## //

  @action switchMode = () => {
    this.setMode(this.mode === Mode.DARK ? Mode.WHITE : Mode.DARK);
  }

  @action switchExtended() {
    this.setStatusBarExtended(!this.statusBarExtended);
  }

  @action switchStatusBarEnabled() {
    this.setStatusBarEnabled(!this.statusBarEnabled);
  }

  @action clone() {
    const clone = CreateControl(ControlEnum.Screen) as IScreen;
    clone.clonedId = this.id;
    clone.mode = this.mode;
    clone.background = this.background;
    clone.statusBarColor = this.statusBarColor;
    clone.statusBarExtended = this.statusBarExtended;
    clone.statusBarEnabled = this.statusBarEnabled;
    this.children.forEach(child => clone.addChild(child.clone() as IControl));
    super.cloneProps(clone);
    return clone;
  }

  @action setScreenProps(screen: IScreen) {
    screen.mode !== undefined && this.setMode(screen.mode, true);
    screen.background !== undefined && this.setBackground(screen.background, true);
    screen.statusBarColor !== undefined && this.setStatusBarColor(screen.statusBarColor, true);
    screen.statusBarExtended !== undefined && this.setStatusBarExtended(screen.statusBarExtended, true);
    screen.statusBarEnabled !== undefined && this.setStatusBarEnabled(screen.statusBarEnabled, true);
    return this;
  }

  //######### static ##########//

  static create() {
    return new ScreenStore(uuidv4());
  }
}

export default ScreenStore;
