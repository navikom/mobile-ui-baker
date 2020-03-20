import { action, observable } from "mobx";
import { AndroidStore } from "views/Segments/store/AndroidStore";
import { IOSStore } from "views/Segments/store/IOSStore";

export class SegmentTechnologyViewStore {
  @observable static android = AndroidStore;
  @observable static ios = IOSStore;

  @action static clear() {
    this.android.clear();
    this.ios.clear();
  }
}
