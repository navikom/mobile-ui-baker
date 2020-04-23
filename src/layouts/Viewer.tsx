import React from "react";
import { History } from "history";
import { lazy } from "utils";

const ViewerView = lazy(() => import("views/Viewer/ViewerView"));

interface Props {
  history: History;
}
function ViewerLayout(props: Props) {
  return <ViewerView {...props} />
}

export default ViewerLayout;
