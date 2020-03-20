import { IInAppVariant } from "interfaces/IVariant";
import { InAppVariantStore } from "models/Campaign/InApp/InAppVariantStore";
import { ContentPushOrInAppViewStore } from "views/Campaigns/store/ContentPushOrInAppViewStore";

export class ContentInAppViewStore extends ContentPushOrInAppViewStore {
  constructor(variant: IInAppVariant = new InAppVariantStore()) {
    super(variant);
  }
}
