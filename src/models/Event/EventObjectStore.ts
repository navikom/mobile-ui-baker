import { action, observable } from "mobx";
import { ObjectStore } from "models/ObjectStore";
import { IEventObject } from "interfaces/IEventObject";
import { IErrors } from "interfaces/IErrors";

export class EventObjectStore extends ObjectStore
  implements IEventObject, IErrors {
  @observable fetching = false;
  @observable fetched = false;
  @action async getData(key: string) {
    if (this.items.get(key) === null) {
      await this.fetchKeyData(key);
    }
  }

  @action addData(key: string, keys: string[]) {
    this.items.set(key, new EventObjectStore(key, keys));
  }

  @action async fetchKeyData(key: string) {
    if (this.fetched) return;
    this.setFetching(true);
    try {
      this.setFetched(true);
    } catch (err) {
      console.log("Event object fetching error %s", err.message);
      this.setError(err.message);
    }
    this.setFetching(false);
  }

  @action setFetching(value: boolean) {
    this.fetching = value;
  }

  @action setFetched(value: boolean) {
    this.fetched = value;
  }

  @action async fetchKeys() {
    if (this.fetched) return;
    this.setFetching(true);
    try {
      this.setFetched(true);
    } catch (err) {
      console.log("Event object keys fetching error %s", err.message);
      this.setError(err.message);
    }
    this.setFetching(false);
  }
}
