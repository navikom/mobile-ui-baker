import { action } from "mobx";
import { IInAppMessage } from "interfaces/IVariant";
import { MobileMessageStore } from "models/Campaign/MobileMessageStore";

export class InAppMessageStore extends MobileMessageStore
  implements IInAppMessage {
  @action update(model: IInAppMessage): void {
    Object.assign(this, model);
  }
}
