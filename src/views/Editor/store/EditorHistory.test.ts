import "@testing-library/jest-dom";
import EditorViewStore from "views/Editor/store/EditorViewStore";
import GridStore from "models/Control/GridStore";
import IControl from "interfaces/IControl";
import ControlStore, { MAIN_CSS_STYLE } from "ControlStore.ts";
import { ACTION_TOGGLE_STYLE } from "models/Constants";
import { DropEnum } from "enums/DropEnum";
import { Mode } from "enums/ModeEnum";

describe("EditorHistory", () => {
  let store: EditorViewStore, control: IControl;
  beforeEach(() => {
    jest.clearAllTimers();
    ControlStore.clear();
    store = new EditorViewStore(null);
    store.history.clear();
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
    control = store.currentScreen.children[store.currentScreen.children.length - 1];
  });

  it("changeTitle history record", () => {
    const title = "Hello World";
    jest.useFakeTimers();
    control.changeTitle(title);
    jest.runAllTimers();
    expect(control.title).toBe(title);
    expect(store.history.size).toBe(2);
    expect(store.history.carriage).toBe(1);

    store.history.undo();
    expect(control.title).toBe("Grid");
    expect(store.history.carriage).toBe(0);

    store.history.redo();
    expect(control.title).toBe(title);
    expect(store.history.carriage).toBe(1);
  });

  it("deleteSelf history record", () => {
    control.deleteSelf();
    expect(store.history.size).toBe(2);
    expect(store.history.carriage).toBe(1);
    expect(store.currentScreen.children.find(e => e.id === control.id)).toBeFalsy();

    store.history.undo();
    expect(store.currentScreen.children.find(e => e.id === control.id)).toBeTruthy();

    store.history.redo();
    expect(store.currentScreen.children.find(e => e.id === control.id)).toBeFalsy();
  });

  it("handleCSSProperty history records", () => {
    expect(control.styles.hasOwnProperty("position")).toBeFalsy();

    control.switchEnabled(MAIN_CSS_STYLE, "position")();
    expect(control.styles.hasOwnProperty("position")).toBeTruthy();
    expect(control.styles.position === "static").toBeTruthy();

    control.setValue(MAIN_CSS_STYLE, "position")("absolute");
    const position = control.cssProperty(MAIN_CSS_STYLE, "position");
    expect(control.styles.position === "absolute").toBeTruthy();

    control.switchExpanded(MAIN_CSS_STYLE, "padding")();
    const padding = control.cssProperty(MAIN_CSS_STYLE, "padding");
    expect(padding!.expanded).toBeTruthy();

    store.history.undo();
    expect(padding!.expanded).toBeFalsy();

    store.history.undo();
    expect(control.styles.position === "static").toBeTruthy();

    store.history.undo();
    expect(control.styles.hasOwnProperty("position")).toBeFalsy();

    store.history.redo();
    expect(control.styles.position === "static").toBeTruthy();

    store.history.redo();
    expect(control.styles.position === "absolute").toBeTruthy();

    store.history.redo();
    expect(padding!.expanded).toBeTruthy();
  });

  it("addCSSStyle/renameCSSStyle/removeCSSStyle history records", () => {
    control.addCSSStyle();
    expect(store.history.size).toBe(2);
    expect(store.history.carriage).toBe(1);

    const oldName = "Style1";
    const newName = "New Style";

    expect(control.cssStyles.has(oldName)).toBeTruthy();
    expect(control.cssStyles.get(oldName)!.length).toBe(49);
    control.switchEnabled(oldName, "position")();

    expect(control.cssStyles.get(oldName)![0].enabled).toBeTruthy();

    control.renameCSSStyle(oldName, newName);
    expect(control.cssStyles.has(newName)).toBeTruthy();
    expect(control.cssStyles.get(newName)![0].enabled).toBeTruthy();
    expect(control.cssStyles.get(newName)!.length).toBe(49);

    control.removeCSSStyle(newName);
    expect(control.cssStyles.has(newName)).toBeFalsy();

    store.history.undo();
    expect(control.cssStyles.has(newName)).toBeTruthy();
    expect(control.cssStyles.get(newName)![0].enabled).toBeTruthy();
    expect(control.cssStyles.get(newName)!.length).toBe(49);

    store.history.undo();
    expect(control.cssStyles.has(oldName)).toBeTruthy();
    expect(control.cssStyles.get(oldName)![0].enabled).toBeTruthy();
    expect(control.cssStyles.get(oldName)!.length).toBe(49);

    store.history.undo();
    expect(control.cssStyles.get(oldName)![0].enabled).toBeFalsy();

    store.history.undo();
    expect(control.cssStyles.has(oldName)).toBeFalsy();

    store.history.redo();
    expect(control.cssStyles.has(oldName)).toBeTruthy();
    expect(control.cssStyles.get(oldName)!.length).toBe(49);

    store.history.redo();
    expect(control.cssStyles.get(oldName)![0].enabled).toBeTruthy();
    store.history.redo();
    expect(control.cssStyles.has(newName)).toBeTruthy();
    expect(control.cssStyles.get(newName)![0].enabled).toBeTruthy();
    expect(control.cssStyles.get(newName)!.length).toBe(49);
  });

  it("add/remove style records", () => {
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

  it("add/edit/remove action history records", () => {
    control.addAction([ACTION_TOGGLE_STYLE, "", "Style1"]);
    expect(control.actions[0][2]).toBe("Style1");

    control.editAction(0, ACTION_TOGGLE_STYLE, "11/NewStyle");
    expect(control.actions[0][2]).toBe("NewStyle");

    control.removeAction(0);
    expect(control.actions.length).toBe(0);

    store.history.undo();
    expect(control.actions[0][2]).toBe("NewStyle");

    store.history.undo();
    expect(control.actions[0][2]).toBe("Style1");

    store.history.undo();
    expect(control.actions.length).toBe(0);

    store.history.redo();
    expect(control.actions[0][2]).toBe("Style1");

    store.history.redo();
    expect(control.actions[0][2]).toBe("NewStyle");

    store.history.redo();
    expect(control.actions.length).toBe(0);
  });

  it("dropCanvas history record", () => {
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
    const control1 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
    const control2 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
    const control3 = ControlStore.controls[ControlStore.controls.length - 1];
    expect(store.currentScreen.children.length).toBe(5);
    expect(ControlStore.controls.length).toBe(6);

    store.history.undo();
    expect(store.currentScreen.children.length).toBe(4);
    expect(ControlStore.controls.length).toBe(5);

    store.history.undo();
    expect(store.currentScreen.children.length).toBe(3);
    expect(ControlStore.controls.length).toBe(4);

    store.history.undo();
    expect(store.currentScreen.children.length).toBe(2);
    expect(ControlStore.controls.length).toBe(3);

    store.history.redo();
    expect(store.currentScreen.children.length).toBe(3);
    expect(ControlStore.controls.length).toBe(4);
    expect(ControlStore.controls.find(e => e.id === control1.id)!.id).toBe(control1.id);

    store.history.redo();
    expect(store.currentScreen.children.length).toBe(4);
    expect(ControlStore.controls.length).toBe(5);
    expect(ControlStore.controls.find(e => e.id === control2.id)!.id).toBe(control2.id);

    store.history.redo();
    expect(store.currentScreen.children.length).toBe(5);
    expect(ControlStore.controls.length).toBe(6);
    expect(ControlStore.controls.find(e => e.id === control3.id)!.id).toBe(control3.id);
  });

  it("drop element with parent", () => {
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
    const control1 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
    const control2 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
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

  it("move controls inside parent", () => {
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
    const control1 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
    const control2 = ControlStore.controls[ControlStore.controls.length - 1];
    store.handleDropCanvas({ control: GridStore.create(), type: "" });
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

  it("drop/remove new control", () => {
    store.handleDropElement(control, GridStore.create(), DropEnum.Inside);
    store.handleDropElement(control, GridStore.create(), DropEnum.Above);
    store.handleDropElement(control, GridStore.create(), DropEnum.Below);

    expect(control.children.length).toBe(1);
    expect(store.currentScreen.children.length).toBe(4);

    store.history.undo();
    expect(store.currentScreen.children.length).toBe(3);

    store.history.undo();
    expect(store.currentScreen.children.length).toBe(2);

    store.history.undo();
    expect(control.children.length).toBe(0);

    store.history.redo();
    expect(control.children.length).toBe(1);
    store.history.redo();
    expect(store.currentScreen.children.length).toBe(3);
    store.history.redo();
    expect(store.currentScreen.children.length).toBe(4);
  });

  it("view store settings history records", () => {
    expect(store.mode).toBe(Mode.WHITE);
    store.switchMode();
    expect(store.mode).toBe(Mode.DARK);

    expect(store.background.backgroundColor).toBe("#FFFFFF");
    store.setBackground({backgroundColor: "red"});
    expect(store.background.backgroundColor).toBe("red");

    expect(store.statusBarColor).toBe("#FFFFFF");
    store.setStatusBarColor("blue");
    expect(store.statusBarColor).toBe("blue");

    store.history.undo();
    expect(store.statusBarColor).toBe("#FFFFFF");

    store.history.undo();
    expect(store.background.backgroundColor).toBe("#FFFFFF");

    store.history.undo();
    expect(store.mode).toBe(Mode.WHITE);

    store.history.redo();
    expect(store.mode).toBe(Mode.DARK);

    store.history.redo();
    expect(store.background.backgroundColor).toBe("red");

    store.history.redo();
    expect(store.statusBarColor).toBe("blue");
  });

  it("add/delete/setCurrent screen history records", () => {
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
    expect(store.currentScreen.id).toBe(screen1.id);

    store.history.undo();
    expect(store.currentScreen.id).toBe(screen2.id);

    store.history.undo();
    expect(store.screens.length).toBe(1);
    expect(store.currentScreen.id).toBe(screen1.id);

    store.history.redo();
    expect(store.screens.length).toBe(2);
    expect(store.currentScreen.id).toBe(screen2.id);

    store.history.redo();
    expect(store.currentScreen.id).toBe(screen1.id);

    store.history.redo();
    expect(store.screens.length).toBe(1);
    expect(store.currentScreen.id).toBe(screen2.id);
  });

  it("screen clone history records", () => {
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

  it("control clone history records", () => {

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
});
