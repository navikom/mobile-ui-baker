import React from "react";
import {observer} from "mobx-react-lite";

// @material-ui/icons
import {Clear} from "@material-ui/icons";
import AddAlert from "@material-ui/icons/AddAlert";

// @material-ui/core
import {createStyles, makeStyles, Stepper, Theme} from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepContent from "@material-ui/core/StepContent";

// core components
import GridItem from "components/Grid/GridItem";
import Snackbar from "components/Snackbar/Snackbar";
import CardFooter from "components/Card/CardFooter";
import Card from "components/Card/Card";
import Button from "components/CustomButtons/Button";

// view store
import store from "views/Campaigns/store/CampaignViewStore";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// utils
import {lazy} from "utils";

import WaitingComponent from "hocs/WaitingComponent";

const AudienceStep = lazy(() => import("views/Campaigns/components/audience/AudienceStep"));
const WhenToSendStep = lazy(() => import("views/Campaigns/components/whenToSend/WhenToSendStep"));
const ContentStep = lazy(() => import("views/Campaigns/components/content/ContentStep"));
const ConversionStep = lazy(() => import("views/Campaigns/components/conversion/ConversionStep"));
const TestStep = lazy(() => import("views/Campaigns/components/test/TestStep"));
const LaunchStep = lazy(() => import("views/Campaigns/components/launch/LaunchStep"));

const stepsContent = [AudienceStep, WhenToSendStep, ContentStep, ConversionStep, TestStep, LaunchStep];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
   verticalStepper: {
    backgroundColor: "#eeeeee"
   },
   center: {
    justifyContent: "flex-end"
   }
  }));

const HorizontalSteps = observer(() => {
 return (
   <div>
    <Stepper alternativeLabel nonLinear activeStep={store.activeStep}>
     {store.steps.map((label, index) => {
      return (
        <Step key={label}>
         <StepButton
           completed={index < store.activeStep}
           onClick={store.handleStep(index)}
         >
          {Dictionary.value(label)}
         </StepButton>
        </Step>
      );
     })}
    </Stepper>
    {React.createElement(WaitingComponent(stepsContent[store.activeStep]))}
   </div>
 );
});

const VerticalSteps = observer(() => {
 const classes = useStyles();
 return (
   <Stepper activeStep={store.activeStep} orientation="vertical" className={classes.verticalStepper}>
    {store.steps.map((label, index) => (
      <Step key={label}>
       <StepButton
         onClick={store.handleStep(index)}
       >
        {Dictionary.value(label)}
       </StepButton>
       <StepContent>
        {React.createElement(WaitingComponent(stepsContent[index]))}
       </StepContent>
      </Step>
    ))}
   </Stepper>
 );
});

const StepBtn = observer(() => {
 const classes = useStyles();
 return (
   <Card>
    <CardFooter className={classes.center}>
     <Button
       disabled={!store.isNextButtonAvailable}
       color="primary"
       onClick={() => store.activeStep < 5 ? store.handleStep(store.activeStep + 1)() : store.launch()}>
      {Dictionary.defValue(store.activeStep < 5 ? DictionaryService.keys.saveAndNextStep : DictionaryService.keys.launchCampaign)}
     </Button>
    </CardFooter>
   </Card>
 );
});


export default observer(() => {
 if (!store.campaign) return null;

 return (
   <GridItem xs={12} sm={12} md={12}>
    {store.width < 700 ? <VerticalSteps /> : <HorizontalSteps />}
    <StepBtn />
    <Snackbar
      place="br"
      color="info"
      icon={AddAlert}
      message={Dictionary.defValue(DictionaryService.keys.dataSavedSuccessfully, store.campaign!.name)}
      open={store.successRequest}
      closeNotification={() => store.setSuccessRequest(false)}
      close
    />
    <Snackbar
      place="br"
      color="danger"
      icon={Clear}
      message={Dictionary.defValue(DictionaryService.keys.dataSaveError, [store.campaign!.name || "", store.error || ""])}
      open={store.hasError}
      closeNotification={() => store.setError(null)}
      close
    />
   </GridItem>
 );
});
