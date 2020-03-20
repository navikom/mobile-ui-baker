import {observable} from "mobx";
import {IInAppMessage, IInAppVariant} from "interfaces/IVariant";
import {InAppType} from "types/commonTypes";
import {IN_APP_CHANNEL} from "models/Constants";
import {InAppMessageStore} from "models/Campaign/InApp/InAppMessageStore";

export class InAppVariantStore implements IInAppVariant {
 readonly channel: InAppType = IN_APP_CHANNEL;
 name!: string;

 @observable variantId!: number;
 @observable data: IInAppMessage;

 constructor(data: IInAppMessage = new InAppMessageStore()) {
  this.data = data;
 }

}
