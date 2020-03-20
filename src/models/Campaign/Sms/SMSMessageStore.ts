import { ISMSMessage } from "interfaces/IVariant";
import { observable } from "mobx";

export class SMSMessageStore implements ISMSMessage {
  @observable message = "";
  @observable sender = "";

  update(model: ISMSMessage): void {
    Object.assign(this, model);
  }
}
