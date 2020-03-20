import { ChannelCampaigns } from "models/Campaign/ChannelCampaigns";
import { IChannelCampaigns } from "interfaces/IChannelCampaigns";
import { ICampaign } from "interfaces/ICampaign";
import { PUSH_CAMPAIGN, PUSH_CHANNEL } from "models/Constants";
import { ChannelType } from "types/commonTypes";

class PushCampaignsStore extends ChannelCampaigns implements IChannelCampaigns<ICampaign> {
  readonly title: string = PUSH_CAMPAIGN;
  readonly type: ChannelType = PUSH_CHANNEL;

  constructor() {
    super(`/${PUSH_CHANNEL}`);
  }
}

export const PushCampaigns = new PushCampaignsStore();
