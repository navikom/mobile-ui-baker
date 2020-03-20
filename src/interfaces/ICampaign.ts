import {VariantType} from "interfaces/IVariant";
import {ISegment} from "interfaces/ISegment";
import {
 ChannelType,
 RunType,
} from "types/commonTypes";
import {WithPrimaryKey} from "interfaces/WithPrimaryKey";


export interface IRunType {
 readonly type: RunType;
 update(model: IOneTimeRun | ITriggerRun | IRecurringRun): void;
}

export interface IOneTimeRun extends IRunType {
 now: boolean;
 later?: Date;
 userTimezone: boolean;
 appTimezone: boolean;
}

export interface ITriggerRun extends IRunType {
 eventName?: string;
 sendAsOccurs: boolean;
 waitFor?: number;
 startDate?: Date;
 endDate?: Date | null;

}

export interface IRecurringRun extends IRunType {
 reoccur: number;
 startDate?: Date;
 endDate?: Date | null;
}

export interface IConversion {
 event: string;
 deadlineFromDeliveryMessage: number;
 setEvent(value: string): void;
}

export interface ICampaign extends WithPrimaryKey {
 campaignId: number;
 readonly channelType: ChannelType;
 readonly pk: string;

 name?: string;
 runType: IOneTimeRun | ITriggerRun | IRecurringRun;
 onlyForSubscribed: boolean;
 segments?: ISegment[];
 excludeSegments?: ISegment[];
 frequencyCap: boolean;
 targetAndroidApps?: string[];
 targetIOSApps?: string[];
 conversion: IConversion | null;
 variants?: VariantType[];
}
