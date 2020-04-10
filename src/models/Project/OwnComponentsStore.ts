import ProjectsStore from "models/Project/ProjectsStore";

export class OwnComponentsStore extends ProjectsStore {

  constructor() {
    super("component", 20, "pagination")
  }
}

export const OwnComponents = new OwnComponentsStore();
