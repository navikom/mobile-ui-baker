import { action, computed, IObservableArray, observable } from "mobx";
import IProject, { IProjectVersion } from "interfaces/IProject";
import AccessEnum from "enums/AccessEnum";
import ProjectEnum from "enums/ProjectEnum";
import { IUser } from "interfaces/IUser";
import { IImage } from "interfaces/IImage";
import ProjectVersionStore from "models/Project/ProjectVersionStore";
import IControl from "interfaces/IControl";

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
  @observable versions: IObservableArray<IProjectVersion> = observable([]);
  type: ProjectEnum;
  updatedAt?: Date;
  userId: number;

  @computed get version() {
    return this.versions[0];
  }

  get JSON() {
    return {
      title: this.title,
      versionId: this.version.versionId,
      data: this.version.data
    } as {title: string, data: IControl, versionId: number}
  }

  constructor(type: ProjectEnum, userId: number) {
    this.type = type;
    this.title = ["Control", "Component", "Project"][type];
    this.userId = userId;
  }

  @action update(model: IProject) {
    model.createdAt && (this.createdAt = model.createdAt);
    model.updatedAt && (this.updatedAt = model.updatedAt);
    model.isBuyer !== undefined && (this.isBuyer = model.isBuyer);
    model.description && (this.description = model.description);
    model.images && (this.images.replace(model.images));
    model.price !== undefined && (this.price = model.price);
    model.tags && (this.tags = model.tags);
    model.title && (this.title = model.title);
    model.userId && (this.userId = model.userId);
    return this;
  }

  @action updateVersions(versions:IProjectVersion[]) {
    this.versions.replace(versions.map(v => ProjectVersionStore.from(v)));
    return this;
  }

  setId(id: number) {
    this.projectId = id;
    return this;
  }

  static from(model: IProject) {
    return new ProjectStore(model.type, model.userId);
  }

  static createEmpty(type: ProjectEnum) {
    return this.from({type, userId: 0} as IProject).updateVersions([ProjectVersionStore.createEmpty()]);
  }

}
