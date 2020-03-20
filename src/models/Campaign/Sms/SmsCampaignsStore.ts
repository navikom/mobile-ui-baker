import { ChannelCampaigns } from "models/Campaign/ChannelCampaigns";
import { IChannelCampaigns } from "interfaces/IChannelCampaigns";
import { ICampaign } from "interfaces/ICampaign";
import { SMS_CAMPAIGN, SMS_CHANNEL } from "models/Constants";
import { ChannelType } from "types/commonTypes";

class SmsCampaignsStore extends ChannelCampaigns implements IChannelCampaigns<ICampaign> {
  readonly title: string = SMS_CAMPAIGN;
  readonly type: ChannelType = SMS_CHANNEL;

  constructor() {
    super(`/${SMS_CHANNEL}`);
  }
}

export const SmsCampaigns = new SmsCampaignsStore();
