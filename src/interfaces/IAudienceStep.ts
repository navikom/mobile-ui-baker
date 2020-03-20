import { IObservableArray } from "mobx";
import { ISegment } from "interfaces/ISegment";
import { IStep } from "interfaces/IStep";

export type SelectType = {
  id: number;
  name: string;
};

export interface IAudienceStep extends IStep {
  name?: string;
  errors: { [key: string]: string };
  multipleSegments: boolean;
  includeSegments: IObservableArray<ISegment>;
  excludeSegments: IObservableArray<ISegment>;

  segmentsListForSelect(include?: boolean): (string | (string | number)[])[];
  segmentsListForAutoSelect(include?: boolean): void;
  segmentsValuesForSelect(include?: boolean): void;
  validate(data?: { [key: string]: string | undefined }): void;
  setName(name?: string): void;
  switchMultipleSegments(): void;
  addSegment(selected: number | SelectType[], include?: boolean): void;
  deleteSegment(segment: ISegment, include?: boolean): void;
}
