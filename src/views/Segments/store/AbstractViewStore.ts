import { action, observable } from "mobx";
import { ExpressionValueType, ValueType } from "types/expressions";
import { ErrorHandler } from "utils/ErrorHandler";

export abstract class AbstractViewStore {
  @observable expressions?: string[];
  @observable keys?: ValueType[];
  @observable max?: number;
  @observable min?: number;
  @observable value?: string | number | boolean;
  @observable values?: (string | number)[];

  @action initExpression(expression: ExpressionValueType | undefined) {
    if(!expression) {
      this.clearValueData();
      return;
    }
    if(expression.key) {
      // @ts-ignore
      this[expression.key] = expression.defaultValue !== undefined
        ? expression.defaultValue : expression.defaultValues;
      this.keys = [expression.key];
    } else if(expression.keys) {
      // @ts-ignore
      this[expression.keys[0]] = expression.defaultValues![0];
      // @ts-ignore
      this[expression.keys[1]] = expression.defaultValues![1];
      this.keys = expression.keys;
    }
  }

  @action clearValueData() {
    this.values = undefined;
    this.value = undefined;
    this.keys = undefined;
    this.min = undefined;
    this.max = undefined;
  }

  setExpression(value: string): void {
    throw new ErrorHandler("Define in the child");
  }

  setValue(value: string | Date | number | (string | number)[], key: ValueType): void {
    throw new ErrorHandler("Define in the child");
  }
}
