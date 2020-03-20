import { action, computed, observable } from "mobx";
import { AndType, ExpressionValueType, OrType } from "types/expressions";
import { AND, OccurExpressionsMap, OR } from "models/Constants";
import { ISegmentEventView } from "interfaces/ISegmentEventView";
import { Events } from "models/Event/EventsStore";
import { AbstractViewStore } from "views/Segments/store/AbstractViewStore";

export class SegmentEventViewStore extends AbstractViewStore implements ISegmentEventView {
  static occurExpressions: Map<string, Map<string, ExpressionValueType | undefined> | undefined> = OccurExpressionsMap;
  @observable static readonly didEvents = observable<ISegmentEventView>([]);
  @observable static readonly didNotDoEvents = observable<ISegmentEventView>([]);
  @observable static readonly didEventsAndOr = observable<AndType | OrType>([]);
  @observable static readonly didNotDoEventsAndOr = observable<AndType | OrType>([]);
  @observable static and = true;

  @observable currentEventName?: string;
  @observable currentExpression?: string;
  @observable currentOccurExpression?: string;

  @action setEventName(name: string): void {
    this.clear();
    this.currentEventName = name;
    const expression = Array.from(SegmentEventViewStore.occurExpressions.keys());
    this.setOccurExpression(expression[0]);
  }

  @action setOccurExpression(value: string) {
    this.clearExpressionData();
    this.currentOccurExpression = value;
    const expressions = SegmentEventViewStore.occurExpressions.get(value);
    if(expressions) {
      this.expressions = Array.from(expressions!.keys());
      this.setRestExpression();
    }
  }

  @action setRestExpression(value?: string): void {
    if(!this.currentOccurExpression) {
      return;
    }
    this.currentExpression = value || this.expressions![0];
    const expression = SegmentEventViewStore.occurExpressions.get(this.currentOccurExpression)!.get(this.currentExpression);
    this.initExpression(expression);
  }

  @action setValue(value: string & Date & number & (string | number)[], key: "value" | "values" | "min" | "max"): void {
    this[key] = value;
  }

  @action clear() {
    this.currentEventName = undefined;
    this.clearExpressionData();
  }

  @action clearExpressionData() {
    this.currentExpression = undefined;
    this.currentOccurExpression = undefined;
    this.expressions = undefined;
    this.clearValueData();
  }

  //######## static ###########//
  @computed static get systemEventsList() {
    return Events.systemEventsList || [];
  }

  @computed static get occurExpressionNames() {
    return Array.from(this.occurExpressions.keys());
  }

  static isAnd(index: number, didEvents: boolean) {
    if(didEvents) {
      return computed(() => this.didEventsAndOr.length > index && this.didEventsAndOr[index] === AND).get();
    }
    return computed(() => this.didNotDoEventsAndOr.length > index && this.didNotDoEventsAndOr[index] === AND).get();
  }

  @action static create() {
    const item = new SegmentEventViewStore();
    const event = SegmentEventViewStore.systemEventsList[0];
    item.setEventName(event);
    return item;
  }

  @action static handleAnd() {
    this.and = !this.and;
  }

  @action static addNewItem(didEvents: boolean) {
    if(didEvents) {
      this.didEvents.push(SegmentEventViewStore.create());
      this.didEventsAndOr.push(AND);
      return;
    }
    this.didNotDoEvents.push(SegmentEventViewStore.create());
    this.didNotDoEventsAndOr.push(AND);
  }

  @action static removeItem(index: number, didEvents: boolean) {
    if(didEvents) {
      this.didEvents.splice(index, 1);
      this.didEventsAndOr.splice(index, 1);
      return;
    }
    this.didNotDoEvents.splice(index, 1);
    this.didNotDoEventsAndOr.splice(index, 1);
  }

  @action static handleAndOr(index: number, didEvents: boolean) {
    if (didEvents) {
      this.didEventsAndOr[index] = this.didEventsAndOr[index] === AND ? OR : AND;
      return;
    }
    this.didNotDoEventsAndOr[index] = this.didNotDoEventsAndOr[index] === AND ? OR : AND;
  }

  @action static clearDidEvents() {
    this.didEvents.replace([]);
    this.didEventsAndOr.replace([]);
  }

  @action static clearDidNotDoEvents() {
    this.didNotDoEvents.replace([]);
    this.didNotDoEventsAndOr.replace([]);
  }

  @action static clear() {
    this.clearDidNotDoEvents();
    this.clearDidEvents();
    this.and = true;
  }
}
