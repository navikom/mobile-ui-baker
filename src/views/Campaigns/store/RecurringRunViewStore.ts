import {action, observable} from "mobx";

// interfaces
import {IRecurringRun} from "interfaces/ICampaign";
import {IRecurringRunView} from "interfaces/IRunTypeView";

// models
import {RecurringRunStore} from "models/Campaign/RecurringRunStore";
import {DaysOfWeek, OccurrenceTimePeriods, PeriodAmount} from "models/Constants";
import {closerDay, closerMonthDay, closerWeekDay} from "utils/convertDate";

const monthlyDays = {
 "1st": 1, "2nd": 2, "3rd": 3, "4th": 4, "5th": 5, "6th": 6, "7th": 7, "8th": 8, "9th": 9, "10th": 10,
 "11th": 11, "12th": 12, "13th": 13, "14th": 14, "15th": 15, "16th": 16, "17th": 17,
 "18th": 18, "19th": 19, "20th": 20, "21st": 21, "22nd": 22, "23rd": 23, "24th": 24, "25th": 25,
 "26th": 26, "27th": 27, "28th": 28, "29th": 29, "30th": 30, "31th": 31
};

export class RecurringRunViewStore implements IRecurringRunView {
 static timePeriods = new Map([
  [OccurrenceTimePeriods[0], undefined],
  [OccurrenceTimePeriods[1], DaysOfWeek],
  [OccurrenceTimePeriods[2], Object.keys(monthlyDays)]
 ]);

 @observable model: IRecurringRun = new RecurringRunStore();
 @observable never = true;
 @observable now = true;
 @observable timePeriod: string = OccurrenceTimePeriods[0];
 @observable secondSelectOptions?: string[];
 @observable secondOption?: string;
 @observable reoccurTime?: Date;

 static get timePeriodNames() {
  return Array.from(this.timePeriods.keys());
 }

 constructor() {
   this.setPeriod(OccurrenceTimePeriods[1]);
 }

 @action onTimeChange(date: Date, start: boolean): void {
  if (start) {
   this.model.update({startDate: date} as IRecurringRun);
  } else {
   this.model.update({endDate: date} as IRecurringRun);
  }
 }

 @action setReoccurs(): void {
  const reoccur = PeriodAmount[`${this.timePeriod}s`];
  const hours = this.reoccurTime!.getHours();
  const minutes = this.reoccurTime!.getMinutes();
  let date = new Date();
  if (this.timePeriod === OccurrenceTimePeriods[0]) {
    date = closerDay(hours, minutes);
  } else if (this.timePeriod === OccurrenceTimePeriods[1]) {
    date = closerWeekDay(DaysOfWeek.indexOf(this.secondOption as string) + 1, hours, minutes);
  } else if (this.timePeriod === OccurrenceTimePeriods[2]) {
   date = closerMonthDay(monthlyDays[this.secondOption as keyof typeof monthlyDays], hours, minutes);
  }
  this.onTimeChange(date, true);
  this.model.update({reoccur} as IRecurringRun);
 }

 @action switchNever(): void {
  this.never = !this.never;
 }

 @action switchNow(): void {
  this.now = !this.now;
 }

 @action setReoccurTime(time: Date): void {
  this.reoccurTime = time;
  this.setReoccurs();
 }

 @action setPeriod(period: string): void {
  this.timePeriod = period;
  this.secondSelectOptions = RecurringRunViewStore.timePeriods.get(period);
  this.setSecondOption(this.secondSelectOptions && this.secondSelectOptions[0]);

 }

 @action setSecondOption(value?: string): void {
  this.secondOption = value;
  this.setReoccurTime(this.reoccurTime || new Date());
 }

}
