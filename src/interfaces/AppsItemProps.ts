import { RouteComponentProps } from "react-router";

type AppMatch = {
  appId: string;
  pageName: string;
};

export type AppsItemProps = RouteComponentProps<AppMatch>
