import { action, IObservableArray, observable } from "mobx";
import { IMobileMessage } from "interfaces/IVariant";

export class MobileMessageStore implements IMobileMessage {
  @observable keyValuePairs: IObservableArray<string[]> = observable<string[]>(
    []
  );
  @observable message = "";
  @observable title = "";

  @action createKeyValue() {
    this.keyValuePairs.push(["", ""]);
  }

  @action updateKeyValuePair(index: number, key: string, value: string) {
    this.keyValuePairs[index] = [key, value];
  }

  @action deleteKeyValue(index: number): void {
    this.keyValuePairs.splice(index, 1);
  }

  @action clearKeyValuePairs(): void {
    this.keyValuePairs.replace([]);
  }
}
