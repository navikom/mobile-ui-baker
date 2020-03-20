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
  EMAIL_CAMPAIGNS_ROUTE,
  EMAIL_CHANNEL,
  IN_APP_CAMPAIGNS_ROUTE,
  IN_APP_CHANNEL,
  PUSH_CAMPAIGNS_ROUTE,
  PUSH_CHANNEL,
  SMS_CAMPAIGNS_ROUTE,
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
  [EMAIL_CAMPAIGNS_ROUTE]: EMAIL_CHANNEL,
  [SMS_CAMPAIGNS_ROUTE]: SMS_CHANNEL,
  [IN_APP_CAMPAIGNS_ROUTE]: IN_APP_CHANNEL,
  [PUSH_CAMPAIGNS_ROUTE]: PUSH_CHANNEL
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
