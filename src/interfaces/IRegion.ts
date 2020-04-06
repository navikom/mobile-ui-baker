import { WithPrimaryKey } from "interfaces/WithPrimaryKey";

export interface IIUsersRegions {
  createdAt: Date;
}

export interface IRegion extends WithPrimaryKey {
  regionId: number;
  country: string;
  region: string;
  city: string;
  createdAt: Date;
  lg?: number;
  lt?: number;
  ip?: string;
  IUsersRegions?: IIUsersRegions;
  timezone?: string;
  plainData: string[][];
}
