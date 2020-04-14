import { action, observable } from "mobx";
import { ICampaign } from "interfaces/ICampaign";
import { IChannelCampaigns } from "interfaces/IChannelCampaigns";
import {
  ROUTE_EMAIL_CAMPAIGNS,
  ROUTE_IN_APP_CAMPAIGNS,
  ROUTE_PUSH_CAMPAIGNS,
  ROUTE_SMS_CAMPAIGNS
} from "models/Constants";
import { EmailCampaigns } from "models/Campaign/Email/EmailCampaignsStore";
import { SmsCampaigns } from "models/Campaign/Sms/SmsCampaignsStore";
import { InAppCampaigns } from "models/Campaign/InApp/InAppCampaignsStore";
import { PushCampaigns } from "models/Campaign/Push/PushCampaignsStore";

class CampaignsStore {
  @observable stores: Map<string, IChannelCampaigns<ICampaign>> = new Map([
    [ROUTE_EMAIL_CAMPAIGNS, EmailCampaigns],
    [ROUTE_SMS_CAMPAIGNS, SmsCampaigns],
    [ROUTE_IN_APP_CAMPAIGNS, InAppCampaigns],
    [ROUTE_PUSH_CAMPAIGNS, PushCampaigns]
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
