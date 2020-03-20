import { action, computed, observable } from "mobx";
import validate from "validate.js";

// models
import { Segments } from "models/Segment/SegmentsStore";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// interfaces
import { ISegment } from "interfaces/ISegment";
import { IAudienceStep, SelectType } from "interfaces/IAudienceStep";

const constraints = {
  name: {
    presence: {
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.name))}`
    },
    length: {
      maximum: 100,
      message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreThan,
        [Dictionary.defValue(DictionaryService.keys.name), "100"])}`
    }
  }
};

export class AudienceStepStore implements IAudienceStep {

  @observable name?: string;
  @observable errors: {[key: string]: string} = {};
  @observable multipleSegments = false;
  @observable includeSegments = observable<ISegment>([]);
  @observable excludeSegments = observable<ISegment>([]);

  segmentsListForSelect(include = true) {
    return computed(() =>
      Segments.items
        .filter((e: ISegment) => include ? !this.includeSegments.includes(e) : !this.excludeSegments.includes(e))
        .map((e: ISegment) => [e.segmentId, e.name])
    ).get();
  }

  segmentsListForAutoSelect(include = true) {
    return computed(() =>
      Segments.items
        .filter((e: ISegment) => include ? !this.includeSegments.includes(e) : !this.excludeSegments.includes(e))
        .map((e: ISegment) => ({id: e.segmentId, name: e.name}))
    ).get();
  }

  segmentsValuesForSelect(include = true) {
    return computed(() =>
      (include ? this.includeSegments : this.excludeSegments).map((e: ISegment) => ({id: e.segmentId, name: e.name}))
    ).get();
  }

  @computed get isValidStep(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  @action validate(data?: {[key: string]: string | undefined}) {
    this.errors = validate(data, constraints) || {};
  }

  @action setName(name?: string) {
    this.validate({name});
    this.name = name;
  }

  @action switchMultipleSegments() {
    this.multipleSegments = !this.multipleSegments;
  }

  @action addSegment(selected: number | SelectType[], include = true) {
    if(include) {
      if(Array.isArray(selected)) {
        selected.forEach((e: SelectType) => Segments.has(e.id) && this.includeSegments.push(Segments.getById(e.id) as ISegment));
      } else {
        this.includeSegments.push(Segments.getById(selected) as ISegment);
      }
    } else {
      Array.isArray(selected) &&
      selected.forEach((e: SelectType) => Segments.has(e.id) && this.excludeSegments.push(Segments.getById(e.id) as ISegment));
    }
  }

  @action deleteSegment(segment: ISegment, include = true) {
    if(include) {
      this.includeSegments.splice(this.includeSegments.indexOf(segment), 1);
    } else {
      this.excludeSegments.splice(this.excludeSegments.indexOf(segment), 1);
    }
  }
}
