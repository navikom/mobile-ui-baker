import { action, computed, observable, toJS } from "mobx";

// models
import { Pagination } from "models/Pagination";
import { SegmentStore } from "models/Segment/SegmentStore";

// interfaces
import { ISegment } from "interfaces/ISegment";
import { Dictionary } from "services/Dictionary/Dictionary";
import { api, Apis } from "api";

class SegmentsStore extends Pagination<ISegment> {
  @observable expressions!: string[];

  @computed get plainData() {
    return this.tableData((e: ISegment) => {
      return [e.segmentId!.toString(), e.name, Dictionary.timeDateString(e.createdAt), Dictionary.timeDateString(e.updatedAt)]
    });

  }

  constructor() {
    super("segmentId", "segment", 20, "pagination", [5, 10, 25, 50]);
  }

  @action push(data: ISegment[]) {
    let l = data.length;
    while (l--) {
      if(!this.has(data[l].segmentId)) {
        this.items.push(SegmentStore.from(data[l]));
      }
    }
  }

  @action async fetchSegment(segment: number | ISegment) {
    try {
      segment = (typeof segment === "number" ? this.getById(segment) : segment) as ISegment;
      const response = await api(Apis.Main).segment.update(0, segment.toJSON());
      console.log("Fetch Segment", response);
    } catch (err) {
      console.log("Segment %d fetch Error %s", err.message);
    }
  }

  @action setExpressions(list: string[]) {
    if(!this.expressions) {
      this.expressions = list;
    }
  }
}

export const Segments = new SegmentsStore();
