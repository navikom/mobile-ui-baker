import { IApp } from "interfaces/IApp";

export interface IACategory {
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  name: string;
  apps: IApp[];
}
