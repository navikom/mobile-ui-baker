import { IOneTimeRun, IRecurringRun, ITriggerRun } from "interfaces/ICampaign";

export interface IOneTimeRunView {
  model: IOneTimeRun;

  switchNow(): void;
  setTimeZone(value: string): void;
  setTimeDate(timeDate: Date): void;
  timeZone: string;
}

export interface ITriggerRunView {
  model: ITriggerRun;

  timeAmount: number;
  timePeriod: string;
  now: boolean;
  never: boolean;
  setEventName(name: string): void;
  switchSendAsOccurs(): void;
  setAmount(amount: number): void;
  setPeriod(period: string): void;
  switchNow(): void;
  switchNever(): void;
  onTimeChange(date: Date, start: boolean): void;
}

export interface IRecurringRunView {
  model: IRecurringRun;

  reoccurTime?: Date;
  timePeriod: string;
  now: boolean;
  never: boolean;
  secondSelectOptions?: string[];
  secondOption?: string;
  setReoccurs(): void;
  setPeriod(period: string): void;
  switchNow(): void;
  switchNever(): void;
  onTimeChange(date: Date, start: boolean): void;
  setReoccurTime(time: Date): void;
  setSecondOption(value: string): void;
}

export type IRunTypeView =
  | IOneTimeRunView
  | ITriggerRunView
  | IRecurringRunView;
