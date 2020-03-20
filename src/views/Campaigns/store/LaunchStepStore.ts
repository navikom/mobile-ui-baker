import { ILaunchStep } from "interfaces/ILaunchStep";
import { computed } from "mobx";

export class LaunchStepStore implements ILaunchStep {
  @computed get isValidStep(): boolean {
    return true;
  }
}
