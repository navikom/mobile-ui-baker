import { Pagination } from "models/Pagination";
import { ChannelType } from "types/commonTypes";

export interface IChannelCampaigns<T> extends Pagination<T>{
  readonly title: string;
  readonly type: ChannelType;
}
