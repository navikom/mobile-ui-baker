import { WithPrimaryKey } from "interfaces/WithPrimaryKey";

export interface IRegion extends WithPrimaryKey {
  regionId: number;
  country: string;
  region: string;
  city: string;
  lg?: number;
  lt?: number;
  ip?: string;
  timezone?: string;
  plainData: string[][];
}
