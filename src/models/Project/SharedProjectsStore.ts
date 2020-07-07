import { reaction } from 'mobx';
import ProjectsStore from "models/Project/ProjectsStore";
import { App } from '../App';

export class SharedProjectsStore extends ProjectsStore {

  constructor() {
    super("project", 20, "sharedPagination");
    reaction(() => !App.loggedIn, () => {
      this.clear();
      this.fetchItems();
    });
  }
}

export const SharedProjects = new SharedProjectsStore();
