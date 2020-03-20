import {IConversion} from "interfaces/ICampaign";
import {action, observable} from "mobx";

export class ConversionStore implements IConversion {
 @observable deadlineFromDeliveryMessage!: number;
 @observable event!: string;

 @action setEvent(value: string): void {
  this.event = value;
 }
}
