import { MobileVariantType } from "interfaces/IVariant";

export type EmailType = 1;
export type SmsType = 2;
export type InAppType = 3;
export type PushType = 4;
export type MinutesType = "minutes";
export type HoursType = "hours";
export type DaysType = "days";
export type MaleType = "Male";
export type FemaleType = "Female";
export type AllType = "All";
type OneTimeRunType = 1;
type TriggerRunType = 2;
type RecurringRunType = 3;
export type RunType = OneTimeRunType | TriggerRunType | RecurringRunType;
export type ChannelType = EmailType | SmsType | InAppType | PushType;

export type GenderExpressionTypesArray = [MaleType, FemaleType];
export type SMSChannelComponentType = {
  ios: boolean;
  variant: MobileVariantType;
};
