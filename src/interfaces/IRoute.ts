import React from "react";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { RouteComponentProps } from "react-router";

export interface IRoute {
  path?: string;
  url?: string;
  params?: string;
  name: string;
  rtlName: string;
  icon?: React.ComponentType<SvgIconProps> | string;
  component:
    | React.ComponentType<any>
    | React.ComponentType<RouteComponentProps<any>>;
  layout: string;
  auth?: boolean;
  category?: string;
  role?: number;
}
