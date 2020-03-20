import { action, computed, observable } from "mobx";

// models
import {
  EMAIL_CHANNEL,
  IN_APP_CHANNEL,
  PUSH_CHANNEL,
  SMS_CHANNEL
} from "models/Constants";

// interfaces
import { ContentChannelsType, IContentStep } from "interfaces/IContentStep";
import { ChannelType } from "types/commonTypes";

// stores
import { ContentEmailViewStore } from "views/Campaigns/store/ContentEmailViewStore";
import { ContentSMSViewStore } from "views/Campaigns/store/ContentSMSViewStore";
import { ContentInAppViewStore } from "views/Campaigns/store/ContentInAppViewStore";
import { ContentPushViewStore } from "views/Campaigns/store/ContentPushViewStore";

export class ContentStepStore implements IContentStep {
  static channelStores = {
    [EMAIL_CHANNEL]: ContentEmailViewStore,
    [SMS_CHANNEL]: ContentSMSViewStore,
    [IN_APP_CHANNEL]: ContentInAppViewStore,
    [PUSH_CHANNEL]: ContentPushViewStore
  };
  channel: ChannelType;
  variants = observable<ContentChannelsType>([]);
  @observable currentVariant = 0;

  @computed get isValidStep(): boolean {
    return true;
  }

  @computed get currentStore() {
    return this.variants[this.currentVariant];
  }

  @computed get variantOptions() {
    return this.variants.map((variant: ContentChannelsType, i: number) => [
      i,
      `Variant (${String.fromCharCode(65 + i)})`
    ]);
  }

  constructor(channelType: ChannelType) {
    this.channel = channelType;
    this.addStore();
  }

  @action addStore() {
    this.variants.push(new ContentStepStore.channelStores[this.channel]());
    this.setCurrentVariant(this.variants.length - 1);
  }

  @action deleteStore() {
    this.variants.pop();
    this.setCurrentVariant(this.variants.length - 1);
  }

  @action setCurrentVariant(index: number) {
    this.currentVariant = index;
  }
}
