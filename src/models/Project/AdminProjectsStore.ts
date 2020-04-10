import ProjectsStore from "models/Project/ProjectsStore";

export class AdminProjectsStore extends ProjectsStore {

  constructor() {
    super("project", 20, "adminPagination")
  }
}

export const AdminComponents = new AdminProjectsStore();
