import { action, observable } from "mobx";

// interfaces
import { ContentEmailPropsType, IContentEmailView } from "interfaces/IContentStep";

// stores
import { AttributeEventPopperStore } from "models/AttributeEventPopperStore";
import { IAttributesEventsPopper, IPopper } from "interfaces/IPopper";
import { EmojiPopperStore } from "models/EmojiPopperStore";
import { IAttachment } from "interfaces/IAttachment";

class Attachment implements IAttachment {
  @observable url = "";

  @action setUrl(url: string) {
    this.url = url;
  }
}

export class ContentEmailViewStore implements IContentEmailView {
  @observable fromEmail = "";
  @observable fromName = "";
  @observable subject = "";
  @observable editorOpened = false;
  @observable jsonFile!: { [key: string]: any };
  @observable htmlFile!: string;
  @observable attachments: IAttachment[] = observable<IAttachment>([]);

  @observable variablesPopperStore: IAttributesEventsPopper = new AttributeEventPopperStore();
  @observable emojiStore: IPopper = new EmojiPopperStore();

  @action onInput(key: ContentEmailPropsType, value: string) {
    this[key] = value;
  }

  @action onError = (errorMessage: string): void => {
    console.log("onError", errorMessage);
  }

  @action onSave = (jsonFile: { [key: string]: any }, htmlFile: string): void => {
    console.log("onSave action");
    this.jsonFile = jsonFile;
    this.htmlFile = htmlFile;
  };

  @action onSaveAsTemplate = (jsonFile: any): void => {
    console.log("onSaveAsTemplate", jsonFile);
  }

  @action onSend = (htmlFile: any): void => {
    console.log("onSend", htmlFile);
  }

  @action closeEditor = (): void => {
    this.editorOpened = false;
  }

  @action openEditor = (): void => {
    this.editorOpened = true;
  }

  @action addAttachment = () => {
    this.attachments.push(new Attachment());
  }

  @action deleteAttachment = (index: number) => {
    this.attachments.splice(index, 1);
  }

}
