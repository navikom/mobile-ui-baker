import {IPushMessage, IPushVariant} from "interfaces/IVariant";
import {PushType} from "types/commonTypes";
import {PUSH_CHANNEL} from "models/Constants";
import {observable} from "mobx";
import {PushMessageStore} from "models/Campaign/Push/PushMessageStore";

export class PushVariantStore implements IPushVariant {
 readonly channel: PushType = PUSH_CHANNEL;
 name!: string;

 @observable variantId!: number;
 @observable data: IPushMessage;

 constructor(data: IPushMessage = new PushMessageStore()) {
  this.data = data;
 }
}
