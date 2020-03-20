import { ChannelCampaigns } from "models/Campaign/ChannelCampaigns";
import { IChannelCampaigns } from "interfaces/IChannelCampaigns";
import { ICampaign } from "interfaces/ICampaign";
import { EMAIL_CAMPAIGN, EMAIL_CHANNEL } from "models/Constants";
import { ChannelType } from "types/commonTypes";

class EmailCampaignsStore extends ChannelCampaigns implements IChannelCampaigns<ICampaign> {
  readonly title: string = EMAIL_CAMPAIGN;
  readonly type: ChannelType = EMAIL_CHANNEL;

  constructor() {
    super(`/${EMAIL_CHANNEL}`);
  }
}

export const EmailCampaigns = new EmailCampaignsStore();
