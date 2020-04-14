import { action } from "mobx";
import { ApiMethodTypes, Pagination, RequestMethodTypes } from "models/Pagination";
import IProject from "interfaces/IProject";
import ProjectStore from "models/Project/ProjectStore";
import { api, Apis } from "api";

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
    const project = this.getOrCreate(data).update(data).updateVersions(data.versions);
    return project;
  }

  static async save(project: IProject) {
    const method: ApiMethodTypes = ["control", "component", "project"][project.type] as ApiMethodTypes;
    if (!project.projectId) {
      const data = await api(Apis.Main)[method].add(project.JSON);
      project.update(data).updateVersions(data.versions).setId(data.projectId);
    } else {
      const data = await api(Apis.Main)[method].update(project.projectId, project.JSON);
      project.update(data).updateVersions(data.versions);
    }
  }

  static getOrCreate(data: IProject): IProject {
    if (!this.has(data.projectId)) {
      this.items.push(ProjectStore.from(data).update(data).setId(data.projectId).updateVersions(data.versions));

    }

    return this.getById(data.projectId) as IProject;
  }
}
