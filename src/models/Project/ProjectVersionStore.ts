import { IProjectData, IProjectVersion } from "interfaces/IProject";
import { action, observable } from "mobx";
import IControl from "interfaces/IControl";

export default class ProjectVersionStore implements IProjectVersion {
  @observable data: IProjectData | IControl;
  versionId: number;

  constructor(data: IProjectData | IControl, versionId: number) {
    this.data = data;
    this.versionId = versionId;
  }

  @action update(model: IProjectVersion) {
    Object.assign(this, model);
  }

  static from(model: IProjectVersion) {
    return new ProjectVersionStore(model.data, model.versionId);
  }

  static createEmpty() {
    return ProjectVersionStore.from({ data: {}, versionId: 0 } as IProjectVersion);
  }
}
