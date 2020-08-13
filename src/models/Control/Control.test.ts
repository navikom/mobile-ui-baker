import '@testing-library/jest-dom';
import { ControlEnum } from 'enums/ControlEnum';
import CreateControl from 'models/Control/ControlStores';
import CSSProperty from 'models/Control/CSSProperty';
import {
  ACTION_NAVIGATE_TO,
  ACTION_TOGGLE_STYLE,
  CSS_CAT_ALIGN_CHILDREN,
  CSS_CAT_DIMENSIONS,
  CSS_VALUE_NUMBER
} from 'models/Constants';
import IControl from 'interfaces/IControl';
import ControlStore, { MAIN_CSS_STYLE } from 'models/Control/ControlStore';

describe('Control', () => {
  beforeEach(() => {
    ControlStore.clear();
  });

  it('New Control element will be added to static Classes.controls array', () => {
    const grid = CreateControl(ControlEnum.Grid);
    expect(ControlStore.has(grid.id)).toBe(true);
  });

  it('Control deleteSelf will be deleted from static Classes.controls array', () => {
    const grid = CreateControl(ControlEnum.Grid);
    expect(ControlStore.has(grid.id)).toBe(true);
    grid.deleteSelf();
    expect(ControlStore.has(grid.id)).toBe(false);
  });

  it(`New Control element has enabled style 'padding'`, () => {
    const grid = CreateControl(ControlEnum.Grid);
    expect(Object.prototype.hasOwnProperty.call(grid.styles, 'padding')).toBe(false);
  });

  it('Add new style will add clone of the main style and makes record [control.id]/[styleName]' +
    ' to the static Control.classes array, rename style will edit record in Control.classes,' +
    ' after delete record will be deleted from Control.classes', () => {
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    const position = mainStyle![0];
    expect(position.enabled).toBeFalsy();
    position.switchEnabled(grid, MAIN_CSS_STYLE);
    expect(position.enabled).toBeTruthy();
    const backgroundColor = grid.cssProperty(MAIN_CSS_STYLE, 'backgroundColor');
    backgroundColor!.switchEnabled(grid, MAIN_CSS_STYLE);
    grid.setValue(MAIN_CSS_STYLE, 'backgroundColor')('red');
    expect(CSSProperty.colors.has('red')).toBeTruthy();
    expect(CSSProperty.colors.get('red')!.includes(grid.id)).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.has(grid.id + '_' + MAIN_CSS_STYLE)).toBeTruthy();

    grid.addCSSStyle();
    const secondStyle = grid.cssStyles.get('Style1');
    expect(mainStyle === secondStyle).toBeFalsy();
    const position2 = secondStyle![0];
    expect(position2.enabled).toBeTruthy();
    expect(position === position2).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.has(grid.id + '_Style1')).toBeTruthy();
    expect(ControlStore.classes.includes(`${grid.id}/Style1`)).toBeTruthy();
    grid.renameCSSStyle('Style1', 'NewStyle');
    expect(grid.cssStyles.has('Style1')).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.has(grid.id + '_Style1')).toBeFalsy();
    expect(ControlStore.classes.includes(`${grid.id}/Style1`)).toBeFalsy();
    expect(ControlStore.classes.includes(`${grid.id}/NewStyle`)).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.has(grid.id + '_NewStyle')).toBeTruthy();
    grid.removeCSSStyle('NewStyle');
    expect(grid.cssStyles.has('NewStyle')).toBeFalsy();
    expect(ControlStore.classes.includes(`${grid.id}/NewStyle`)).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.has(grid.id + '_NewStyle')).toBeFalsy();
  });

  it('Add child then add new style to the child then, after parent deletion, record [child.id]/[styleName]' +
    ' should be deleted from Control.classes', () => {
    const parent = CreateControl(ControlEnum.Grid);
    const grid = CreateControl(ControlEnum.Grid);
    parent.addChild(grid);
    grid.addCSSStyle();
    expect(ControlStore.classes.includes(`${grid.id}/Style1`)).toBeTruthy();
    grid.switchEnabled('Style1', 'backgroundColor')();
    grid.setValue('Style1', 'backgroundColor')('red');
    expect(CSSProperty.colors.has('red')).toBeTruthy();
    expect(CSSProperty.controlBackgroundColor.has(grid.id + '_Style1')).toBeTruthy();
    parent.deleteSelf();
    expect(ControlStore.classes.includes(`${grid.id}/Style1`)).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.has(grid.id + '_Style1')).toBeFalsy();
    expect(CSSProperty.colors.has('red')).toBeFalsy();
  });

  it('Merge styles', () => {
    const grid = CreateControl(ControlEnum.Grid);
    expect(Object.prototype.hasOwnProperty.call(grid.styles, 'width')).toBeFalsy();
    expect(Object.prototype.hasOwnProperty.call(grid.styles, 'padding')).toBeFalsy();
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    const width = mainStyle![15];
    expect(width.key === 'width').toBeTruthy();
    expect(width.enabled).toBeFalsy();
    grid.mergeStyles(new Map([
      [MAIN_CSS_STYLE, [
        new CSSProperty('width', 10, 10, CSS_CAT_DIMENSIONS, true, CSS_VALUE_NUMBER)
          .setUnits('px', ['px', '%', 'rem']),
        new CSSProperty('padding', 15, 0, CSS_CAT_ALIGN_CHILDREN)
          .makeExpandable()
      ]]
    ]));
    expect(Object.prototype.hasOwnProperty.call(grid.styles, 'width')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(grid.styles, 'padding')).toBeFalsy();
    const width2 = mainStyle![15];
    expect(width2.enabled).toBeTruthy();
    expect(width === width2).toBeTruthy();
  });

  it('Add/edit/activate/delete control actions', () => {
    const grid1 = CreateControl(ControlEnum.Grid);
    const grid2 = CreateControl(ControlEnum.Grid);

    grid1.addCSSStyle(); // Added Style1
    const mainBackground = grid1.cssProperty(MAIN_CSS_STYLE, 'backgroundColor');
    const background1 = grid1.cssProperty('Style1', 'backgroundColor');
    expect(mainBackground !== background1).toBeTruthy();
    grid1.switchEnabled(MAIN_CSS_STYLE, 'backgroundColor')();
    expect(CSSProperty.colors.has('#ffffff')).toBeTruthy();
    grid1.switchEnabled('Style1', 'backgroundColor')();
    grid1.setValue('Style1', 'backgroundColor')('red');
    expect(CSSProperty.controlBackgroundColor.has(grid1.id + '_Style1')).toBeTruthy();
    expect(CSSProperty.colors.has('red')).toBeTruthy();

    expect(grid1.styles.backgroundColor).toBe('#ffffff');
    jest.useFakeTimers();

    grid2.addAction([ACTION_TOGGLE_STYLE, grid1.id, 'Style1']);
    grid2.applyActions();
    jest.runAllTimers();
    expect(grid1.styles.backgroundColor).toBe('red');
    grid2.applyActions();
    jest.runAllTimers();
    expect(grid1.styles.backgroundColor).toBe('#ffffff');

    grid1.renameCSSStyle('Style1', 'NewStyle');
    expect(CSSProperty.controlBackgroundColor.has(grid1.id + '_Style1')).toBeFalsy();
    expect(CSSProperty.controlBackgroundColor.has(grid1.id + '_NewStyle')).toBeTruthy();

    // action will not be working after style rename
    grid2.applyActions();
    jest.runAllTimers();
    expect(grid1.styles.backgroundColor === 'red').toBeFalsy();

    // to make it working need to edit the action
    grid2.editAction(0, ACTION_TOGGLE_STYLE, `${grid1.id}/NewStyle`);
    grid2.applyActions();
    jest.runAllTimers();
    expect(grid1.styles.backgroundColor === 'red').toBeTruthy();
    grid2.applyActions();
    jest.runAllTimers();
    expect(grid1.styles.backgroundColor === '#ffffff').toBeTruthy();

    grid2.removeAction(0);
    grid2.applyActions();
    jest.runAllTimers();
    expect(grid1.styles.backgroundColor === 'red').toBeFalsy();
  });

  it('Add and apply navigation action', () => {
    const newScreen = CreateControl(ControlEnum.Grid);
    const grid = CreateControl(ControlEnum.Grid);
    grid.addAction([ACTION_NAVIGATE_TO, newScreen.id]);
    grid.applyActions((action: string, screen?: IControl) => {
      jest.runAllTimers();
      expect(screen === newScreen).toBeTruthy();
    })
  });

  it('Convert control to JSON format and vice versa', () => {
    const grid = CreateControl(ControlEnum.Grid);
    grid.addCSSStyle();
    grid.switchEnabled('Style1', 'backgroundColor')();
    grid.setValue('Style1', 'backgroundColor')('red');

    const json = grid.toJSON;
    expect(json.cssStyles[1][1].length).toBe(1);
    expect(json.id === grid.id).toBeTruthy();
    expect(CSSProperty.colors.get('red')!.includes(grid.id)).toBeTruthy();
    grid.deleteSelf(true);
    expect(CSSProperty.colors.has('red')).toBeFalsy();
    const grid2 = CreateControl(json.type, json as IControl);

    expect(grid2.id === grid.id).toBeTruthy();
    expect(grid2 === grid).toBeFalsy();

    expect(grid2.cssStyles.has('Style1')).toBeTruthy();
    expect(CSSProperty.colors.get('red')!.includes(grid2.id)).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(grid2.styles, 'backgroundColor')).toBeFalsy();
    grid2.addClass('Style1');
    expect(grid2.styles.backgroundColor === 'red').toBeTruthy();
  });

  it('Convert control tree to JSON and vice versa', () => {
    const grid = CreateControl(ControlEnum.Grid);
    grid.addChild(CreateControl(ControlEnum.Grid));
    const json = grid.toJSON;
    ControlStore.clear();

    const grid2 = CreateControl(json.type, json as IControl);
    expect(grid.id === grid2.id).toBeTruthy();
    expect(grid === grid2).toBeFalsy();
    expect(grid2.children.length).toBe(1);
  });

});
