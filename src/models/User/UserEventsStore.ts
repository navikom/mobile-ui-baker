import { action } from "mobx";

// models
import { Pagination } from "models/Pagination";
import { EventStore } from "models/Event/EventStore";

// interfaces
import { IUsersEvents } from "interfaces/IUsersEvents";
import { IEvent } from "interfaces/IEvent";

export class UserEventsStore extends Pagination<IEvent>
  implements IUsersEvents {
  constructor(userId: number) {
    super(
      "eventId",
      "event",
      20,
      "pagination",
      [5, 10, 25, 50],
      `/user/${userId}`
    );
  }

  @action async fetchItems(): Promise<boolean> {
    try {
      await super.fetchItems();
    } catch (err) {
      console.log("User events error: %s", err.message);
    }
    return true;
  }

  @action push(data: IEvent[]) {
    let l = data.length,
      i = 0;
    while (l--) {
      const item = data[i++];
      if (!this.has(item.eventId)) {
        this.items.push(EventStore.from(item));
      }
    }
  }
}
