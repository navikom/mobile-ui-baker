import { action, computed, observable } from "mobx";
import { ISegmentAttributeView } from "interfaces/ISegmentAttributeView";

import { AND, OR, UserAttributeMap } from "models/Constants";
import { AndType, ExpressionValueType, OrType, ValueType } from "types/expressions";
import { AbstractViewStore } from "views/Segments/store/AbstractViewStore";

export class SegmentAttributeViewStore extends AbstractViewStore implements ISegmentAttributeView {
  static attributeNames: Map<string, Map<string, ExpressionValueType | undefined> | undefined> =
    UserAttributeMap;
  @observable static readonly list = observable<SegmentAttributeViewStore>([]);
  @observable static readonly andOr = observable<AndType | OrType>([]);

  @observable currentAttributeName?: string;
  @observable currentExpression?: string;
  @observable date?: Date;
  @observable from?: Date;
  @observable to?: Date;


  @action setAttributeName(name: string) {
    this.clear();
    if(SegmentAttributeViewStore.attributeNames.has(name)) {
      this.currentAttributeName = name;
      const attributeMap = SegmentAttributeViewStore.attributeNames.get(name);
      if(attributeMap) {
        this.expressions = Array.from(attributeMap.keys());
        this.setExpression(this.expressions![0]);
      } else {
        this.currentExpression = undefined;
      }
    }
  }

  @action setExpression(expressionName: string) {
    if(!this.currentAttributeName) return;
    this.currentExpression = expressionName;

    if(SegmentAttributeViewStore.attributeNames.get(this.currentAttributeName)!.has(expressionName)) {
      const expression = SegmentAttributeViewStore.attributeNames.get(this.currentAttributeName)!.get(expressionName);
      this.initExpression(expression);
    }
  }

  @action setValue(value: string & Date & number & (string | number)[], key: ValueType) {
    this[key] = value;
  }

  @action clear() {
    this.currentAttributeName = undefined;
    this.currentExpression = undefined;
    this.expressions = undefined;
    this.clearValueData();
  }

  //######## static ###########//

  static get attributeNamesKeys() {
    return Array.from(this.attributeNames.keys());
  }

  static isAnd(index: number) {
    return computed(() => this.andOr.length > index && this.andOr[index] === AND).get();
  }

  @action static create() {
    const item = new SegmentAttributeViewStore();
    const attribute = SegmentAttributeViewStore.attributeNamesKeys[0];
    item.setAttributeName(attribute);
    return item;
  }

  @action static addNewItem() {
    this.list.push(SegmentAttributeViewStore.create());
    this.andOr.push(AND);
  }

  @action static removeItem(index: number) {
    this.list.splice(index, 1);
    this.andOr.splice(index, 1);
  }

  @action static handleAndOr(index: number) {
    this.andOr[index] = this.andOr[index] === AND ? OR : AND;
  }

  @action static clear() {
    this.list.replace([]);
    this.andOr.replace([]);
  }
}
