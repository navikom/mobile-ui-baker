import { action, observable, toJS } from "mobx";
import { IBehavior, ISegment, ITechnology, IUserData } from "interfaces/ISegment";
import { UserTabStore } from "models/Segment/UserTabStore";

export class SegmentStore implements ISegment {
  @observable name!: string;
  @observable segmentId: number;

  @observable userData?: IUserData;
  @observable behavior?: IBehavior;
  @observable technology?: ITechnology;

  pk = "segmentId";

  constructor(model: ISegment) {
    this.segmentId = model.segmentId;
  }

  @action update(model: ISegment) {
    Object.assign(this, model);
  }

  toJSON() {
    console.log(97979799797999, toJS(this));
    return toJS(this);
  }

  static from(model: ISegment) {
    const segment = new SegmentStore(model);
    segment.update(model);
    return segment;
  }

  static newSegment() {
    const segment = new SegmentStore({segmentId: 0} as ISegment);
    segment.name = "";
    segment.userData = new UserTabStore();
    return segment;
  }

}
