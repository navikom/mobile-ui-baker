import { action, computed, observable, when } from "mobx";
import { IConversionStep } from "interfaces/IConversionStep";
import { Events } from "models/Event/EventsStore";
import { IConversion } from "interfaces/ICampaign";
import { ConversionStore } from "models/Campaign/ConversionStore";
import { ConversionTimePeriods } from "models/Constants";

export class ConversionStepStore implements IConversionStep {
  static timePeriods = ConversionTimePeriods;
  @observable enabled = false;
  @observable timeAmount = 1;
  @observable timePeriod: string = ConversionTimePeriods[1];
  @observable conversion: IConversion;
  @computed get isValidStep() {
    return true;
  }
  @computed static get systemEventsList() {
    return Events.systemEventsList || [];
  }

  constructor(conversion: IConversion = new ConversionStore()) {
    this.conversion = conversion;
    when(
      () =>
        Events.systemEventsList !== undefined &&
        Events.systemEventsList.length > 0,
      () => {
        this.conversion.setEvent(ConversionStepStore.systemEventsList[0]);
      }
    );
  }

  @action setEnabled = (enabled: boolean) => {
    this.enabled = enabled;
  };

  @action setEvent = (value: string): void => {
    this.conversion.setEvent(value);
  };

  @action setAmount = (value: number): void => {
    this.timeAmount = value;
  };

  @action setPeriod = (value: string): void => {
    this.timePeriod = value;
  };
}
