import {action, observable} from "mobx";
import validate from "validate.js";

// interfaces
import {ContentNotificationPropsType, ContentSMSPropsType, IContentDevice} from "interfaces/IContentStep";
import {IAttributesEventsPopper, IPopper} from "interfaces/IPopper";
import {IInAppVariant, IPushMessage, IPushVariant, ISMSVariant} from "interfaces/IVariant";

// models
import {EmojiPopperStore} from "models/EmojiPopperStore";
import {AttributeEventPopperStore} from "models/AttributeEventPopperStore";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

export class ContentDeviceViewStore implements IContentDevice {
 constraints: {[key: string]: any};

 @observable emojiStore: IPopper = new EmojiPopperStore();
 @observable variablesPopperStore: IAttributesEventsPopper = new AttributeEventPopperStore();
 @observable variant: ISMSVariant | IPushVariant | IInAppVariant;
 @observable errors!: {[p: string]: string};

 constructor(variant: ISMSVariant | IPushVariant | IInAppVariant, ) {
  this.variant = variant;
  this.constraints = {
   title: {
    length: {
     maximum: 100,
     message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreThan, [DictionaryService.keys.title, "100"])}`
    }
   },
   message: {
    presence: {
     message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, DictionaryService.keys.message)}`
    },
    length: {
     minimum: 2,
     maximum: 300,
     message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreAndLessThan, [DictionaryService.keys.message, "300", "2"])}`
    }
   }
  };
 }

 hasError(key: string): boolean {
  return this.errors !== undefined && this.errors[key] !== undefined;
 }

 @action onInput(key: ContentNotificationPropsType | ContentSMSPropsType, value: string): void {
  const data = this.variant.data as IPushMessage;
  this.errors = validate(Object.assign({title: data.title, message: data.message}, {[key]: value}), this.constraints);
  data.update({[key]: value} as unknown as IPushMessage);
 }

}
