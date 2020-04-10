import ProjectsStore from "models/Project/ProjectsStore";

export class AdminComponentsStore extends ProjectsStore {

  constructor() {
    super("component", 20, "adminPagination")
  }
}

export const AdminComponents = new AdminComponentsStore();
