import React from 'react';
import { observer } from 'mobx-react-lite';

// @material-ui/core components
import Typography from '@material-ui/core/Typography';
import { Button, makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { AttachMoney } from '@material-ui/icons';

// @material-ui/icons

// services
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';

// models

// core components
import { lazy } from 'utils';
import useStyles from 'assets/jss/material-dashboard-react/views/cardStyle';
import SubscriptionsStore from './SubscriptionsStore';
import CardFooter from 'components/Card/CardFooter';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardPlanBody from './components/PlanCardBody';

const Container = lazy(() => import('components/Grid/GridContainer'));
const Card = lazy(() => import('components/Card/Card'));
const CardHeader = lazy(() => import('components/Card/CardHeader'));
const CardBody = lazy(() => import('components/Card/CardBody'));
const Table = lazy(() => import('components/Table/Table'));

const extraStyles = makeStyles((theme: Theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
}));

interface SubscriptionsListProps {
  store: SubscriptionsStore;
}

const SubscriptionsListComponent: React.FC<SubscriptionsListProps> = ({store}) => {
  const classes = useStyles();
  const extraClasses = extraStyles();

  return (
    <Container>
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>
            {Dictionary.defValue(DictionaryService.keys.subscriptions)}
          </h4>
          <p className={classes.cardCategoryWhite}>
            {Dictionary.defValue(DictionaryService.keys.subscriptionsList)}
          </p>
        </CardHeader>
        <CardBody>
          {
            store.user && store.user.plan && store.user.plan.price === 0 && (
              <Grid container className={classes.container} spacing={2} justify="center">
                {
                  Array.from(store.list.values()).slice(1).map((item) => (
                    <Grid key={item.id} item xs={12} sm={4} md={4}>
                      <Card>
                        <CardHeader color="inherit" plain>
                          <Typography variant="h3" align="center" className={classes.cardTitleBlack}>
                            {item.title}
                          </Typography>
                          <Grid container justify="center">
                            <AttachMoney style={{color: blackOpacity(0.5)}} />
                            <Typography variant="h2" align="center" className={classes.cardTitleBlack}>
                              <b>{item.price}</b>
                            </Typography>
                          </Grid>
                          <Typography align="center" className={classes.cardTitleBlack}>
                            {Dictionary.defValue(DictionaryService.keys.perMonth)}
                          </Typography>
                        </CardHeader>
                        <CardBody>
                          <CardPlanBody plan={item}/>
                        </CardBody>
                        <CardFooter>
                          <Button variant="outlined" fullWidth color="primary" onClick={() => store.checkout(item)}>
                            {Dictionary.defValue(DictionaryService.keys.selectPlan)}
                          </Button>
                        </CardFooter>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>
            )
          }
          {
            store.subscriptions.length > 0 && (
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  Dictionary.defValue(DictionaryService.keys.plan),
                  Dictionary.defValue(DictionaryService.keys.createdAt),
                  Dictionary.defValue(DictionaryService.keys.nextPayment),
                  Dictionary.defValue(DictionaryService.keys.status),
                  ''
                ]}
                tableData={store.tableRows}
              />
            )
          }
          <Backdrop className={extraClasses.backdrop} open={store.paddle.loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </CardBody>
      </Card>
    </Container>
  );
};

const SubscriptionsList = observer(SubscriptionsListComponent);

const Subscriptions: React.FC = () => {
  const store = new SubscriptionsStore();
  return <SubscriptionsList store={store} />
}

export default Subscriptions;
