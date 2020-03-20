import { IPagination } from "interfaces/IPagination";

export class ScrollHandler {
  store?: IPagination<any>;

  setStore<T>(store?: IPagination<T>) {
    this.store = store;
  }

  listener(scrollTop: number, height: number) {
    this.store && this.store.reachedBottom(scrollTop, height);
  }
}

export const ScrollService = new ScrollHandler();
