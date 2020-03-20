import React, { useEffect } from "react";
import { when } from "mobx";
import { observer, useDisposable } from "mobx-react-lite";

// @material-ui/icons
import {
  InfoOutlined,
  ExitToAppOutlined,
  SupervisedUserCircleOutlined,
  Clear,
  PersonOutlined
} from "@material-ui/icons";

// models
import { App } from "models/App";
import { Users } from "models/User/UsersStore";

// interfaces
import { IUser } from "interfaces/IUser";

import { lazy } from "utils";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import { UserDetails } from "views/UserProfile/components/UserDetailsStore";
import Snackbar from "components/Snackbar/Snackbar";
import AddAlert from "@material-ui/icons/AddAlert";

// core components
const CustomTabs = lazy(() => import("components/CustomTabs/CustomTabs"));
const GridContainer = lazy(() => import("components/Grid/GridContainer"));
const GridItem = lazy(() => import("components/Grid/GridItem"));
const UserPersonalData = lazy(() => import("views/UserProfile/components/UserPersonalData"));
const UserCredentials = lazy(() => import("views/UserProfile/components/UserCredentials"));
const UserReferrals = lazy(() => import("views/UserProfile/components/UserReferrals"));
const UserReferralDetails = lazy(() => import("views/UserProfile/components/UserReferralDetails"));


const Profile = observer(() => {
  if (!UserDetails.user) return null;
  const tabs = [
    {
      tabName: Dictionary.defValue(DictionaryService.keys.personalData),
      tabIcon: InfoOutlined,
      tabContent: (<UserPersonalData/>)
    },
    {
      tabName: Dictionary.defValue(DictionaryService.keys.credentials),
      tabIcon: ExitToAppOutlined,
      tabContent: (<UserCredentials/>)
    },
    {
      tabName: Dictionary.defValue(DictionaryService.keys.referrals),
      tabIcon: SupervisedUserCircleOutlined,
      tabContent: (<UserReferrals/>)
    }
  ];
  if (UserDetails.currentReferral) {
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
          title={`${Dictionary.defValue(DictionaryService.keys.user)} #${UserDetails.user!.fullName}:`}
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
});

function UserProfile() {

  const dispose = useDisposable(() =>
    when(() => App.sessionIsReady, async () => {
      const user = App.user as IUser;
      UserDetails.bindUser(user);
      Users.loadFullData(user);
      Users.fetchReferrals(user);
    })
  );

  useEffect(() => {
    return () => dispose();
  });

  return <Profile/>;
}

export default UserProfile;
