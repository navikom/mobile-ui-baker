import {action, observable} from "mobx";

// interfaces
import {IOneTimeRun} from "interfaces/ICampaign";
import {RunType} from "types/commonTypes";

// models
import {ONE_TIME_RUN_TYPE} from "models/Constants";

export class OneTimeRunStore implements IOneTimeRun {
 type: RunType = ONE_TIME_RUN_TYPE;

 @observable appTimezone = true;
 @observable later?: Date;
 @observable now = true;
 @observable userTimezone = false;

 @action update(model: IOneTimeRun) {
  Object.assign(this, model);
 }
}
