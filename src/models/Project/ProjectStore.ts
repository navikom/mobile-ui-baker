import { action, computed, IObservableArray, observable } from "mobx";
import IProject, { IProjectJSON, IProjectVersion } from "interfaces/IProject";
import AccessEnum from "enums/AccessEnum";
import ProjectEnum from "enums/ProjectEnum";
import { IUser } from "interfaces/IUser";
import { IImage } from "interfaces/IImage";
import ProjectVersionStore from "models/Project/ProjectVersionStore";
import { ImageStore } from "models/Image/ImageStore";
import { Users } from "models/User/UsersStore";

export default class ProjectStore implements IProject {
  createdAt: Date = new Date();
  isBuyer = false;
  owner?: IUser;
  @observable access: AccessEnum = AccessEnum.OWNER;
  @observable buyers: IObservableArray<IUser> = observable([]);
  @observable description?: string;
  @observable images: IObservableArray<IImage> = observable([]);
  @observable price = 0;
  @observable projectId = 0;
  @observable tags?: string;
  @observable title = "Project";
  @observable versions: IObservableArray<IProjectVersion> = observable([]);
  type: ProjectEnum;
  updatedAt?: Date;
  userId: number;

  @computed get version() {
    return this.versions[0];
  }

  @computed get preview() {
    return this.images[0] && this.images[0].path(this.userId);
  }

  @computed get previewSize() {
    const image = this.images[0];
    return image && {width: (image.width || 1) * .5, height: (image.height || 1) * .5};
  }

  get JSON() {
    const object: IProjectJSON = {
      price: this.price,
      title: this.title,
      versionId: this.version.versionId,
      data: this.version.data
    };
    this.description && (object.description = this.description);
    return object;
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
    model.images &&
    (this.images.replace(
      model.images.map(image => ImageStore.from(image))
        .sort((im1, im2) => im1.ProjectsImages!.sorting - im2.ProjectsImages!.sorting)
      )
    );
    model.price !== undefined && (this.price = model.price);
    model.tags && (this.tags = model.tags);
    model.title && (this.title = model.title);
    model.userId && (this.userId = model.userId);
    model.owner && (this.owner = Users.getOrCreate({...model.owner, userId: this.userId}));
    return this;
  }

  @action updateVersions(versions: IProjectVersion[]) {
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