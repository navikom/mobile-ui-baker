import ProjectsStore from "models/Project/ProjectsStore";

export class OwnProjectsStore extends ProjectsStore {

  constructor() {
    super("project", 20, "pagination")
  }

}

export const OwnProjects = new OwnProjectsStore();
