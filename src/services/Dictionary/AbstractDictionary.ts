import { observable } from "mobx";

export interface IObject {
  [key: string]: string;
}
abstract class AbstractDictionary {
  @observable data: IObject;
  reversed: IObject;

  protected constructor(data: IObject, reversed: IObject) {
    this.data = data;
    this.reversed = reversed;
  }

  defValue(value: string, values?: string | string[]) {
    const key = this.reversed[value];
    return this.value(key, values);
  }

  value(key: string, values?: string | string[]) {
    let data = this.data[key];
    if(values) {
      if(Array.isArray(values)) {
        values.forEach((e, i) => {
          data = data.replace(`%${i}`, e);
        })
      } else {
        data = data.replace('$', values);
      }
    }
    return data ? data : key;
  }

  exists(key: string) {
    return this.data[key] !== undefined;
  }
}

export default AbstractDictionary;
