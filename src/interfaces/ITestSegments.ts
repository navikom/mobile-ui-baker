import { ITestSegment } from "interfaces/ITestStep";

export interface ITestSegments {
  items: ITestSegment[];

  has(id: number): boolean;
  push(item: ITestSegment[]): void;
  removeItem(item: ITestSegment): void;
  getOrCreate(items: ITestSegment): ITestSegment;
  saveChanges(item: ITestSegment): Promise<void>;
}
