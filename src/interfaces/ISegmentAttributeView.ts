import { ValueType } from "types/expressions";
import { ISegmentViewForm } from "interfaces/ISegmentViewForm";

export interface ISegmentAttributeView extends ISegmentViewForm {
  currentAttributeName?: string;
  currentEventName?: string;

  setAttributeName(name: string): void;
}
