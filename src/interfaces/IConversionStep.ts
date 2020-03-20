import { IStep } from "interfaces/IStep";
import { IConversion } from "interfaces/ICampaign";

export interface IConversionStep extends IStep {
  enabled: boolean;
  conversion: IConversion;
  timePeriod: string;
  timeAmount: number;
  setPeriod(value: string): void;
  setAmount(value: number): void;
  setEnabled(enabled: boolean): void;
  setEvent(value: string): void;
}
