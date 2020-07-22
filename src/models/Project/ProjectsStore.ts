import { action, computed } from "mobx";
import { ApiMethodTypes, Pagination, RequestMethodTypes } from "models/Pagination";
import IProject, { IProjectJSON } from "interfaces/IProject";
import ProjectStore from "models/Project/ProjectStore";
import { api, Apis } from "api";
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { Project } from "api/MainApi/Api";
import { ROUTE_EDITOR, ROUTE_SCREENS } from 'models/Constants';
import { App } from "models/App";
import AccessEnum from '../../enums/AccessEnum';

export const Access = {
  [AccessEnum.OWNER]: 'owner',
  [AccessEnum.READ_BY_LINK]: 'read by link',
  [AccessEnum.EDIT_BY_LINK]: 'edit by link',
  [AccessEnum.SHARED]: 'shared',
}

export default class ProjectsStore extends Pagination<IProject> {

  static items: IProject[] = [];

  @computed get projectTableData() {
    return this.tableData((e: IProject) =>
      [
        e.projectId,
        Dictionary.timeDateString(e.createdAt),
        e.title,
        Dictionary.value(Access[e.access])]
    );
  }

  @computed get previewList() {
    return this.items.map(project => ({
      id: project.projectId,
      title: project.title,
      description: project.description,
      img: project.previews,
      author: project.owner ? Dictionary.defValue(DictionaryService.keys.muiditorTeam) : App.user!.fullName,
      route: ROUTE_SCREENS + "/" + project.projectId}));
  }

  constructor(apiMethod: ApiMethodTypes, size: number, requestMethod: RequestMethodTypes) {
    super("projectId", apiMethod, size, requestMethod);
  }

  @action push(data: IProject[]) {
    let l = data.length;
    while (l--) {
      if (!this.has(data[l].projectId)) {
        this.items.push(ProjectsStore.getOrCreate(data[l]));
      }
    }
  }

  @action async delete(project: IProject) {
    await ProjectsStore.delete(project);
    this.items.splice(this.items.indexOf(project), 1);
  }

  //######### static ###########//

  static getById(id: number) {
    return this.items.find((e) => e.projectId === id);
  }

  static has(id?: number): boolean {
    return this.items.some((e) => id === e.projectId);
  }

  static async fetchFullData(projectId: number, viewer?: boolean) {
    const data = await api(Apis.Main).project[viewer ? 'fullDataForViewer' : 'fullData'](projectId);
    const project = this.getOrCreate(data).update(data).updateVersions(data.versions);
    return project;
  }

  static async setAccess(project: IProject, access: AccessEnum) {
    await api(Apis.Main).project.access(project.projectId, access);
    project.update({access} as IProject);
  }

  static async save(project: IProject, files?: any) {
    const method: ApiMethodTypes = ["control", "component", "project"][project.type] as ApiMethodTypes;
    if (!project.projectId) {
      let data;
      if(files) {
        data = await this.addWithImages(project.JSON, method, files);
      } else {
        data = await api(Apis.Main)[method].add(project.JSON);
      }
      project.update(data).updateVersions(data.versions).setId(data.projectId);
    } else {
      let data;
      if(files) {
        project.images &&
        project.images.forEach(
          async (image) => await (api(Apis.Main)[method] as Project).deleteImage(project.projectId, image.imageId)
        );
        data = await this.updateWithImages(project.projectId, project.JSON, method, files);
      } else {
        data = await api(Apis.Main)[method].update(project.projectId, this.fillFormData(project.JSON));
      }
      project.update(data).updateVersions(data.versions);
    }
  }

  static fillFormData(project: IProjectJSON, files?: any) {
    const formData = new FormData();
    project.description && formData.append("description", project.description);
    project.title && formData.append("title", project.title);
    (project.price !== undefined && project.price !== null) && formData.append("price", project.price.toString());
    !!project.data && formData.append("data", JSON.stringify(project.data));
    formData.append("versionId", project.versionId.toString());
    files && files.forEach((file: any, key: number) => formData.append("file", file));
    return formData;
  }

  static async addWithImages(project: IProjectJSON, method: ApiMethodTypes, files: any) {
    return await api(Apis.Main)[method].addWithImages(this.fillFormData(project, files));
  }

  static async updateWithImages(id: number, project: IProjectJSON, method: ApiMethodTypes, files: any) {
    return await api(Apis.Main)[method].update(id, this.fillFormData(project, files));
  }

  static async saveWithImages(project: IProject, files: any) {
    const method: ApiMethodTypes = ["control", "component", "project"][project.type] as ApiMethodTypes;
    const formData = new FormData();
    project.description && formData.append("description", project.description);
    project.title && formData.append("title", project.title);
    (project.price !== undefined && project.price !== null) && formData.append("price", project.price.toString());
    (files || []).forEach((file: any, key: number) => formData.append("file", file));
    const data = await api(Apis.Main)[method].update(project.projectId, formData);
    project.update(data);
  }

  static async delete(project: IProject) {
    const method: ApiMethodTypes = ["control", "component", "project"][project.type] as ApiMethodTypes;
    await api(Apis.Main)[method].delete(project.projectId);
    this.items.splice(this.items.indexOf(project), 1);
  }

  static getOrCreate(data: IProject): IProject {
    if (!this.has(data.projectId)) {
      this.items.push(ProjectStore.from(data).update(data).setId(data.projectId).updateVersions(data.versions || []));

    }

    return this.getById(data.projectId) as IProject;
  }
}
