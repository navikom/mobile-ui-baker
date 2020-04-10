import ProjectsStore from "models/Project/ProjectsStore";

export class ControlsStore extends ProjectsStore {

  constructor() {
    super("control", 20, "pagination")
  }

}

export const SharedControls = new ControlsStore();
