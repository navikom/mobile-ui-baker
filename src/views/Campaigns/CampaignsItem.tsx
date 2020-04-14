import React from "react";
import { RouteComponentProps } from "react-router";

// utils
import { lazy } from "utils";

// core components
import GridContainer from "components/Grid/GridContainer";
import { useDisposable } from "mobx-react-lite";
import { when } from "mobx";
import { App } from "models/App";
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";
import {
  ROUTE_EMAIL_CAMPAIGNS,
  EMAIL_CHANNEL,
  ROUTE_IN_APP_CAMPAIGNS,
  IN_APP_CHANNEL,
  ROUTE_PUSH_CAMPAIGNS,
  PUSH_CHANNEL,
  ROUTE_SMS_CAMPAIGNS,
  SMS_CHANNEL
} from "models/Constants";
import { ChannelType } from "types/commonTypes";

const StepperComponent = lazy(() =>
  import("views/Campaigns/components/StepperComponent")
);

type CampaignMatch = {
  campaignId: string;
};

const channels: {[key: string]: ChannelType} = {
  [ROUTE_EMAIL_CAMPAIGNS]: EMAIL_CHANNEL,
  [ROUTE_SMS_CAMPAIGNS]: SMS_CHANNEL,
  [ROUTE_IN_APP_CAMPAIGNS]: IN_APP_CHANNEL,
  [ROUTE_PUSH_CAMPAIGNS]: PUSH_CHANNEL
};

function CampaignsItem(props: RouteComponentProps<CampaignMatch>) {
  const id = Number(props.match.params.campaignId);
  const channelRoute = props.match.path.split("/:")[0];
  console.log("Campaign Item %d", id, channelRoute);

  useDisposable(() =>
    when(
      () => App.sessionIsReady,
      () => {
        CampaignViewStore.setCampaign(id, channels[channelRoute]);
      }
    )
  );

  return (
    <GridContainer>
      <StepperComponent />
    </GridContainer>
  );
}

export default CampaignsItem;
