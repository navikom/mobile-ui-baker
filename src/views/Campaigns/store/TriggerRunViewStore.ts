import {action, computed, observable} from "mobx";

// interfaces
import { ITriggerRun } from "interfaces/ICampaign";
import { ITriggerRunView } from "interfaces/IRunTypeView";

// models
import { TriggerRunStore } from "models/Campaign/TriggerRunStore";
import {Events} from "models/Event/EventsStore";
import {PeriodAmount, TimePeriods} from "models/Constants";

export class TriggerRunViewStore implements ITriggerRunView {
  static timePeriods = TimePeriods;
  @observable model: ITriggerRun = new TriggerRunStore();
  @observable timeAmount = 1;
  @observable timePeriod: string = TimePeriods[1];
  @observable now = true;
  @observable never = true;

  @computed static get systemEventsList() {
    return Events.systemEventsList || [];
  }

  @action setEventName(name: string) {
    this.model.update({eventName: name} as ITriggerRun);
  }

  @action switchSendAsOccurs() {
    this.model.update({sendAsOccurs: !this.model.sendAsOccurs} as ITriggerRun);
    this.setWaitFor();
  }

  @action setAmount(amount: number): void {
    this.timeAmount = Math.max(1, amount);
    this.setWaitFor();
  }

  @action setWaitFor() {
    const waitFor = this.timeAmount * PeriodAmount[this.timePeriod];
    this.model.update({waitFor} as ITriggerRun);
  }

  @action onTimeChange(date: Date, start: boolean) {
    if(start) {
      this.model.update({startDate: date} as ITriggerRun);
    } else {
      this.model.update({endDate: date} as ITriggerRun);
    }
  }

  @action switchNow() {
    this.now = !this.now;
  }

  @action switchNever() {
    this.never = !this.never;
  }

  @action setPeriod(period: string): void {
    this.timePeriod = period;
    this.setWaitFor();
  }
}
