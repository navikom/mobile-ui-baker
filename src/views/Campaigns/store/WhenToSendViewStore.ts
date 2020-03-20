import { action, computed, observable } from "mobx";

// models
import {
  ONE_TIME_RUN,
  ONE_TIME_RUN_TYPE,
  RECURRING_RUN,
  RECURRING_RUN_TYPE,
  TRIGGER_RUN,
  TRIGGER_RUN_TYPE
} from "models/Constants";

// interfaces
import { RunType } from "types/commonTypes";
import { IWhenToSendStep } from "interfaces/IWhenToSendStep";
import {
  IOneTimeRunView,
  IRecurringRunView,
  IRunTypeView,
  ITriggerRunView
} from "interfaces/IRunTypeView";

// stores
import { OneTimeRunViewStore } from "views/Campaigns/store/OneTimeRunViewStore";
import { TriggerRunViewStore } from "views/Campaigns/store/TriggerRunViewStore";
import { RecurringRunViewStore } from "views/Campaigns/store/RecurringRunViewStore";

export class WhenToSendViewStore implements IWhenToSendStep {
  static runTypes = [
    [ONE_TIME_RUN_TYPE, ONE_TIME_RUN],
    [TRIGGER_RUN_TYPE, TRIGGER_RUN],
    [RECURRING_RUN_TYPE, RECURRING_RUN]
  ];

  @observable currentRunType: RunType = ONE_TIME_RUN_TYPE;
  @observable oneTimeRunViewStore: IOneTimeRunView;
  @observable triggerRunViewStore: ITriggerRunView;
  @observable recurringRunViewStore: IRecurringRunView;
  @observable runStore: IRunTypeView;

  @computed get isValidStep() {
    return true;
  }

  constructor() {
    this.oneTimeRunViewStore = new OneTimeRunViewStore();
    this.triggerRunViewStore = new TriggerRunViewStore();
    this.recurringRunViewStore = new RecurringRunViewStore();
    this.runStore = this.oneTimeRunViewStore;
  }

  @action setCurrentRunType(currentRunType: RunType) {
    this.currentRunType = currentRunType;
    this.runStore = [
      this.oneTimeRunViewStore,
      this.triggerRunViewStore,
      this.recurringRunViewStore
    ][this.currentRunType - 1];
  }
}
