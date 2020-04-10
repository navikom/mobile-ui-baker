import React from "react";
import { History } from "history";
import { lazy } from "utils";

const EditorView = lazy(() => import("views/Editor/EditorView"));

interface Props {
  history: History;
}
function EditorLayout(props: Props) {
  return <EditorView {...props} />
}

export default EditorLayout;
