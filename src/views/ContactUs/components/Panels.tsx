import React from 'react';
import Panel, { PanelActions, PanelDetails, PanelSummary } from './Panel';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Button from '@material-ui/core/Button';
import { Email, GitHub } from '@material-ui/icons';
import { withStyles } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import InfoBox from './InfoBox';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const CustomButton = withStyles(theme => ({
  root: {
    color: theme.palette.background.paper,
    padding: '8px 80px',
    backgroundColor: '#a3a3a3',
    '&:hover': {
      color: theme.palette.background.paper,
    }
  }
}))(Button);

const CustomIcon = withStyles(theme => ({
  root: {
    marginRight: 10,
    paddingRight: 10,
    color: '#00BBFF'
  }
}))(Icon)

interface PanelsProps {
  openDialog: () => void;
}

const Panels: React.FC<PanelsProps> = ({openDialog}) => {
  return (
    <React.Fragment>
      <Panel>
        <PanelSummary>
          <CustomIcon className="fa fa-money"/>
          {Dictionary.defValue(DictionaryService.keys.thePaymentPending)}
        </PanelSummary>
        <PanelDetails>
          <Grid container>
            {Dictionary.defValue(DictionaryService.keys.someTimesOurPaymentVendor)}
          </Grid>
          <Grid container>
            {Dictionary.defValue(DictionaryService.keys.letUsKnowIfThePayment)}
          </Grid>

        </PanelDetails>
        <PanelActions>
          <CustomButton
            onClick={openDialog}
            disableElevation={true}
            variant="contained"
            startIcon={<Email />}
          >{Dictionary.defValue(DictionaryService.keys.sendEmail)}</CustomButton>
        </PanelActions>
      </Panel>
      <Panel>
        <PanelSummary>
          <CustomIcon className="fa fa-bug"/>
          I have an issue with a product
        </PanelSummary>
        <PanelDetails>
          <Grid container>
            <InfoBox>
              <Typography>{Dictionary.defValue(DictionaryService.keys.verifyThatYouHaveAProPlan)}</Typography>
            </InfoBox>
          </Grid>
          <Grid container>
            {Dictionary.defValue(DictionaryService.keys.evenIfWeHaveTested)}
          </Grid>
        </PanelDetails>
        <PanelActions>
          <CustomButton
            href="https://github.com/navikom/facetsui-plugin/issues"
            disableElevation={true}
            variant="contained"
            startIcon={<GitHub />}
          >{Dictionary.defValue(DictionaryService.keys.openGithubIssue)}</CustomButton>
          <CustomButton
            onClick={openDialog}
            disableElevation={true}
            variant="contained"
            startIcon={<Email />}
          >{Dictionary.defValue(DictionaryService.keys.sendEmail)}</CustomButton>
        </PanelActions>
      </Panel>
      <Panel>
        <PanelSummary>
          <CustomIcon className="fa fa-comments-o"/>
          {Dictionary.defValue(DictionaryService.keys.somethingElse)}
        </PanelSummary>
        <PanelDetails>
          <Grid container>
            {Dictionary.defValue(DictionaryService.keys.didntFindWhatYouCameFor)}
          </Grid>
          <Grid container>
            {Dictionary.defValue(DictionaryService.keys.ifYouStillDontHaveAnAnswer)}
          </Grid>

        </PanelDetails>
        <PanelActions>
          <CustomButton
            onClick={openDialog}
            disableElevation={true}
            variant="contained"
            startIcon={<Email />}
          >{Dictionary.defValue(DictionaryService.keys.sendEmail)}</CustomButton>
        </PanelActions>
      </Panel>
    </React.Fragment>
  )
};

export default Panels;
