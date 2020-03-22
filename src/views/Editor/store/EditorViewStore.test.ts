import "@testing-library/jest-dom";
import EditorViewStore, { ControlStores } from "views/Editor/store/EditorViewStore";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";

describe("EditorViewStore.js", () => {
  let store: EditorViewStore;
  beforeEach(() => {
    store = new EditorViewStore();
    store.addItem(ControlStores[ControlEnum.Drawer].create(store.currentScreen));
    store.addItem(ControlStores[ControlEnum.Button].create(store.currentScreen));
    store.addItem(ControlStores[ControlEnum.Text].create(store.currentScreen));
  });

  it("Add control items to the store document", () => {
    expect(store.currentScreen.children.length).toBe(4);
  });

  it("Drop control to the canvas", () => {
    store.handleDropCanvas({ type: "Control", control: ControlStores[ControlEnum.Button].create(store.currentScreen) });
    expect(store.currentScreen.children.length).toBe(5);
    expect(store.currentScreen.children[4].title).toBe("Button");
  });

  it("Drop new control inside the first element", () => {
    const parent = store.currentScreen.children[0];
    const child = ControlStores[ControlEnum.Button].create(store.currentScreen);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
  });

  it("Drop new control above the first element", () => {
    const parent = store.currentScreen.children[0];
    const child = ControlStores[ControlEnum.Button].create(store.currentScreen);
    store.handleDropElement(parent, child, DropEnum.Above);
    expect(parent.children.length).toBe(0);
    expect(store.currentScreen.children.length).toBe(5);
    expect(store.currentScreen.children[0]).toBe(child);
  });

  it("Drop new control below the first element", () => {
    const parent = store.currentScreen.children[0];
    const child = ControlStores[ControlEnum.Button].create(store.currentScreen);
    store.handleDropElement(parent, child, DropEnum.Below);
    expect(parent.children.length).toBe(0);
    expect(store.currentScreen.children.length).toBe(5);
    expect(store.currentScreen.children[1]).toBe(child);
  });

  it("Drop new control inside the control with allowChildren property equals false, impossible", () => {
    const parent = store.currentScreen.children[3];
    expect(parent.allowChildren).toBe(false);
    const child = ControlStores[ControlEnum.Button].create(store.currentScreen);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(0);
    expect(store.currentScreen.children.length).toBe(4);
  });

  it("Sort controls inside another control", () => {
    const parent = store.currentScreen.children[0];
    const child = ControlStores[ControlEnum.Button].create(store.currentScreen);
    const child2 = ControlStores[ControlEnum.Text].create(store.currentScreen);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
    store.handleDropElement(child, child2, DropEnum.Above);
    expect(parent.children.length).toBe(2);
    expect(parent.children[0]).toBe(child2);
    expect(parent.children[1]).toBe(child);
  });

  it("Move and drop second control inside third control", () => {
    const parent = store.currentScreen.children[2];
    const child = store.currentScreen.children[3];
    expect(store.currentScreen.children.length).toBe(4);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(store.currentScreen.children.length).toBe(3);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
  });

  it("Move and drop control from one parent to another", () => {
    const parent1 = store.currentScreen.children[0];
    const child1 = ControlStores[ControlEnum.Button].create(store.currentScreen);
    const parent2 = store.currentScreen.children[1];
    const child2 = ControlStores[ControlEnum.Text].create(store.currentScreen);
    store.handleDropElement(parent1, child1, DropEnum.Inside);
    store.handleDropElement(parent2, child2, DropEnum.Inside);
    expect(parent1.children.length).toBe(1);
    expect(parent2.children.length).toBe(1);
    expect(parent1.children[0]).toBe(child1);
    expect(parent2.children[0]).toBe(child2);
    store.handleDropElement(child1, child2, DropEnum.Above);
    expect(parent2.children.length).toBe(0);
    expect(parent1.children.length).toBe(2);
    expect(parent1.children[0]).toBe(child2);
  });

  it("Move and drop parent control inside the there child control impossible", () => {
    const parent1 = store.currentScreen.children[0];
    const child1 = ControlStores[ControlEnum.Button].create(store.currentScreen);
    jest.useFakeTimers();
    // child1 control hover above parent1
    store.moveControl(parent1, child1, DropEnum.Inside);
    jest.runOnlyPendingTimers();
    expect(parent1.dropTarget).toBe(DropEnum.Inside);
    store.handleDropElement(parent1, child1, DropEnum.Inside);
    expect(parent1.children[0]).toBe(child1);

    jest.useFakeTimers();
    // parent1 control hover above own child child1
    store.moveControl(child1, parent1, DropEnum.Inside);
    jest.runOnlyPendingTimers();
    expect(child1.dropTarget === DropEnum.Inside).toBeFalsy();

    store.handleDropElement(child1, parent1, DropEnum.Inside);
    expect(parent1.children.length).toBe(1);
    expect(parent1.children[0]).toBe(child1);
    expect(child1.children.length).toBe(0);
  });

  it("Move and drop control from one screen to another below child", () => {
    const firstScreen = store.screens[0];
    expect(firstScreen.children.length).toBe(4);
    const secondScreen = store.addScreen();
    expect(secondScreen.children.length).toBe(1);
    expect(store.screens.length).toBe(2);
    const child = firstScreen.children[1];
    store.handleDropElement(secondScreen.children[0], child, DropEnum.Below);
    expect(firstScreen.children.length).toBe(3);
    expect(secondScreen.children.length).toBe(2);
    expect(secondScreen.children[1]).toBe(child);
    expect(child.screen).toBe(secondScreen);
  });

  it("Move and drop control from one screen to another above child", () => {
    const firstScreen = store.screens[0];
    const secondScreen = store.addScreen();
    const child = firstScreen.children[1];
    store.handleDropElement(secondScreen.children[0], child, DropEnum.Above);
    expect(firstScreen.children.length).toBe(3);
    expect(secondScreen.children.length).toBe(2);
    expect(secondScreen.children[0]).toBe(child);
    expect(child.screen).toBe(secondScreen);
  });

  it("Move and drop control from one screen to another inside child", () => {
    const firstScreen = store.screens[0];
    const secondScreen = store.addScreen();
    const child = firstScreen.children[1];
    const parent = secondScreen.children[0];
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(firstScreen.children.length).toBe(3);
    expect(parent.children[0]).toBe(child);
    expect(child.screen).toBe(secondScreen);
  });

});
