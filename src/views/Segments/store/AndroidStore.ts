import { AbstractDeviceStore } from "views/Segments/store/AbstractDeviceStore";
import { AndroidPropertiesMap } from "models/Constants";
import { action, IObservableArray, observable } from "mobx";
import { ISegmentDevice } from "interfaces/ISegmentDevice";

export class AndroidStore extends AbstractDeviceStore {
  static propertiesMap = AndroidPropertiesMap;
  @observable static readonly list: IObservableArray<ISegmentDevice> = observable<ISegmentDevice>([]);

  constructor() {
    super(AndroidStore);
  }

  //######### static ###########//

  @action static addNewItem() {
    const i = this.list.push(new AndroidStore());
    this.list[i - 1].setPropertyName(this.propertyNames[0]);
  }

  @action static removeItem(index: number) {
    this.list.splice(index, 1);
  }

  @action static clear() {
    this.list.replace([]);
  }
}
