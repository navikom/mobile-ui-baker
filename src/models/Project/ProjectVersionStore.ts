import { IProjectData, IProjectVersion } from "interfaces/IProject";
import { action, observable } from "mobx";

export default class ProjectVersionStore implements IProjectVersion {
  @observable data: IProjectData;
  versionId: number;

  constructor(data: IProjectData, versionId: number) {
    this.data = data;
    this.versionId = versionId;
  }

  @action update(model: IProjectVersion) {
    Object.assign(this, model);
  }

  static from(model: IProjectVersion) {
    return new ProjectVersionStore(model.data, model.versionId);
  }
}
