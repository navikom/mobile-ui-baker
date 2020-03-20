import {action, computed, observable} from "mobx";

// interfaces
import {IOneTimeRun} from "interfaces/ICampaign";
import {IOneTimeRunView} from "interfaces/IRunTypeView";

// models
import {OneTimeRunStore} from "models/Campaign/OneTimeRunStore";
import {APP_TIME_ZONE, USERS_TIME_ZONE} from "models/Constants";

export class OneTimeRunViewStore implements IOneTimeRunView {
 static timeZones = [USERS_TIME_ZONE, APP_TIME_ZONE];
 @observable model: IOneTimeRun = new OneTimeRunStore();

 @computed get timeZone() {
  return this.model.userTimezone ? USERS_TIME_ZONE : APP_TIME_ZONE;
 }

 @action switchNow() {
  this.model.update({now: !this.model.now} as IOneTimeRun);
 }

 @action setTimeZone(value: string) {
  this.model.update({
   userTimezone: value === USERS_TIME_ZONE,
   appTimezone: value === APP_TIME_ZONE
  } as IOneTimeRun);
 }

 @action setTimeDate(timeDate: Date) {
  this.model.update({later: timeDate} as IOneTimeRun);
 }
}
