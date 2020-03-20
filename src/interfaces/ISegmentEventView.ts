import { ValueType } from "types/expressions";
import { ISegmentViewForm } from "interfaces/ISegmentViewForm";

export interface ISegmentEventView extends ISegmentViewForm {
  currentEventName?: string;
  currentOccurExpression?: string;

  setEventName(name: string): void;
  setOccurExpression(value: string): void;
  setRestExpression(value: string): void;
}
