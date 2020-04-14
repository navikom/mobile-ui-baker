import ProjectsStore from "models/Project/ProjectsStore";
import { api, Apis } from "api";

export class ControlsStore extends ProjectsStore {

  constructor() {
    super("control", 100, "sharedPagination")
  }

  async fetchItems() {
    const response = await api(Apis.Main).control.list();
    this.push(response);
    return true;
  }
}

export const SharedControls = new ControlsStore();
