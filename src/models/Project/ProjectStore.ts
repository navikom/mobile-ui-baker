import { action, computed, IObservableArray, observable } from "mobx";
import IProject, { IProjectVersion } from "interfaces/IProject";
import AccessEnum from "enums/AccessEnum";
import ProjectEnum from "enums/ProjectEnum";
import { IUser } from "interfaces/IUser";
import { IImage } from "interfaces/IImage";
import ProjectVersionStore from "models/Project/ProjectVersionStore";

export default class ProjectStore implements IProject {
  createdAt: Date = new Date();
  isBuyer: boolean = false;
  owner?: IUser;
  @observable access: AccessEnum = AccessEnum.OWNER;
  @observable buyers: IObservableArray<IUser> = observable([]);
  @observable description?: string;
  @observable images: IObservableArray<IImage> = observable([]);
  @observable price: number = 0;
  @observable projectId: number = 0;
  @observable tags?: string;
  @observable title: string = "Project";
  @observable versions: IObservableArray<IProjectVersion>;
  type: ProjectEnum;
  updatedAt?: Date;
  userId: number;

  @computed get version() {
    return this.versions[0];
  }

  constructor(type: ProjectEnum, userId: number, versions: IProjectVersion[]) {
    this.type = type;
    this.title = ["Control", "Component", "Project"][type];
    this.userId = userId;
    this.versions = observable(versions);
  }

  @action update(model: IProject): void {
    model.createdAt && (this.createdAt = model.createdAt);
    model.updatedAt && (this.updatedAt = model.updatedAt);
    model.isBuyer !== undefined && (this.isBuyer = model.isBuyer);
    model.description && (this.description = model.description);
    model.images && (this.images.replace(model.images));
    model.price !== undefined && (this.price = model.price);
    model.tags && (this.tags = model.tags);
    model.title && (this.title = model.title);
    model.userId && (this.userId = model.userId);
  }

  @action updateVersions(versions:IProjectVersion[]) {
    this.versions.replace(versions);
  }

  setId(id: number) {
    this.projectId = id;
  }

  toJSON(): { [p: string]: any } {
    return {
      title: this.title,
      data: this.version.data
    }
  }

  static from(model: IProject) {
    const versions = model.versions ? model.versions : [ProjectVersionStore.from({versionId: 0, data: {}} as IProjectVersion)];
    const project = new ProjectStore(model.type, model.userId, versions);
    project.update(model);
    return project;
  }

  static createEmpty(type: ProjectEnum) {
    return this.from({type, userId: 0} as IProject);
  }

}
