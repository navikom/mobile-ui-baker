import {
  AttributeType,
  IGeo,
  INumberOfSessions,
  IReachability,
  IUserData
} from "interfaces/ISegment";
import { action, observable } from "mobx";
import {
  CHANNEL_LIST,
  DateExpressions,
  EMAIL_CHANNEL,
  NumberExpressions,
  ReachabilityExpressions,
  VisitorTypeList
} from "models/Constants";
import { DateTypes, NumberTypes } from "types/expressions";
import { IDateFilter } from "interfaces/IFilters";
import { ChannelType } from "types/commonTypes";

export class UserTabStore implements IUserData {
  @observable attributes: AttributeType = null;
  @observable geo: IGeo | null = null;
  @observable lastSeen: IDateFilter | null = null;
  @observable reachability: IReachability | null = null;
  @observable visitorType: INumberOfSessions = { name: VisitorTypeList[0] };

  @action updateVisitor(name: string) {
    this.visitorType = name === VisitorTypeList[3] ?
      { name, is: NumberExpressions[10] } :
      { name };
  }

  @action updateVisitorCondition(is: NumberTypes) {
    this.visitorType = {
      name: this.visitorType.name,
      is
    };
    (NumberExpressions[0] === is || NumberExpressions[1] === is || NumberExpressions[2] === is ||
      NumberExpressions[3] === is || NumberExpressions[4] === is || NumberExpressions[5] === is) && (this.visitorType.value = 0);
    (NumberExpressions[8] === is || NumberExpressions[9] === is) && (this.visitorType.values = []);
    if (NumberExpressions[6] === is || NumberExpressions[7] === is) {
      this.visitorType.min = 0;
    }
  }

  @action updateVisitorConditionValue(value: number | number[], key: "values" | "value" | "min" | "max") {
    if (!this.visitorType[key] === undefined) return;

    // @ts-ignore
    this.visitorType[key] = value;
    key === "min" && (this.visitorType.max = this.visitorType.min! + 2);
  }

  @action updateLastSeen(is?: DateTypes) {
    if (!is || is.length === 0) {
      this.lastSeen = null;
    } else {
      this.lastSeen = {
        is
      };
      (is === DateExpressions[0] || is === DateExpressions[1]) && (this.lastSeen.date = new Date());
      if (is === DateExpressions[2]) {
        this.lastSeen.from = new Date();
        this.lastSeen.to = new Date();
      }
    }
  }

  @action updateLastSeenValue(date: Date, key: "date" | "from" | "to") {
    this.lastSeen![key] = date;
  }

  @action updateReachabilityOn(value: string) {
    if (!ReachabilityExpressions.includes(value)) {
      this.clearReachability();
      return;
    }
    const on = value === ReachabilityExpressions[0];
    this.reachability = Object.assign(this.reachability || {value: EMAIL_CHANNEL}, {on});
  }

  @action updateReachabilityValue(value: string) {
    const type = CHANNEL_LIST.find((e) => e[1] === value)![0] as ChannelType;
    this.reachability!.value = type;
  }

  @action clearReachability() {
    this.reachability = null;
  }

  @action clear() {
    this.attributes = null;
    this.geo = null;
    this.lastSeen = null;
    this.reachability = null;
    this.visitorType = { name: VisitorTypeList[0] };
  }
}
