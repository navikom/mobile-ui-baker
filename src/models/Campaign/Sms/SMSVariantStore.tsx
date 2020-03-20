import {ISMSMessage, ISMSVariant} from "interfaces/IVariant";
import {SmsType} from "types/commonTypes";
import {SMS_CHANNEL} from "models/Constants";
import {observable} from "mobx";
import {SMSMessageStore} from "models/Campaign/Sms/SMSMessageStore";

export class SMSVariantStore implements ISMSVariant {
 readonly channel: SmsType = SMS_CHANNEL;
 name!: string;
 provider!: string;
 @observable variantId = 0;
 @observable data: ISMSMessage;

 constructor(data: ISMSMessage = new SMSMessageStore()) {
  this.data = data;
 }
}
