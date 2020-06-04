import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { matchPath } from 'react-router';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Container from '@material-ui/core/Container';
import { PRIVACY_POLICY, ROUTE_TERMS, TERMS_OF_SERVICE, TERMS_OF_SUPPORT } from 'models/Constants';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { lazy } from 'utils';
import WaitingComponent from '../../hocs/WaitingComponent';
import Grid from '@material-ui/core/Grid';

const TermsComponent = lazy(() => import('components/Terms/Terms'));
const Support = lazy(() => import('components/Terms/Support'));
const Privacy = lazy(() => import('components/Terms/Privacy'));

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    minHeight: 400,
    color: blackOpacity(.8),
  },
  title: {
    color: theme.palette.background.paper,
    marginBottom: 50
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: 200
  },
  container: {
    padding: 30
  }
}));

const tabItems = [TermsComponent, Support, Privacy];

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
    style: { width: 150 }
  };
}

interface TermsTabsProps {
  page: number;
}

const TermsTabs: React.FC<TermsTabsProps> = ({ page }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(page);

  const tabTitles = [DictionaryService.keys.termsOfService, DictionaryService.keys.support, DictionaryService.keys.privacyPolicy]

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const title = tabTitles[value];
  return (
    <Container component="main">
      <Typography variant="h2" align="center" className={classes.title}>
        {Dictionary.defValue(DictionaryService.keys.termsAndConditions)}
      </Typography>
      <div className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          {
            tabTitles.map((tab, i) => (
              <Tab key={i.toString()} label={Dictionary.defValue(tab)} {...a11yProps(i)} />
            ))
          }
        </Tabs>
        <Grid container className={classes.container}>
          <Typography variant="h3">{title}</Typography>
          <br />
          <br />
          <br />
          {React.createElement(WaitingComponent(tabItems[value]))}
        </Grid>
      </div>
    </Container>
  )
}

const Terms: React.FC<RouteComponentProps> = ({ history }) => {
  const match = matchPath<{ page: string }>(history.location.pathname, {
    path: ROUTE_TERMS + '/:page',
    exact: true,
    strict: false
  });
  const pages = [TERMS_OF_SERVICE, TERMS_OF_SUPPORT, PRIVACY_POLICY];
  const index = match ? pages.indexOf(match.params.page) : 0;
  return <TermsTabs page={index > -1 ? index : 0} />
}

export default Terms;
