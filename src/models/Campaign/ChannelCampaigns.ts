import { Pagination } from "models/Pagination";
import { ICampaign } from "interfaces/ICampaign";
import { action } from "mobx";
import { CampaignStore } from "models/Campaign/CampaignStore";

export abstract class ChannelCampaigns extends Pagination<ICampaign> {
  protected constructor(channel: string) {
    super("campaignId", "campaign", 20, "pagination",
      [5, 10, 25, 50], channel);
  }

  @action push(data: ICampaign[]) {
    let l = data.length;
    while (l--) {
      if(!this.has(data[l].campaignId)) {
        this.items.push(CampaignStore.from(data[l]));
      }
    }
  }

  @action
  getOrCreate(data: ICampaign) {
    if(!this.has(data.campaignId)) {
      this.push([data]);
    }
    return this.getById(data.campaignId as number);
  }
}
