import React from "react";
import {observer} from "mobx-react-lite";

// view stores
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";

// interfaces
import {IOneTimeRunView} from "interfaces/IRunTypeView";
import SwitchComponent from "views/Campaigns/components/SwitchComponent";
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";


export default observer(() => {
 const whenToRunStepStore = CampaignViewStore.whenToRunStepStore;
 if (!whenToRunStepStore) return null;
 const store = whenToRunStepStore.runStore as IOneTimeRunView;

 const onTimeChange = (date: Date) => {
  store.setTimeDate(date);
 };

 const onTimeZone = (value: string) => {
  store.setTimeZone(value);
 };

 return <SwitchComponent
   title={Dictionary.defValue(DictionaryService.keys.deliveryTime)}
   onTitle={Dictionary.defValue(DictionaryService.keys.now)}
   offTitle={Dictionary.defValue(DictionaryService.keys.later)}
   on={store.model.now}
   switchOn={() => store.switchNow()}
   timeZone={store.timeZone}
   later={store.model.later}
   setTimeDate={onTimeChange}
   setTimeZone={onTimeZone} />;
});
