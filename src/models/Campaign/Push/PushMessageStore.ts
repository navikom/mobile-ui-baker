import { action } from "mobx";
import { IPushMessage } from "interfaces/IVariant";
import { MobileMessageStore } from "models/Campaign/MobileMessageStore";

export class PushMessageStore extends MobileMessageStore
  implements IPushMessage {
  @action update(model: IPushMessage): void {
    Object.assign(this, model);
  }
}
