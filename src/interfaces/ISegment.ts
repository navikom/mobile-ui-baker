import { WithPrimaryKey } from "interfaces/WithPrimaryKey";
import { IAndroidDevice, IIOSDevice } from "interfaces/ISegmentDevice";
import { ChannelType } from "types/commonTypes";
import {
  AndType,
  OrType,
  NumberTypes,
  DateTypes,
  AtLeastOnceType,
  OnceType
} from "types/expressions";
import { IDateFilter, INumberFilter, IStringFilter } from "interfaces/IFilters";
import { IRegion } from "interfaces/IRegion";

export interface IVisitor {
  name: string;
}

export interface INumberOfSessions extends INumberFilter, IVisitor {}

export interface IGeo {
  include: IRegion[] | null;
  exclude: IRegion[] | null;
}

interface IAttribute {
  property: string;
  expression: IStringFilter | INumberFilter | IDateFilter;
}

export interface IReachability {
  on: boolean;
  value: ChannelType;
}

export type AttributeType =
  | IAttribute
  | (IAttribute | AndType | OrType)[]
  | null;

export interface IUserData {
  visitorType: INumberOfSessions;
  lastSeen: IDateFilter | null;
  geo: IGeo | null;
  attributes: AttributeType;
  reachability: IReachability | null;

  updateVisitor(name: string): void;
  updateVisitorCondition(is: NumberTypes): void;
  updateVisitorConditionValue(
    value: number | number[],
    key: "values" | "value" | "min" | "max"
  ): void;
  updateLastSeen(is?: DateTypes): void;
  updateLastSeenValue(date: Date, key: "date" | "from" | "to"): void;
  updateReachabilityOn(value: string): void;
  updateReachabilityValue(value: string): void;
  clearReachability(): void;
  clear(): void;
}

export interface IOccurs {
  is?: AtLeastOnceType | OnceType | NumberTypes;
  value?: number | boolean | number[];
  min?: number;
  max?: number;
}

interface IBehaviorEvent {
  name: string;
  occurs: IOccurs;
}

type BehaviorType =
  | IBehaviorEvent
  | (IBehaviorEvent | AndType | OrType)[]
  | null;

export interface IBehavior {
  usersWhoDidEvents: BehaviorType;
  and: boolean;
  usersWhoDidNotDoEvents: BehaviorType;
}

export interface ITechnology {
  android?: IAndroidDevice | null;
  ios?: IIOSDevice | null;
}

export interface ISegment extends WithPrimaryKey {
  segmentId: number;
  name: string;
  pk: string;
  userData?: IUserData;
  behavior?: IBehavior;
  technology?: ITechnology;
  createdAt?: Date;
  updatedAt?: Date;

  toJSON(): {[key: string]: any};
}
