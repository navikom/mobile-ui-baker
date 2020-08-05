import { reaction } from 'mobx';
import ProjectsStore from "models/Project/ProjectsStore";
import { App } from '../App';

export class OwnComponentsStore extends ProjectsStore {

  constructor() {
    super("component", 20, "pagination")
    reaction(() => {
      return App.loggedIn;
    }, async (loggedIn: boolean) => {
      !loggedIn && this.clear();
    });
  }
}

export const OwnComponents = new OwnComponentsStore();
