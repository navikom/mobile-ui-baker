import { reaction } from 'mobx';
import ProjectsStore from "models/Project/ProjectsStore";
import { App } from 'models/App';

export class OwnProjectsStore extends ProjectsStore {

  constructor() {
    super("project", 20, "pagination")
    reaction(() => !App.loggedIn, () => {
      this.clear();
    });
  }

}

export const OwnProjects = new OwnProjectsStore();
