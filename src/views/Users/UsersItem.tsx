import React, { useEffect } from "react";
import { when } from "mobx";
import { useDisposable, useObserver } from "mobx-react-lite";
import { RouteComponentProps } from "react-router";

// @material-ui/icons
import { InfoOutlined, SupervisedUserCircleOutlined, Clear, PersonOutlined, DeviceHubOutlined } from "@material-ui/icons";

// models
import { App } from "models/App";
import { Users } from "models/User/UsersStore";

// interfaces
import { IUser } from "interfaces/IUser";

import { lazy } from "utils";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { UserDetails } from "views/Users/components/UserDetailsStore";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";

// core components
const CustomTabs = lazy(() => import("components/CustomTabs/CustomTabs"));
const GridContainer = lazy(() => import("components/Grid/GridContainer"));
const GridItem = lazy(() => import("components/Grid/GridItem"));
const UserPersonalData = lazy(() => import("views/Users/components/UserPersonalData"));
const UserReferrals = lazy(() => import("views/Users/components/UserReferrals"));
const UserReferralDetails = lazy(() => import("views/Users/components/UserReferralDetails"));
const UserRoles = lazy(() => import("views/Users/components/UserRoles"));

type UserMatch = {
  userId: string;
}

export type UserItemProps = RouteComponentProps<UserMatch>

const UserItem = (props: UserItemProps) => {
  const userId = Number(props.match.params.userId);
  const user = Users.getOrCreate({ userId } as IUser);
  UserDetails.bindUser(user);
  user.setFullDataLoaded(false);
  const dispose = useDisposable(() =>
    when(() => App.sessionIsReady, async () => {
      Users.loadFullData(user);
      Users.fetchReferrals(user);
    })
  );

  useEffect(() => {
    return () => dispose();
  });

  return (
    useObserver(() => {
      const tabs = [
        {
          tabName: Dictionary.defValue(DictionaryService.keys.personalData),
          tabIcon: InfoOutlined,
          tabContent: (<UserPersonalData/>)
        },
        {
          tabName: Dictionary.defValue(DictionaryService.keys.roles),
          tabIcon: DeviceHubOutlined,
          tabContent: (<UserRoles />)
        },
        {
          tabName: Dictionary.defValue(DictionaryService.keys.referrals),
          tabIcon: SupervisedUserCircleOutlined,
          tabContent: (<UserReferrals/>)
        }
      ];
      if(UserDetails.currentReferral) {
        tabs.push({
          tabName: Dictionary.defValue(DictionaryService.keys.referral),
          tabIcon: PersonOutlined,
          tabContent: (<UserReferralDetails/>)
        });
      }
      return (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <CustomTabs
              title={`${Dictionary.defValue(DictionaryService.keys.user)} #${userId}:`}
              headerColor="primary"
              tabs={tabs}
            />
          </GridItem>
          <Snackbar
            place="br"
            color="info"
            icon={AddAlert}
            message={Dictionary.defValue(DictionaryService.keys.dataSavedSuccessfully, "User")}
            open={UserDetails.successRequest}
            closeNotification={() => UserDetails.setSuccessRequest(false)}
            close
          />
          <Snackbar
            place="br"
            color="danger"
            icon={Clear}
            message={Dictionary.defValue(DictionaryService.keys.dataSaveError, [UserDetails.user!.fullName || "", UserDetails.error || ""])}
            open={UserDetails.hasError}
            closeNotification={() => UserDetails.setError(null)}
            close
          />

        </GridContainer>
      );
    })

  );
};

export default UserItem;
