import {action, observable} from "mobx";

// interfaces
import { ITriggerRun } from "interfaces/ICampaign";
import { RunType } from "types/commonTypes";

// models
import { TRIGGER_RUN_TYPE } from "models/Constants";

export class TriggerRunStore implements ITriggerRun {
  readonly type: RunType = TRIGGER_RUN_TYPE;

  @observable eventName?: string;
  @observable sendAsOccurs = true;
  @observable waitFor?: number;
  @observable startDate?: Date;
  @observable endDate: Date | null = null;

  @action update(model: ITriggerRun) {
    Object.assign(this, model);
  }
}
