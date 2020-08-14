import '@testing-library/jest-dom';
import EditorViewStore from 'views/Editor/store/EditorViewStore';
import GridStore from 'models/Control/GridStore';
import IControl from 'interfaces/IControl';
import { ACTION_TOGGLE_STYLE } from 'models/Constants';
import { DropEnum } from 'enums/DropEnum';
import { Mode } from 'enums/ModeEnum';
import ControlStore, { MAIN_CSS_STYLE } from 'models/Control/ControlStore';
import CreateControl from 'models/Control/ControlStores';
import { ControlEnum } from 'enums/ControlEnum';
import CSSProperty from '../../../models/Control/CSSProperty';
import { DeviceEnum } from '../../../enums/DeviceEnum';

describe('EditorHistory', () => {
  let store: EditorViewStore, control: IControl;
  beforeEach(() => {
    jest.clearAllTimers();
    ControlStore.clear();
    store = new EditorViewStore('');
    store.history.clear();
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    control = store.currentScreen!.children[store.currentScreen!.children.length - 1];
  });

  it('changeTitle history record', () => {
    const title = 'Hello World';
    jest.useFakeTimers();
    control.changeTitle(title);
    jest.runAllTimers();
    expect(control.title).toBe(title);
    expect(store.history.size).toBe(2);
    expect(store.history.carriage).toBe(1);

    store.history.undo();
    expect(control.title).toBe('Grid');
    expect(store.history.carriage).toBe(0);

    store.history.redo();
    expect(control.title).toBe(title);
    expect(store.history.carriage).toBe(1);
  });

  it('deleteSelf with child which added a new style history records', () => {
    const grid = CreateControl(ControlEnum.Grid);
    control.addChild(grid);
    grid.addCSSStyle();

    grid.switchEnabled('Style1', 'backgroundColor')();
    grid.setValue('Style1', 'backgroundColor')('red');
    expect(ControlStore.classes.includes(`${grid.id}/Style1`)).toBeTruthy();
    expect(CSSProperty.colors.has('red')).toBeTruthy();

    control.deleteSelf();

    expect(CSSProperty.colors.has('red')).toBeFalsy();
    expect(ControlStore.classes.includes(`${grid.id}/Style1`)).toBeFalsy();

    expect(store.history.size).toBe(5);
    expect(store.history.carriage).toBe(4);
    expect(store.currentScreen!.children.find(e => e.id === control.id)).toBeFalsy();
    store.history.undo();
    expect(store.currentScreen!.children.find(e => e.id === control.id)).toBeTruthy();
    expect(ControlStore.classes.includes(`${grid.id}/Style1`)).toBeTruthy();
    expect(CSSProperty.colors.has('red')).toBeTruthy();

    store.history.redo();
    expect(store.currentScreen!.children.find(e => e.id === control.id)).toBeFalsy();
    expect(ControlStore.classes.includes(`${grid.id}/Style1`)).toBeFalsy();
    expect(CSSProperty.colors.has('red')).toBeFalsy();
  });

  it('handleCSSProperty history records', () => {
    expect(
      Object.prototype.hasOwnProperty.call(control.styles(DeviceEnum.IPHONE_6, true), 'position')
    ).toBeFalsy();

    control.switchEnabled(MAIN_CSS_STYLE, 'position')();
    expect(
      Object.prototype.hasOwnProperty.call(control.styles(DeviceEnum.IPHONE_6, true), 'position')
    ).toBeTruthy();
    expect(control.styles(DeviceEnum.IPHONE_6, true).position === 'static').toBeTruthy();

    control.setValue(MAIN_CSS_STYLE, 'position')('absolute');
    expect(control.styles(DeviceEnum.IPHONE_6, true).position === 'absolute').toBeTruthy();

    control.switchExpanded(MAIN_CSS_STYLE, 'padding')();
    const padding = control.cssProperty(MAIN_CSS_STYLE, 'padding');
    expect(padding!.expanded).toBeTruthy();

    store.history.undo();
    expect(padding!.expanded).toBeFalsy();

    store.history.undo();
    expect(control.styles(DeviceEnum.IPHONE_6, true).position === 'static').toBeTruthy();

    store.history.undo();
    expect(
      Object.prototype.hasOwnProperty.call(control.styles(DeviceEnum.IPHONE_6, true), 'position')
    ).toBeFalsy();

    store.history.redo();
    expect(control.styles(DeviceEnum.IPHONE_6, true).position === 'static').toBeTruthy();

    store.history.redo();
    expect(control.styles(DeviceEnum.IPHONE_6, true).position === 'absolute').toBeTruthy();

    store.history.redo();
    expect(padding!.expanded).toBeTruthy();
  });

  it('addCSSStyle/renameCSSStyle/removeCSSStyle history records', () => {
    control.addCSSStyle();
    expect(store.history.size).toBe(2);
    expect(store.history.carriage).toBe(1);

    const oldName = 'Style1';
    const newName = 'New Style';

    expect(control.cssStyles.has(oldName)).toBeTruthy();
    expect(control.cssStyles.get(oldName)!.length).toBe(58);
    const backgroundColor = control.cssProperty(oldName, 'backgroundColor');
    control.switchEnabled(oldName, 'backgroundColor')();
    control.setValue(oldName, 'backgroundColor')('red');

    expect(backgroundColor!.enabled).toBeTruthy();
    expect(CSSProperty.colors.has('red')).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.has(control.id + '_' + oldName)).toBeTruthy();

    control.renameCSSStyle(oldName, newName);

    expect(control.cssStyles.has(newName)).toBeTruthy();
    expect(backgroundColor!.enabled).toBeTruthy();
    expect(control.cssStyles.get(newName)!.length).toBe(58);
    expect(CSSProperty.controlBackgroundColor.has(control.id + '_' + oldName)).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.has(control.id + '_' + newName)).toBeTruthy();

    control.removeCSSStyle(newName);
    expect(control.cssStyles.has(newName)).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.has(control.id + '_' + newName)).toBeFalsy();
    expect(CSSProperty.colors.has('red')).toBeFalsy();

    // set style
    store.history.undo();
    expect(control.cssStyles.has(newName)).toBeTruthy();
    expect(backgroundColor!.enabled).toBeTruthy();
    expect(control.cssStyles.get(newName)!.length).toBe(58);
    expect(CSSProperty.controlBackgroundColor.has(control.id + '_' + newName)).toBeTruthy();
    expect(CSSProperty.colors.has('red')).toBeTruthy();

    const backgroundColorAfterRemove = control.cssProperty(newName, 'backgroundColor');
    expect(backgroundColorAfterRemove !== backgroundColor).toBeTruthy();

    // rename style
    store.history.undo();
    expect(control.cssStyles.has(oldName)).toBeTruthy();
    expect(backgroundColorAfterRemove!.enabled).toBeTruthy();
    expect(control.cssStyles.get(oldName)!.length).toBe(58);
    expect(CSSProperty.controlBackgroundColor.has(control.id + '_' + oldName)).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.has(control.id + '_' + newName)).toBeFalsy();

    // set value red => #ffffff
    store.history.undo();
    expect(backgroundColorAfterRemove!.value).toBe('#ffffff');
    expect(CSSProperty.colors.has('red')).toBeFalsy();
    expect(CSSProperty.colors.has('#ffffff')).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.get(control.id + '_' + oldName)).toBe('#ffffff');

    // disable backgroundColor property
    store.history.undo();
    expect(backgroundColorAfterRemove!.enabled).toBeFalsy();
    expect(CSSProperty.colors.has('#ffffff')).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.get(control.id + '_' + oldName)).toBeFalsy();
    expect(CSSProperty.colors.has('#ffffff')).toBeFalsy();

    // delete style Style1
    store.history.undo();
    expect(control.cssStyles.has(oldName)).toBeFalsy();

    // add style Style1
    store.history.redo();
    expect(control.cssStyles.has(oldName)).toBeTruthy();
    expect(control.cssStyles.get(oldName)!.length).toBe(58);

    const backgroundColorAfterRevertRemove = control.cssProperty(oldName, 'backgroundColor');
    // enable backgroundColor property
    store.history.redo();
    expect(backgroundColorAfterRevertRemove!.enabled).toBeTruthy();
    expect(CSSProperty.colors.has('#ffffff')).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.get(control.id + '_' + oldName)).toBe('#ffffff');

    // set value #ffffff => red
    store.history.redo();
    expect(CSSProperty.colors.has('#ffffff')).toBeFalsy();
    expect(CSSProperty.colors.has('red')).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.get(control.id + '_' + oldName)).toBe('red');

    // rename style Style1 => New Style
    store.history.redo();
    expect(control.cssStyles.has(newName)).toBeTruthy();
    expect(backgroundColorAfterRevertRemove!.enabled).toBeTruthy();
    expect(control.cssStyles.get(newName)!.length).toBe(58);
    expect(CSSProperty.controlBackgroundColor.get(control.id + '_' + oldName)).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.get(control.id + '_' + newName)).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.get(control.id + '_' + newName)).toBe('red');
  });

  it('add/remove style records', () => {
    store.history.clear();
    control.addCSSStyle();
    expect(control.cssStyles.size).toBe(2);

    expect(store.history.carriage).toBe(0);

    store.history.undo();
    expect(control.cssStyles.size).toBe(1);
    expect(store.history.canUndo).toBeFalsy();

    control.addCSSStyle();
    expect(control.cssStyles.size).toBe(2);

    store.history.undo();
  });

  it('add/edit/remove action history records', () => {
    control.addAction([ACTION_TOGGLE_STYLE, '', 'Style1']);
    expect(control.actions[0][2]).toBe('Style1');

    control.editAction(0, ACTION_TOGGLE_STYLE, '11/NewStyle');
    expect(control.actions[0][2]).toBe('NewStyle');

    control.removeAction(0);
    expect(control.actions.length).toBe(0);

    store.history.undo();
    expect(control.actions[0][2]).toBe('NewStyle');

    store.history.undo();
    expect(control.actions[0][2]).toBe('Style1');

    store.history.undo();
    expect(control.actions.length).toBe(0);

    store.history.redo();
    expect(control.actions[0][2]).toBe('Style1');

    store.history.redo();
    expect(control.actions[0][2]).toBe('NewStyle');

    store.history.redo();
    expect(control.actions.length).toBe(0);
  });

  it('dropCanvas history record', () => {
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control1 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control2 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control3 = ControlStore.controls[ControlStore.controls.length - 1];
    expect(store.currentScreen!.children.length).toBe(5);
    expect(ControlStore.controls.length).toBe(6);

    store.history.undo();
    expect(store.currentScreen!.children.length).toBe(4);
    expect(ControlStore.controls.length).toBe(5);

    store.history.undo();
    expect(store.currentScreen!.children.length).toBe(3);
    expect(ControlStore.controls.length).toBe(4);

    store.history.undo();
    expect(store.currentScreen!.children.length).toBe(2);
    expect(ControlStore.controls.length).toBe(3);

    store.history.redo();
    expect(store.currentScreen!.children.length).toBe(3);
    expect(ControlStore.controls.length).toBe(4);
    expect(ControlStore.controls.find(e => e.id === control1.id)!.id).toBe(control1.id);

    store.history.redo();
    expect(store.currentScreen!.children.length).toBe(4);
    expect(ControlStore.controls.length).toBe(5);
    expect(ControlStore.controls.find(e => e.id === control2.id)!.id).toBe(control2.id);

    store.history.redo();
    expect(store.currentScreen!.children.length).toBe(5);
    expect(ControlStore.controls.length).toBe(6);
    expect(ControlStore.controls.find(e => e.id === control3.id)!.id).toBe(control3.id);
  });

  it('drop element with parent', () => {
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control1 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control2 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control3 = ControlStore.controls[ControlStore.controls.length - 1];

    store.handleDropElement(control, control1, DropEnum.Inside);

    store.handleDropElement(control1, control2, DropEnum.Above);

    store.handleDropElement(control1, control3, DropEnum.Below);

    expect(control.children.length).toBe(3);
    expect(control.children.find(e => e.id === control3.id)!.id).toBe(control3.id);

    store.history.undo();
    expect(control.children.length).toBe(2);
    expect(control.children.find(e => e.id === control3.id)).toBeUndefined();

    store.history.undo();
    expect(control.children.length).toBe(1);

    store.history.undo();
    expect(control.children.length).toBe(0);

    store.history.redo();
    expect(control.children.length).toBe(1);
    expect(control.children.find(e => e.id === control1.id)!.id).toBe(control1.id);

    store.history.redo();
    expect(control.children.length).toBe(2);
    expect(control.children.find(e => e.id === control2.id)!.id).toBe(control2.id);

    store.history.redo();
    expect(control.children.length).toBe(3);
    expect(control.children.find(e => e.id === control3.id)!.id).toBe(control3.id);
  });

  it('move controls inside parent', () => {
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control1 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control2 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: '' });
    const control3 = ControlStore.controls[ControlStore.controls.length - 1];

    store.handleDropElement(control, control1, DropEnum.Inside);
    store.handleDropElement(control1, control2, DropEnum.Above);
    store.handleDropElement(control1, control3, DropEnum.Below);

    expect(control.children.length).toBe(3);

    store.history.undo();
    expect(control.children.length).toBe(2);
    store.history.undo();
    expect(control.children.length).toBe(1);
    store.history.undo();
    expect(control.children.length).toBe(0);

    store.history.redo();
    expect(control.children.length).toBe(1);
    expect(control.children.find(e => e.id === control1.id)!.id).toBe(control1.id);

    store.history.redo();
    expect(control.children.length).toBe(2);
    expect(control.children.find(e => e.id === control2.id)!.id).toBe(control2.id);

    store.history.redo();
    expect(control.children.length).toBe(3);
    expect(control.children.find(e => e.id === control3.id)!.id).toBe(control3.id);
  });

  it('drop/remove new control', () => {
    store.handleDropElement(control, GridStore.create(), DropEnum.Inside);
    store.handleDropElement(control, GridStore.create(), DropEnum.Above);
    store.handleDropElement(control, GridStore.create(), DropEnum.Below);

    expect(control.children.length).toBe(1);
    expect(store.currentScreen!.children.length).toBe(4);

    store.history.undo();
    expect(store.currentScreen!.children.length).toBe(3);

    store.history.undo();
    expect(store.currentScreen!.children.length).toBe(2);

    store.history.undo();
    expect(control.children.length).toBe(0);

    store.history.redo();
    expect(control.children.length).toBe(1);
    store.history.redo();
    expect(store.currentScreen!.children.length).toBe(3);
    store.history.redo();
    expect(store.currentScreen!.children.length).toBe(4);
  });

  it('view store settings history records', () => {
    expect(store.mode).toBe(Mode.WHITE);
    store.switchMode();
    expect(store.mode).toBe(Mode.DARK);

    expect(store.background.backgroundColor).toBe('#ffffff');
    store.setBackground({ backgroundColor: 'red' });
    expect(store.background.backgroundColor).toBe('red');

    expect(store.statusBarColor).toBe('#ffffff');
    store.setStatusBarColor('blue');
    expect(store.statusBarColor).toBe('blue');

    store.history.undo();
    expect(store.statusBarColor).toBe('#ffffff');

    store.history.undo();
    expect(store.background.backgroundColor).toBe('#ffffff');

    store.history.undo();
    expect(store.mode).toBe(Mode.WHITE);

    store.history.redo();
    expect(store.mode).toBe(Mode.DARK);

    store.history.redo();
    expect(store.background.backgroundColor).toBe('red');

    store.history.redo();
    expect(store.statusBarColor).toBe('blue');
  });

  it('add/delete/setCurrent screen history records', () => {
    expect(store.screens.length).toBe(1);
    const screen1 = store.screens[0];
    expect(store.currentScreen).toBe(screen1);

    store.addScreen();
    const screen2 = store.screens[1];
    expect(store.screens.length).toBe(2);
    expect(store.currentScreen).toBe(screen2);

    store.setCurrentScreen(screen1);
    expect(store.currentScreen).toBe(screen1);

    store.removeScreen(screen1);
    expect(store.screens.length).toBe(1);
    expect(store.currentScreen).toBe(screen2);

    store.history.undo();
    expect(store.screens.length).toBe(2);
    expect(store.currentScreen!.id).toBe(screen1.id);

    store.history.undo();
    expect(store.screens.length).toBe(1);

    store.history.redo();
    expect(store.screens.length).toBe(2);
    expect(store.currentScreen!.id).toBe(screen2.id);

    store.history.redo();
    expect(store.currentScreen!.id).toBe(screen2.id);

    store.history.redo();
    expect(store.screens.length).toBe(1);
    expect(store.currentScreen!.id).toBe(screen2.id);
  });

  it('screen clone history records', () => {
    const screen = store.screens[0];
    expect(screen.children.length).toBe(2);

    store.cloneScreen(screen);
    expect(store.screens.length).toBe(2);
    expect(store.screens[1].children.length).toBe(2);

    store.cloneScreen(screen);
    expect(store.screens.length).toBe(3);
    expect(store.screens[2].children.length).toBe(2);

    store.cloneScreen(screen);
    expect(store.screens.length).toBe(4);
    expect(store.screens[3].children.length).toBe(2);

    store.history.undo();
    expect(store.screens.length).toBe(3);
    store.history.undo();
    expect(store.screens.length).toBe(2);
    store.history.undo();
    expect(store.screens.length).toBe(1);

    store.history.redo();
    expect(store.screens.length).toBe(2);
    expect(store.screens[1].children.length).toBe(2);
    store.history.redo();
    expect(store.screens.length).toBe(3);
    expect(store.screens[2].children.length).toBe(2);
    store.history.redo();
    expect(store.screens.length).toBe(4);
    expect(store.screens[3].children.length).toBe(2);
  });

  it('control clone history records', () => {

    expect(store.screens[0].children.length).toBe(2);

    store.cloneControl(control);
    expect(store.screens[0].children.length).toBe(3);
    store.cloneControl(control);
    expect(store.screens[0].children.length).toBe(4);
    store.cloneControl(control);
    expect(store.screens[0].children.length).toBe(5);


    store.history.undo();
    expect(store.screens[0].children.length).toBe(4);
    store.history.undo();
    expect(store.screens[0].children.length).toBe(3);
    store.history.undo();
    expect(store.screens[0].children.length).toBe(2);

    store.history.redo();
    expect(store.screens[0].children.length).toBe(3);
    store.history.redo();
    expect(store.screens[0].children.length).toBe(4);
    store.history.redo();
    expect(store.screens[0].children.length).toBe(5);
  });

  it('Project color management', () => {
    const grid = CreateControl(ControlEnum.Grid);
    control.addChild(grid);

    const style1 = 'Style1';

    grid.addCSSStyle();

    grid.switchEnabled(style1, 'backgroundColor')();
    grid.setValue(style1, 'backgroundColor')('red');
    expect(CSSProperty.colors.has('red')).toBeTruthy();
    expect(CSSProperty.colors.get('red')!.length).toBe(1);

    control.switchEnabled(MAIN_CSS_STYLE, 'backgroundColor')();
    control.setValue(MAIN_CSS_STYLE, 'backgroundColor')('red');
    expect(CSSProperty.colors.get('red')!.length).toBe(2);

    expect(store.history.size).toBe(6);
    store.setColor('red', 'red');
    expect(store.history.size).toBe(7);

    store.setColor('red', 'blue');
    expect(store.history.size).toBe(8);

    expect(CSSProperty.colors.has('red')).toBeFalsy();
    expect(CSSProperty.colors.has('blue')).toBeTruthy();
    expect(CSSProperty.colors.get('blue')!.length).toBe(2);
    expect(grid.cssProperty(style1, 'backgroundColor')!.value).toBe('blue');
    expect(control.cssProperty(MAIN_CSS_STYLE, 'backgroundColor')!.value).toBe('blue');

    store.setColor('blue', 'green');
    expect(store.history.size).toBe(9);
    expect(store.history.carriage).toBe(8);
    expect(CSSProperty.colors.has('blue')).toBeFalsy();
    expect(CSSProperty.colors.has('green')).toBeTruthy();
    expect(CSSProperty.colors.get('green')!.length).toBe(2);
    expect(grid.cssProperty(style1, 'backgroundColor')!.value).toBe('green');
    expect(control.cssProperty(MAIN_CSS_STYLE, 'backgroundColor')!.value).toBe('green');

    store.history.undo();
    expect(store.history.carriage).toBe(7);
    expect(CSSProperty.colors.has('green')).toBeFalsy();
    expect(CSSProperty.colors.has('blue')).toBeTruthy();
    expect(CSSProperty.colors.get('blue')!.length).toBe(2);
    expect(grid.cssProperty(style1, 'backgroundColor')!.value).toBe('blue');
    expect(control.cssProperty(MAIN_CSS_STYLE, 'backgroundColor')!.value).toBe('blue');

    store.history.undo();
    expect(store.history.carriage).toBe(6);
    expect(CSSProperty.colors.has('blue')).toBeFalsy();
    expect(CSSProperty.colors.has('red')).toBeTruthy();
    expect(CSSProperty.colors.get('red')!.length).toBe(2);
    expect(grid.cssProperty(style1, 'backgroundColor')!.value).toBe('red');
    expect(control.cssProperty(MAIN_CSS_STYLE, 'backgroundColor')!.value).toBe('red');
  })
});
