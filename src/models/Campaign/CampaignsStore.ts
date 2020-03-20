import { action, observable } from "mobx";
import { ICampaign } from "interfaces/ICampaign";
import { IChannelCampaigns } from "interfaces/IChannelCampaigns";
import {
  EMAIL_CAMPAIGNS_ROUTE,
  IN_APP_CAMPAIGNS_ROUTE,
  PUSH_CAMPAIGNS_ROUTE,
  SMS_CAMPAIGNS_ROUTE
} from "models/Constants";
import { EmailCampaigns } from "models/Campaign/Email/EmailCampaignsStore";
import { SmsCampaigns } from "models/Campaign/Sms/SmsCampaignsStore";
import { InAppCampaigns } from "models/Campaign/InApp/InAppCampaignsStore";
import { PushCampaigns } from "models/Campaign/Push/PushCampaignsStore";

class CampaignsStore {
  @observable stores: Map<string, IChannelCampaigns<ICampaign>> = new Map([
    [EMAIL_CAMPAIGNS_ROUTE, EmailCampaigns],
    [SMS_CAMPAIGNS_ROUTE, SmsCampaigns],
    [IN_APP_CAMPAIGNS_ROUTE, InAppCampaigns],
    [PUSH_CAMPAIGNS_ROUTE, PushCampaigns]
  ]);
  @observable currentStore: IChannelCampaigns<ICampaign> | null = null;

  @action bindCurrentStore(key: string) {
    this.currentStore = this.stores.get(key) as IChannelCampaigns<ICampaign>;
  }

  @action async fetchItems(key: string) {
    const store = this.stores.get(key);
    try {
      await store!.fetchItems();
    } catch (e) {
      console.log("Campaign %s fetch Items error: %s", this.currentStore!.title, e.message);
      store!.setError(e.message);
    }
  }

}

export const Campaigns = new CampaignsStore();
