import ISubscriptionPlan from 'interfaces/ISubscriptionPlan';
import { DictionaryService } from 'services/Dictionary/Dictionary';

export const achievements = [
  [DictionaryService.keys.embedDragDropEditor],
  [DictionaryService.keys.embedMobileUIViewer],
  [DictionaryService.keys.adsFreeEditor],
  [DictionaryService.keys.editorCustomization, DictionaryService.keys.possibleToHideHeaderWithReplacing],
  [DictionaryService.keys.viewerCustomization, DictionaryService.keys.possibleToHideHeaderWithReplacingOverride],
  [DictionaryService.keys.includedAPICalls, DictionaryService.keys.pricingIsBasedOnSuccessfulCallsTo],
  [DictionaryService.keys.additionalAPICalls, DictionaryService.keys.ifInAPreviousMonthYouExceedYour]
]

export class Plan implements ISubscriptionPlan {
  id: number;
  limit: number;
  price: number;
  title: string;
  subtitle: string;
  unitPrice: number;
  achievements: (string | boolean)[] = [];
  preferred: boolean;

  constructor(id: number,
              title: string,
              subtitle: string,
              price: number,
              unitPrice: number,
              achievements: (string | boolean)[],
              preferred = false,
  ) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.price = price;
    this.unitPrice = unitPrice;
    this.achievements = achievements;
    this.limit = unitPrice ? price / unitPrice : 0;
    this.preferred = preferred;
  }

  getStatus(price: number) {
    return price ? 'update' : 'upgrade';
  }

  static free() {
    return new Plan(0, DictionaryService.keys.freePlan, DictionaryService.keys.goodForPersonalOrDev,
      0.00, 0.00, [true, true, false, false, false, false, false]);
  }
}

class SubscriptionPlans {
  plans: Map<string, Plan> = new Map<string, Plan>([
    ['0', Plan.free()],
    ['594907',
      new Plan(594907, DictionaryService.keys.startUpPlan, DictionaryService.keys.buildYourStartupOrClient,
        19.00, 0.01, [true, true, true, true, true, (19/0.01).toFixed(0), '$0.01'])
    ],
    ['594912',
      new Plan(594912, DictionaryService.keys.silverPlan, DictionaryService.keys.perfectForWebDesignPortals,
        99.00, 0.005, [true, true, true, true, true, (99/0.005).toFixed(0), '$0.005'],
        true)
    ],
    ['594913',
      new Plan(594913, DictionaryService.keys.goldPlan, DictionaryService.keys.deployLargeScaleMarketplaces,
        199.00, 0.0025, [true, true, true, true, true, (199/0.0025).toFixed(0), '$0.0025'])
    ],
  ]);
}

export default SubscriptionPlans;
