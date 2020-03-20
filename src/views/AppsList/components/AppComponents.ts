import React from "react";
import { lazy } from "utils";

const appComponents: { [key: string]: React.ElementType } = {
  pictures_1: lazy(() => import("views/AppsList/components/Pixart/PPictures"))
};

export default appComponents;
