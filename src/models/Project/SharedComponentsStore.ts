import ProjectsStore from "models/Project/ProjectsStore";

export class SharedComponentsStore extends ProjectsStore {

  constructor() {
    super("component", 20, "sharedPagination")
  }
}

export const SharedComponents = new SharedComponentsStore();
