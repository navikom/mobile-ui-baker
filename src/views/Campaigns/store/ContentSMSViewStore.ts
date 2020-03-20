import {action, observable} from "mobx";
import validate from "validate.js";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// interfaces
import {ContentSMSPropsType, IContentSMSView} from "interfaces/IContentStep";
import {ISMSMessage, ISMSVariant} from "interfaces/IVariant";

// models
import {SMSVariantStore} from "models/Campaign/Sms/SMSVariantStore";
import {ContentDeviceViewStore} from "views/Campaigns/store/ContentDeviceViewStore";

export class ContentSMSViewStore extends ContentDeviceViewStore implements IContentSMSView {

 @observable phone!: string;


 constructor(variant: ISMSVariant = new SMSVariantStore()) {
  super(variant);
  this.constraints = {
   sender: {
    presence: {
     message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, DictionaryService.keys.sender)}`
    },
    length: {
     minimum: 2,
     maximum: 100,
     message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreAndLessThan, [DictionaryService.keys.sender, "100", "2"])}`
    }
   },
   message: {
    presence: {
     message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, DictionaryService.keys.message)}`
    },
    length: {
     minimum: 2,
     maximum: 400,
     message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreAndLessThan, [DictionaryService.keys.message, "400", "2"])}`
    }
   }
  };
 }

 @action onInput = (key: ContentSMSPropsType, value: string) => {
  const sms = this.variant.data as ISMSMessage;
  this.errors = validate(Object.assign({sender: sms.sender, message: sms.message}, {[key]: value}), this.constraints);
  sms.update({[key]: value} as unknown as ISMSMessage);
 };

}
