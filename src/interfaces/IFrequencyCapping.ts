import { DaysType, HoursType, MinutesType } from "types/commonTypes";

interface ITimeGapBetweenMessages {
  amount: number;
  title: MinutesType | HoursType | DaysType;
}

interface IFrequency {
  perDay: number;
  perWeek: number;
  perMonth: number;
  timeGapBetween: ITimeGapBetweenMessages;
}

export interface IFrequencyCapping {
  push: IFrequency;
  sms: IFrequency;
  inApp: IFrequency;
  email: IFrequency;
  allChannels: IFrequency;
}
