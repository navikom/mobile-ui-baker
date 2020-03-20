import React from "react";
import { observer } from "mobx-react-lite";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";

// core components
import FiltarableComponent from "components/Filter/FiltarableComponent";

export default observer(() => {
  if (!SegmentViewStore.segment) return null;

  const first = {
    value: SegmentViewStore.lastSeenValue,
    options: ["", ...SegmentViewStore.lastSeenExpressions],
    onChange: (e: string) => SegmentViewStore.updateLastSeenExpression(e),
    label: Dictionary.defValue(DictionaryService.keys.is)
  };

  const values = SegmentViewStore.lastSeenValues;
  const second = {
    ...values,
    onChange: (e: Date, key: "from" | "to") => SegmentViewStore.updateLastSeenValue(e, key)
  };

  const third = values.from ? {
    ...SegmentViewStore.lastSeenValues,
    onChange: (e: Date, key: "from" | "to") => SegmentViewStore.updateLastSeenValue(e, key)
  } : undefined;

  if(values.from) {
    second!.to = undefined;
    third!.from = undefined;
  }

  return (
    <FiltarableComponent
      first={first}
      second={second}
      third={third}
    />
  );
});
