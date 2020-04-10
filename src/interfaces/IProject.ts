import { IUser } from "interfaces/IUser";
import { IImage } from "interfaces/IImage";
import AccessEnum from "enums/AccessEnum";
import ProjectEnum from "enums/ProjectEnum";
import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { Mode } from "enums/ModeEnum";
import IControl from "interfaces/IControl";

export interface IBackgroundColor {
  backgroundColor: string;
}

export interface IProjectData {
  screens: IControl[];
  mode: Mode;
  background: IBackgroundColor;
  statusBarColor: string;
  title: string;
}
export interface IProjectVersion {
  versionId: number;
  data: IProjectData;

  update(model: IProjectVersion): void;
}

export default interface IProject extends WithPrimaryKey {
  projectId: number;
  userId: number;
  owner?: IUser;
  title: string;
  type: ProjectEnum;
  access: AccessEnum;
  description?: string;
  tags?: string;
  price: number;
  createdAt: Date;
  updatedAt?: Date;
  versions: IProjectVersion[];
  buyers: IUser[];
  images?: IImage[];
  isBuyer?: boolean;
  version: IProjectVersion;

  update(data: IProject): void;
  updateVersions(versions: IProjectVersion[]): void;
  setId(id: number): void;
  toJSON(): {[key: string]: any};
}
