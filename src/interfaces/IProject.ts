import { IUser } from "interfaces/IUser";
import { IImage } from "interfaces/IImage";
import AccessEnum from "enums/AccessEnum";
import ProjectEnum from "enums/ProjectEnum";
import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { Mode } from "enums/ModeEnum";
import IControl from "interfaces/IControl";

export interface IProjectJSON {
  title: string;
  description?: string;
  price: number;
  data: IProjectData | IControl;
  versionId: number;
}

export interface IBackgroundColor {
  backgroundColor: string;
}

export interface IProjectData {
  screens: IControl[];
  navigation: (string | number)[];
  mode: Mode;
  background: IBackgroundColor;
  statusBarEnabled: boolean;
  statusBarColor: string;
  title: string;
  ios: boolean;
  portrait: boolean;
  projectId: number;
}

export interface IProjectVersion {
  versionId: number;
  data: IProjectData | IControl;

  update(model: IProjectVersion | IControl): void;
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
  hasPreview?: boolean;
  preview?: string;
  previewSize?: {width?: number; height?: number};
  JSON: {title: string; description?: string; price: number; data: IProjectData | IControl; versionId: number};

  update(data: IProject): IProject;
  updateVersions(versions: IProjectVersion[]): IProject;
  setId(id: number): IProject;
}
