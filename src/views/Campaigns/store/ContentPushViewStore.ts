import { IPushVariant } from "interfaces/IVariant";
import { PushVariantStore } from "models/Campaign/Push/PushVariantStore";
import { ContentPushOrInAppViewStore } from "views/Campaigns/store/ContentPushOrInAppViewStore";

export class ContentPushViewStore extends ContentPushOrInAppViewStore {
  constructor(variant: IPushVariant = new PushVariantStore()) {
    super(variant);
  }
}
