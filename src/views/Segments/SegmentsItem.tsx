import React from "react";
import { RouteComponentProps } from "react-router";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";

import { lazy } from "utils";

const SegmentData = lazy(() =>
  import("views/Segments/components/SegmentDetails.tsx")
);

type SegmentMatch = {
  segmentId: string;
};

function SegmentsItem(props: RouteComponentProps<SegmentMatch>) {
  if (!SegmentViewStore.segment) {
    const url = props.match.url.split("/");
    url.pop();
    // setTimeout(() => props.history.push(url.join("/")), 0);
  }
  SegmentViewStore.setSegment(0);
  return <SegmentData />;
}

export default SegmentsItem
