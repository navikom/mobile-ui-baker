import React from "react";
import { lazy } from "utils";
const ProjectsView = lazy(() => import("views/Projects/ProjectsView"));

function ProjectsLayout() {
  return <ProjectsView />
}

export default ProjectsLayout;
