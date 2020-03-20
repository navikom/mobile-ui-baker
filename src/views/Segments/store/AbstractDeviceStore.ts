import { action, computed, observable } from "mobx";
import { AbstractViewStore } from "views/Segments/store/AbstractViewStore";
import { ExpressionValueType, ValueType } from "types/expressions";
import { ISegmentDevice } from "interfaces/ISegmentDevice";
import { IStringFilter } from "interfaces/IFilters";

export abstract class AbstractDeviceStore extends AbstractViewStore implements ISegmentDevice {
  static propertiesMap: Map<string, Map<string, ExpressionValueType | undefined> | undefined>;
  model: ModelCtor;

  @observable currentPropertyName?: string;
  @observable currentExpression?: string;
  @observable date?: Date;
  @observable from?: Date;
  @observable to?: Date;

  constructor(model: ModelCtor) {
    super();
    this.model = model;
  }

  @action setPropertyName(name: string): void {
    this.clear();
    this.currentPropertyName = name;
    if(this.model.propertiesMap.has(name)) {
      const expressionsMap = this.model.propertiesMap.get(name);
      if(expressionsMap) {
        this.expressions = Array.from(expressionsMap.keys());
        this.setExpression(this.expressions![0]);
      } else {
        this.currentExpression = undefined;
      }
    }
  }

  @action setExpression(expressionName: string) {
    if (!this.currentPropertyName) return;
    this.currentExpression = expressionName;
    if(this.model.propertiesMap.get(this.currentPropertyName)!.has(expressionName)) {
      const expression = this.model.propertiesMap.get(this.currentPropertyName)!.get(expressionName);
      this.initExpression(expression);
    }
  }

  @action setValue(value: string & Date & number & (string | number)[], key: ValueType): void {
    this[key] = value;
  }

  @action clear() {
    this.currentPropertyName = undefined;
    this.currentExpression = undefined;
    this.expressions = undefined;
    this.clearValueData();
  }

  //######### static ###########//

  @computed static get propertyNames() {
    return Array.from(this.propertiesMap.keys());
  }

}

type ModelType = typeof AbstractDeviceStore;
type ModelCtor<M extends AbstractDeviceStore = AbstractDeviceStore> = (new () => M) & ModelType & IStringFilter;
