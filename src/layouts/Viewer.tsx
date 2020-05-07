import React from "react";
import { History } from "history";
import { lazy } from "utils";

const ViewerView = lazy(() => import("views/Viewer/ViewerView"));

interface Props {
  history: History;
}
function ViewerLayout(props: Props) {
  console.log(33333333);
  return <ViewerView {...props} />
}

export default ViewerLayout;
