import ProjectsStore from "models/Project/ProjectsStore";

export class SharedProjectsStore extends ProjectsStore {

  constructor() {
    super("project", 20, "sharedPagination")
  }
}

export const SharedProjects = new SharedProjectsStore();
