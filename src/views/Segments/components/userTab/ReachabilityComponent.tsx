import React from "react";
import { observer } from "mobx-react-lite";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// components
import FiltarableComponent from "components/Filter/FiltarableComponent";

export default observer(() => {
  if (!SegmentViewStore.segment) return null;
  const userTab = SegmentViewStore.segment.userData;

  const first = {
    value: SegmentViewStore.reachabilityOn,
    options: ["All Channels", ...SegmentViewStore.reachabilityExpressions],
    onChange: (e: string) => userTab!.updateReachabilityOn(e),
    label: Dictionary.defValue(DictionaryService.keys.is)
  };

  let second;
  if (userTab!.reachability && userTab!.reachability.value) {
    second = {
      value: SegmentViewStore.reachabilityValue,
      options: SegmentViewStore.channelNames,
      onChange: (e: string) => userTab!.updateReachabilityValue(e)
    };
  }
  return (
    <FiltarableComponent
      first={first}
      second={second}
    />
  );
});
