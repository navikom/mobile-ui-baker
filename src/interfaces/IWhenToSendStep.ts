import { RunType } from "types/commonTypes";
import { IStep } from "interfaces/IStep";
import { IRunTypeView } from "interfaces/IRunTypeView";

export interface IWhenToSendStep extends IStep {
  currentRunType: RunType;
  runStore: IRunTypeView;

  setCurrentRunType(currentRunType: RunType): void;
}
