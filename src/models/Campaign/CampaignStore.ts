import { action, observable } from "mobx";

// interfaces
import { ICampaign, IConversion, IOneTimeRun, IRecurringRun, ITriggerRun } from "interfaces/ICampaign";
import { ISegment } from "interfaces/ISegment";
import { VariantType } from "interfaces/IVariant";

// models
import { OneTimeRunStore } from "models/Campaign/OneTimeRunStore";

// types
import { ChannelType } from "types/commonTypes";

export class CampaignStore implements ICampaign {
  campaignId: number;
  readonly pk: string = "campaignId";
  readonly channelType: ChannelType;

  @observable conversion: IConversion | null = null;
  @observable excludeSegments?: ISegment[];
  @observable frequencyCap = false;
  @observable name?: string;
  @observable onlyForSubscribed = false;
  @observable runType: IOneTimeRun | ITriggerRun | IRecurringRun = new OneTimeRunStore();
  @observable segments?: ISegment[];
  @observable targetAndroidApps?: string[];
  @observable targetIOSApps?: string[];
  @observable variants?: VariantType[];

  constructor(model: ICampaign) {
    this.campaignId = model.campaignId;
    this.channelType = model.channelType;
  }

  @action update(model: ICampaign) {
    Object.assign(this, model);
  }

  static from(model: ICampaign) {
    return new CampaignStore(model);
  }

}
