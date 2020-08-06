import '@testing-library/jest-dom';
import { FetchMock } from 'jest-fetch-mock';
import EditorViewStore from 'views/Editor/store/EditorViewStore';
import { ControlEnum } from 'enums/ControlEnum';
import { DropEnum } from 'enums/DropEnum';
import CreateControl from 'models/Control/ControlStores';
import { Auth } from 'models/Auth/Auth';
import { App } from 'models/App';

import users from '__mockData__/users';
import projects from '__mockData__/projects';
import components from '__mockData__/components';
import controls from '__mockData__/controls';

const fetchMock = fetch as FetchMock;

const responseHeader = { headers: { 'content-type': 'application/json' } };
const postResponseSuccess = JSON.stringify({ success: true });

describe('EditorViewStore', () => {
  let store: EditorViewStore;
  beforeEach(() => {
    jest.clearAllTimers();
    fetchMock.resetMocks();
    store = new EditorViewStore('');
    store.addItem(CreateControl(ControlEnum.Grid));
    store.addItem(CreateControl(ControlEnum.Text));
  });

  it('Add control items to the store document', () => {
    expect(store.currentScreen!.children.length).toBe(3);
  });

  it('Drop control to the canvas', () => {
    store.handleDropCanvas({ type: 'Control', control: CreateControl(ControlEnum.Grid) });
    expect(store.currentScreen!.children.length).toBe(4);
    expect(store.currentScreen!.children[3].title).toBe('Grid');
  });

  it('Drop new control inside the first element', () => {
    const parent = store.currentScreen!.children[0];
    const child = CreateControl(ControlEnum.Grid);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
  });

  it('Drop new control above the first element', () => {
    const parent = store.currentScreen!.children[0];
    const child = CreateControl(ControlEnum.Grid);
    store.handleDropElement(parent, child, DropEnum.Above);
    expect(parent.children.length).toBe(0);
    expect(store.currentScreen!.children.length).toBe(4);
    expect(store.currentScreen!.children[0]).toBe(child);
  });

  it('Drop new control below the first element', () => {
    const parent = store.currentScreen!.children[0];
    const child = CreateControl(ControlEnum.Grid);
    store.handleDropElement(parent, child, DropEnum.Below);
    expect(parent.children.length).toBe(0);
    expect(store.currentScreen!.children.length).toBe(4);
    expect(store.currentScreen!.children[1]).toBe(child);
  });

  it('Drop new control inside the control with allowChildren property equals false, impossible', () => {
    const parent = store.currentScreen!.children[2];
    expect(parent.allowChildren).toBe(false);
    const child = CreateControl(ControlEnum.Grid);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(0);
    expect(store.currentScreen!.children.length).toBe(3);
  });

  it('Sort controls inside another control', () => {
    const parent = store.currentScreen!.children[0];
    const child = CreateControl(ControlEnum.Grid);
    const child2 = CreateControl(ControlEnum.Text);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
    store.handleDropElement(child, child2, DropEnum.Above);
    expect(parent.children.length).toBe(2);
    expect(parent.children[0]).toBe(child2);
    expect(parent.children[1]).toBe(child);
  });

  it('Move and drop second control inside third control', () => {
    const parent = store.currentScreen!.children[1];
    const child = store.currentScreen!.children[2];
    expect(store.currentScreen!.children.length).toBe(3);
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(store.currentScreen!.children.length).toBe(2);
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
  });

  it('Move and drop control from one parent to another', () => {
    const parent1 = store.currentScreen!.children[0];
    const child1 = CreateControl(ControlEnum.Grid);
    const parent2 = store.currentScreen!.children[1];
    const child2 = CreateControl(ControlEnum.Text);
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

  it('Move and drop parent control inside the there child control impossible', () => {
    const parent1 = store.currentScreen!.children[0];
    const child1 = CreateControl(ControlEnum.Grid);
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

  it('Move and drop control from one screen to another below child', () => {
    const firstScreen = store.screens[0];
    expect(firstScreen.children.length).toBe(3);
    const secondScreen = store.addScreen();
    expect(secondScreen.children.length).toBe(1);
    expect(store.screens.length).toBe(2);
    const child = firstScreen.children[1];
    store.handleDropElement(secondScreen.children[0], child, DropEnum.Below);
    expect(firstScreen.children.length).toBe(2);
    expect(secondScreen.children.length).toBe(2);
    expect(secondScreen.children[1]).toBe(child);
    expect(child.parentId).toBe(secondScreen.id);
  });

  it('Move and drop control from one screen to another above child', () => {
    const firstScreen = store.screens[0];
    const secondScreen = store.addScreen();
    const child = firstScreen.children[1];
    store.handleDropElement(secondScreen.children[0], child, DropEnum.Above);
    expect(firstScreen.children.length).toBe(2);
    expect(secondScreen.children.length).toBe(2);
    expect(secondScreen.children[0]).toBe(child);
    expect(child.parentId).toBe(secondScreen.id);
  });

  it('Move and drop control from one screen to another inside child', () => {
    const firstScreen = store.screens[0];
    const secondScreen = store.addScreen();
    const child = firstScreen.children[1];
    const parent = secondScreen.children[0];
    store.handleDropElement(parent, child, DropEnum.Inside);
    expect(firstScreen.children.length).toBe(2);
    expect(parent.children[0]).toBe(child);
    expect(secondScreen.hasChild(child)).toBe(false);
  });

  it('Move and drop control inside itself forbidden', () => {
    const control = store.screens[0].children[0];
    store.handleDropElement(control, control, DropEnum.Inside);
    expect(store.screens[0].children.length).toBe(3);
  });

  it('Add new screen and make it selected and then remove, which will make first screen selected automatically ', () => {
    const firstScreen = store.screens[0];

    expect(store.screens.length).toBe(1);
    expect(store.isCurrent(firstScreen)).toBe(true);

    const newScreen = store.addScreen();

    expect(store.screens.length).toBe(2);
    expect(store.isCurrent(firstScreen)).toBe(false);
    expect(store.isCurrent(newScreen)).toBe(true);

    store.removeScreen(newScreen);

    expect(store.screens.length).toBe(1);
    expect(store.isCurrent(firstScreen)).toBe(true);
  });

  it('Delete control', () => {
    const firstScreen = store.screens[0];
    const parent = firstScreen.children[0];
    const child = CreateControl(ControlEnum.Grid);
    store.handleDropElement(parent, child, DropEnum.Inside);

    expect(parent.hasChild(child)).toBe(true);
    child.deleteSelf();

    expect(parent.hasChild(child)).toBe(false);

    expect(firstScreen.children.length).toBe(3);
    parent.deleteSelf();

    expect(firstScreen.children.length).toBe(2);
    expect(firstScreen.hasChild(parent)).toBe(false);
  });

  it('Clone screen', () => {
    const title = 'Hello World';
    expect(store.screens.length).toBe(1);
    const screen = store.screens[0];
    screen.children[1].changeTitle(title);
    store.cloneScreen(screen);
    expect(store.screens.length).toBe(2);
    const screen2 = store.screens[1];
    expect(screen === screen2).toBe(false);
    expect(screen2.children[1].title).toBe(title);
  });

  it('Clone control', () => {
    const screen = store.screens[0];
    const control = CreateControl(ControlEnum.Grid);
    screen.addChild(control);
    const text = CreateControl(ControlEnum.Text);
    control.addChild(text);
    expect(control.children[0].title).toBe('Text');
    expect(control.children.length).toBe(1);

    const title = 'Hello World';
    control.children[0].changeTitle(title);
    store.cloneControl(control);
    const index = screen.children.indexOf(control);
    const cloned = screen.children[index + 1];
    expect(cloned.children.length).toBe(1);
    expect(cloned.children[0].title).toBe(title);
    expect(cloned.children[0].parentId).toBe(cloned.id);

    store.cloneControl(cloned.children[0]);
    expect(cloned.children.length).toBe(2);
  });

  it('Save new project fail if user logged out', () => {
    expect(store.error).toBe(null);
    store.saveProject();
    expect(store.error).toBe('Project save error: Please, login to perform this');
  });

  it('The project manipulation', async () => {

    // Save new project adds project id
    fetchMock.mockResponseOnce(JSON.stringify(users.login), responseHeader);
    await Auth.login('test', 'test');
    expect(App.loggedIn).toBe(true);
    expect(store.project.projectId).toBe(0);
    fetchMock.mockResponseOnce(JSON.stringify(projects.project1), responseHeader);
    await store.saveProject();
    expect(store.project.projectId).toBe(1);

    // updateProjectData project should updateProjectData to the same existing project
    const projectResponse = projects.project1;
    projectResponse.data.title = 'Title 2';
    fetchMock.mockResponseOnce(JSON.stringify(projectResponse), responseHeader);
    await store.saveProject();
    expect(store.project.projectId).toBe(1);
    expect(store.project.title).toBe('Title 2');

    // Update project fail if the project access not for edit and user logged out
    fetchMock.mockResponseOnce(postResponseSuccess);
    await Auth.logout();
    expect(App.loggedIn).toBeFalsy();
    expect(store.error).toBe(null);
    await store.saveProject();
    expect(store.error).toBe('Title 2 save error: Please, login to perform this');
  });

  it('Open the new project if requested project does not exists', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(projects.projectDoesNotExists), { status: 500, ...responseHeader });
    const store1 = new EditorViewStore('');
    await store1.fetchProjectData(10);
    expect(store1.project.projectId).toBe(0);
  });

  it('Open the new project if requested project access denied', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(projects.projectAccessDenied), { status: 500, ...responseHeader });
    const store1 = new EditorViewStore('');
    await store1.fetchProjectData(5);
    expect(store1.project.projectId).toBe(0);
  });

  it('Open existing project', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(users.login), responseHeader);
    await Auth.login('test', 'test');
    expect(App.loggedIn).toBe(true);

    fetchMock.mockResponseOnce(JSON.stringify(projects.project1), responseHeader);
    const store1 = new EditorViewStore('');
    await store1.fetchProjectData(1);
    expect(store1.project.projectId).toBe(1);

    fetchMock.mockResponseOnce(postResponseSuccess);
    await Auth.logout();
    expect(App.loggedIn).toBeFalsy();
  });

  it('The component manipulation', async () => {
    // Save new component adds instance (project with Component type)
    fetchMock.mockResponseOnce(
      JSON.stringify(users.login), responseHeader,
    );
    await Auth.login('test', 'test');
    expect(App.loggedIn).toBe(true);
    const control = store.currentScreen!.children[0];

    document.body.innerHTML =
      '<div>' +
      `  <span id="capture_${control.id}" />` +
      '</div>';

    expect(control.instance).toBeUndefined();
    fetchMock.mockResponseOnce(JSON.stringify(components.component1), responseHeader);
    await store.saveComponent(control);
    expect(control.instance!.projectId).toBe(2);
    expect(control.instance!.version.versionId).toBe(3);

    // updateProjectData component should updateProjectData to the same existing instance
    const componentResponse = components.component1;
    componentResponse.data.title = 'New Title';
    componentResponse.data.versions[0].data.title = 'New Grid Title';
    fetchMock.mockResponseOnce(JSON.stringify(componentResponse), responseHeader);
    await store.saveComponent(control);
    expect(control.instance!.projectId).toBe(2);
    expect(control.instance!.title).toBe('New Title');
    expect(control.instance!.version.data.title).toBe('New Grid Title');

    // Update component fail if the component access not for edit and user logged out
    fetchMock.mockResponseOnce(postResponseSuccess);
    await Auth.logout();
    expect(App.loggedIn).toBeFalsy();
    expect(store.error).toBe(null);
    await store.saveControl(control);
    expect(store.error).toBe('Grid save error: Please, login to perform this');
  });


  it('Control manipulation', async () => {
    // Save new control adds instance (project with Control type)
    fetchMock.mockResponses(
      [JSON.stringify(users.login), responseHeader],
    );
    await Auth.login('test', 'test');
    expect(App.loggedIn).toBe(true);
    const control = store.currentScreen!.children[0];

    document.body.innerHTML =
      '<div>' +
      `  <span id="capture_${control.id}" />` +
      '</div>';

    expect(control.instance).toBeUndefined();
    fetchMock.mockResponseOnce(JSON.stringify(controls.control3), responseHeader);
    await store.saveControl(control);
    expect(control.instance!.projectId).toBe(3);
    expect(control.instance!.version.versionId).toBe(5);

    // updateProjectData component should updateProjectData to the same existing instance
    const controlResponse = controls.control3;
    controlResponse.data.title = 'New Title';
    controlResponse.data.versions[0].data.title = 'New Grid Title';
    fetchMock.mockResponseOnce(JSON.stringify(controlResponse), responseHeader);
    await store.saveControl(control);
    expect(control.instance!.projectId).toBe(3);
    expect(control.instance!.title).toBe('New Title');
    expect(control.instance!.version.data.title).toBe('New Grid Title');

    // Update component fail if the component access not for edit and user logged out
    fetchMock.mockResponseOnce(postResponseSuccess);
    await Auth.logout();
    expect(App.loggedIn).toBeFalsy();
    expect(store.error).toBe(null);
    await store.saveControl(control);
    expect(store.error).toBe('Grid save error: Please, login to perform this');

  });

});
