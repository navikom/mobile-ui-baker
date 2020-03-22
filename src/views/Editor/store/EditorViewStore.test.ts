import "@testing-library/jest-dom";
import EditorViewStore, { ControlStores } from "views/Editor/store/EditorViewStore";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";

describe('EditorViewStore.js', () => {
  let store: EditorViewStore;
  beforeEach(() => {
    store = new EditorViewStore();
    store.addItem(ControlStores[ControlEnum.Drawer].create());
    store.addItem(ControlStores[ControlEnum.Button].create());
    store.addItem(ControlStores[ControlEnum.Text].create());
  });

  it('Add control items to the store document', () => {
    expect(store.document.length).toBe(4);
  });

  it('Drop control to the canvas', () => {
    store.handleDropCanvas({type: 'Control', control: ControlStores[ControlEnum.Button].create()});
    expect(store.document.length).toBe(5);
    expect(store.document[4].name).toBe('Button');
  });

  it('Drop new control inside the first element', () => {
    const parent = store.document[0];
    const child = ControlStores[ControlEnum.Button].create();
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0].name).toBe('Button');
  });

  it('Drop new control above the first element', () => {
    const parent = store.document[0];
    const child = ControlStores[ControlEnum.Button].create();
    store.handleDropElement(parent, child, DropEnum.Above);
    expect(parent.children.length).toBe(0);
    expect(store.document.length).toBe(5);
    expect(store.document[0]).toBe(child);
  });

  it('Drop new control below the first element', () => {
    const parent = store.document[0];
    const child = ControlStores[ControlEnum.Button].create();
    store.handleDropElement(parent, child, DropEnum.Below);
    expect(parent.children.length).toBe(0);
    expect(store.document.length).toBe(5);
    expect(store.document[1]).toBe(child);
  });

  it('Drop new control inside the control with allowChildren property equals false, impossible', () => {
    const parent = store.document[3];
    expect(parent.allowChildren).toBe(false);
    const child = ControlStores[ControlEnum.Button].create();
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(0);
    expect(store.document.length).toBe(4);
  });

  it('Sort controls inside another control', () => {
    const parent = store.document[0];
    const child = ControlStores[ControlEnum.Button].create();
    const child2 = ControlStores[ControlEnum.Text].create();
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
    store.handleDropElement(child, child2, DropEnum.Above);
    expect(parent.children.length).toBe(2);
    expect(parent.children[0]).toBe(child2);
    expect(parent.children[1]).toBe(child);
  });

  it('Move and drop second control inside third control', () => {
    const parent = store.document[2];
    const child = store.document[3];
    expect(store.document.length).toBe(4);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(store.document.length).toBe(3);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
  });

  it('Move and drop control from one parent to another', () => {
    const parent1 = store.document[0];
    const child1 = ControlStores[ControlEnum.Button].create();
    const parent2 = store.document[1];
    const child2 = ControlStores[ControlEnum.Text].create();
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

});
