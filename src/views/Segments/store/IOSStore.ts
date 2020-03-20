import { AbstractDeviceStore } from "views/Segments/store/AbstractDeviceStore";
import { IOSPropertiesMap } from "models/Constants";
import { action, IObservableArray, observable } from "mobx";
import { ISegmentDevice } from "interfaces/ISegmentDevice";

export class IOSStore extends AbstractDeviceStore {
  static propertiesMap = IOSPropertiesMap;
  @observable static readonly list: IObservableArray<ISegmentDevice> = observable<ISegmentDevice>([]);

  constructor() {
    super(IOSStore);
  }

  //######### static ###########//

  @action static addNewItem() {
    const i = this.list.push(new IOSStore());
    this.list[i - 1].setPropertyName(this.propertyNames[0]);
  }

  @action static removeItem(index: number) {
    this.list.splice(index, 1);
  }

  @action static clear() {
    this.list.replace([]);
  }

}
