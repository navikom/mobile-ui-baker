import { ChannelCampaigns } from "models/Campaign/ChannelCampaigns";
import { IChannelCampaigns } from "interfaces/IChannelCampaigns";
import { ICampaign } from "interfaces/ICampaign";
import { IN_APP_CAMPAIGN, IN_APP_CHANNEL } from "models/Constants";
import { ChannelType } from "types/commonTypes";

class InAppCampaignsStore extends ChannelCampaigns implements IChannelCampaigns<ICampaign> {
  readonly title: string = IN_APP_CAMPAIGN;
  readonly type: ChannelType = IN_APP_CHANNEL;

  constructor() {
    super(`/${IN_APP_CHANNEL}`);
  }
}

export const InAppCampaigns = new InAppCampaignsStore();
