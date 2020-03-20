import {observable} from "mobx";

// interfaces
import {IRecurringRun} from "interfaces/ICampaign";
import {RunType} from "types/commonTypes";

// models
import {PeriodAmount, RECURRING_RUN_TYPE} from "models/Constants";

export class RecurringRunStore implements IRecurringRun {
 readonly type: RunType = RECURRING_RUN_TYPE;
 @observable endDate: Date | null = null;
 @observable reoccur: number = PeriodAmount[2];
 @observable startDate?: Date;

 update(model: IRecurringRun): void {
  Object.assign(this, model);
 }
}
