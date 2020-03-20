import { action, computed, observable } from "mobx";
import { Pagination } from "models/Pagination";
import { IEvent } from "interfaces/IEvent";

import { EventStore } from "models/Event/EventStore";
import { Dictionary } from "services/Dictionary/Dictionary";

class EventsStore extends Pagination<IEvent> {
  @observable systemEventsList?: string[];
  @observable customEventsList?: string[];

  @computed get eventTableData() {
    return this.tableData((e: IEvent) => {
      return [e.userId.toString(), Dictionary.timeDateString(e.createdAt), e.title, e.user.email, e.user.anonymousString, e.user.eventsCount!.toString()];
    });
  }

  constructor() {
    super("eventId", "event", 20, "pagination", [5, 10, 25, 50],
      "?filter=user_group");
  }

  @action
  async fetchItems(): Promise<boolean> {
    try {
      await super.fetchItems();
    } catch (err) {
      console.log("Events fetch error: %s", err.message);
    }
    return true;
  }

  @action push(data: IEvent[]) {
    let l = data.length, i = 0;
    while (l--) {
      const item = data[i++];
      if (!this.has(item.eventId)) {
        this.items.push(EventStore.from(item));
      }
    }
  }

  @action setSystemEventsList(list: string[]) {
    if(!this.systemEventsList) {
      this.systemEventsList = list;
    }
  }

  @action setCustomEventsList(list: string[]) {
    if(!this.customEventsList) {
      this.customEventsList = list;
    }
  }

}

export const Events = new EventsStore();
