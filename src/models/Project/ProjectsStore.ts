import { action } from "mobx";
import { ApiMethodTypes, Pagination, RequestMethodTypes } from "models/Pagination";
import IProject from "interfaces/IProject";
import ProjectStore from "models/Project/ProjectStore";
import { api, Apis } from "api";
import { App } from "models/App";
import { ErrorHandler } from "utils/ErrorHandler";
import { ERROR_USER_DID_NOT_LOGIN } from "models/Constants";

export default class ProjectsStore extends Pagination<IProject> {

  static items: IProject[] = [];

  constructor(apiMethod: ApiMethodTypes, size: number, requestMethod: RequestMethodTypes) {
    super("projectId", apiMethod, size, requestMethod);
  }

  @action push(data: IProject[]) {
    let l = data.length;
    while (l--) {
      if (!this.has(data[l].userId)) {
        this.items.push(ProjectsStore.getOrCreate(data[l]));
      }
    }
  }

  @action getOrCreate(data: IProject): IProject {
    if (!this.has(data.projectId)) {
      this.push([data]);
    }
    return this.getById(data.projectId) as IProject;
  }

  //######### static ###########//

  static getById(id: number) {
    return this.items.find((e) => e.projectId === id);
  }

  static has(id?: number): boolean {
    return this.items.some((e) => id === e.projectId);
  }

  static async fetchFullData(projectId: number) {
    const data = await api(Apis.Main).project.fullData(projectId);
    const project = this.getOrCreate(data);
    project.update(data);
    return project;
  }

  static save(project: IProject) {
    if (!App.loggedIn) {
      throw new ErrorHandler(ERROR_USER_DID_NOT_LOGIN);
    }
    const method: ApiMethodTypes = ["project", "control", "component"][project.type] as ApiMethodTypes;
    if (!project.projectId) {
      api(Apis.Main)[method].add(project.toJSON()).then(data => project.update(data));
    }
  }

  static getOrCreate(data: IProject): IProject {
    if (!this.has(data.projectId)) {
      this.items.push(ProjectStore.from(data));
    }
    return this.getById(data.projectId) as IProject;
  }
}
