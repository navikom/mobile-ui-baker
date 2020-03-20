import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { useDisposable } from "mobx-react-lite";
import { when } from "mobx";

// @material-ui/core components
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import {
  Apps,
  SubtitlesOutlined,
  Devices,
  InfoOutlined
} from "@material-ui/icons";

// utils
import { lazy } from "utils";

// interfaces
import { IUser } from "interfaces/IUser";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// models
import { App } from "models/App";
import { Users } from "models/User/UsersStore";

// assets
import style from "assets/jss/material-dashboard-react/views/dashboardStyle";

// core components
const CustomTabs = lazy(() => import("components/CustomTabs/CustomTabs"));
const GridContainer = lazy(() => import("components/Grid/GridContainer"));
const GridItem = lazy(() => import("components/Grid/GridItem"));
const UserInfoTab = lazy(() => import("views/Events/components/UserInfoTab"));
const UserDevicesTab = lazy(() => import("views/Events/components/UserDevicesTab"));
const UserEventsTab = lazy(() => import("views/Events/components/UserEventsTab"));
const UserAppsTab = lazy(() => import("views/Events/components/UserAppsTab"));

interface MatchInfo {
  userId: string;
}

interface UsersItemProps extends RouteComponentProps<MatchInfo>, WithStyles<typeof style> {
}

const EventsUsersItem = (props: UsersItemProps) => {
  const userId = Number(props.match.params.userId);
  const [user, setUser] = useState({ userId } as IUser);

  const dispose = useDisposable(() =>
    when(() => App.sessionIsReady, () => {
      const u = Users.getByIdFullData(userId);
      u.events!.fetchItems();
      when(() => u.fullDataLoaded, () => {
        setUser(u);
      });
    }));

  useEffect(() => {
    return () => {
      dispose();
    }
  }, [dispose]);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <CustomTabs
          title={`${Dictionary.defValue(DictionaryService.keys.userEvents)}:`}
          headerColor="primary"
          tabs={[
            {
              tabName: Dictionary.defValue(DictionaryService.keys.basicInfo),
              tabIcon: InfoOutlined,
              tabContent: (<UserInfoTab user={user}/>)
            },
            {
              tabName: Dictionary.defValue(DictionaryService.keys.devices),
              tabIcon: Devices,
              tabContent: (<UserDevicesTab devices={user.devices}/>)
            },
            {
              tabName: Dictionary.defValue(DictionaryService.keys.apps),
              tabIcon: Apps,
              tabContent: (<UserAppsTab apps={user.apps}/>)
            },
            {
              tabName: Dictionary.defValue(DictionaryService.keys.events),
              tabIcon: SubtitlesOutlined,
              tabContent: (<UserEventsTab events={user.events}/>)
            }
          ]}
        />
      </GridItem>
    </GridContainer>
  );
};


export default withStyles(style)(EventsUsersItem);
