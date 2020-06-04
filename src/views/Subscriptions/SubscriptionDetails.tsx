import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { matchPath } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { createStyles, Dialog, makeStyles, Theme } from '@material-ui/core';
import useStyles from 'assets/jss/material-dashboard-react/views/cardStyle';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { ArrowBack } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import SubscriptionDetailsStore from './SubscriptionDetailsStore';
import { lazy } from 'utils';
import DialogAlert from 'components/Dialog/DialogAlert';
import { ROUTE_BILLING, ROUTE_SUBSCRIPTION_DETAILS, SUBSCRIPTION_PADDLE_STATUS_ACTIVE } from 'models/Constants';
import { App } from 'models/App';
import TableBody from '@material-ui/core/TableBody';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import SubscriptionPlans from 'models/SubscriptionPlans';
import UpdatePlanCard from './components/UpdatePlanCard';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const Container = lazy(() => import('components/Grid/GridContainer'));
const Card = lazy(() => import('components/Card/Card'));
const CardHeader = lazy(() => import('components/Card/CardHeader'));
const CardBody = lazy(() => import('components/Card/CardBody'));

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.typography.pxToRem(20)
    },
    label: {
      width: theme.typography.pxToRem(200),
      marginRight: theme.typography.pxToRem(30)
    },
    iconButton: {
      padding: theme.typography.pxToRem(9)
    },
    table: {
      padding: theme.spacing(1),
      borderRadius: 4,
      borderCollapse: 'collapse',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)'
    },
    cell: {
      border: 'none',
      color: blackOpacity(.6)
    },
    cellTopBorder: {
      borderBottom: 'none',
      borderTop: '1px solid ' + blackOpacity(.05)
    },
    cellLeftBorder: {
      borderLeft: '1px solid ' + blackOpacity(.1)
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    icon: {
      marginRight: theme.spacing(0.5),
    },
    buttonRight: {
      marginLeft: theme.spacing(1)
    }
  })
);

interface UpdatePlanDialogProps {
  open: boolean;
  handleClose: () => void;
  onOkHandler: (planId: number) => void;
  initialPlan: number;
}

const UpdatePlanDialog: React.FC<UpdatePlanDialogProps> = ({ open, handleClose, onOkHandler, initialPlan }) => {
  const [planId, setPlan] = React.useState(initialPlan);
  const plans = Array.from(new SubscriptionPlans().plans.values()).slice(1);

  const selectPlan = (planId: number) => () => {
    setPlan(planId);
  }

  const handleSave = () => {
    onOkHandler(planId);
    handleClose();
  }

  return (
    <Dialog
      maxWidth="md"
      open={open}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <Grid container spacing={2}>
          {
            plans.map((plan, i) =>
              <UpdatePlanCard key={i.toString()} plan={plan} selected={plan.id === planId} onClick={selectPlan(plan.id)}/>
            )
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} disabled={planId === initialPlan} color="primary" variant="outlined">
          {Dictionary.defValue(DictionaryService.keys.save)}{' '}
          {Dictionary.defValue(DictionaryService.keys.choice)}
        </Button>
        <Button onClick={handleClose} variant="outlined">
          {Dictionary.defValue(DictionaryService.keys.cancel)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface ISubscriptionDetails {
  store: SubscriptionDetailsStore;
}

const SubscriptionDetails: React.FC<ISubscriptionDetails> = ({ store }) => {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openUpdatePlanDialog, setOpenUpdatePlanDialog] = React.useState<boolean>(false);
  const classes = useStyles();
  const extraClasses = extraStyles();

  if (!store.subscription) {
    return <Typography
      align="center">{Dictionary.defValue(DictionaryService.keys.thereIsNoSuchSubscription)}</Typography>
  }

  return (
    <Container>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit"
              className={extraClasses.link}
              onClick={() => App.navigationHistory && App.navigationHistory.push(ROUTE_BILLING)}>
          <ArrowBack className={extraClasses.icon} />
          {Dictionary.defValue(DictionaryService.keys.subscriptions)}
        </Link>
      </Breadcrumbs>
      <Card>
        <CardHeader color="primary" plain>
          <h4 className={classes.cardTitleWhite}>
            {Dictionary.defValue(DictionaryService.keys.subscription)} #{store.subscription!.subscriptionId}
          </h4>
        </CardHeader>
        <CardBody>
          <Table className={extraClasses.table}>
            <TableHead>
              <TableRow>
                <TableCell className={extraClasses.cell}>
                  <Typography><b>{store.plan!.title}</b></Typography>
                  <Typography variant="body2">
                    US <b>${store.plan!.price}</b> {Dictionary.defValue(DictionaryService.keys.perMonth)}
                  </Typography>
                  <Typography variant="body2">
                    {Dictionary.defValue(DictionaryService.keys.includedAPICalls)}{' '}
                    <b>{store.plan!.limit}</b>
                  </Typography>
                  <Typography variant="body2">
                    {Dictionary.defValue(DictionaryService.keys.additionalAPICalls)}{' '}
                    US <b>${store.plan!.unitPrice}</b>{' '}
                    {Dictionary.defValue(DictionaryService.keys.perUnit)}
                  </Typography>
                </TableCell>
                <TableCell align="right" className={extraClasses.cell}>
                  <Typography>{Dictionary.defValue(DictionaryService.keys.subscription)} ID</Typography>
                  <Typography><b>{store.subscription.subscriptionId}</b></Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <br />
          <Table className={extraClasses.table}>
            <TableHead>
              <TableRow>
                <TableCell className={extraClasses.cell}>
                  <Typography>
                    {Dictionary.defValue(DictionaryService.keys.subscription)}{' '}
                    {Dictionary.defValue(DictionaryService.keys.status)}
                  </Typography>
                  <Typography variant="subtitle2">
                    <b>{Dictionary.value(store.status).toUpperCase()}</b>
                  </Typography>
                </TableCell>
                <TableCell className={classNames(extraClasses.cell, extraClasses.cellLeftBorder)}>
                  <Typography>{Dictionary.defValue(DictionaryService.keys.totalSpent)}</Typography>
                  <Typography variant="subtitle2">
                    <b>${store.subscription.info.balance_earnings}</b>
                  </Typography>
                </TableCell>
                <TableCell className={classNames(extraClasses.cell, extraClasses.cellLeftBorder)}>
                  <Typography>{Dictionary.defValue(DictionaryService.keys.nextDue)}</Typography>
                  <Typography variant="subtitle2">
                    <b>{store.status === SUBSCRIPTION_PADDLE_STATUS_ACTIVE ? Dictionary.dateString(store.subscription.nextBillDate) : '-'}</b>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {
              store.status === SUBSCRIPTION_PADDLE_STATUS_ACTIVE && (
                <TableBody>
                  <TableRow>
                    <TableCell className={extraClasses.cellTopBorder} colSpan={3}>
                      <Button variant="outlined" color="primary" onClick={store.updatePaymentMethod}>
                        {Dictionary.defValue(DictionaryService.keys.update)}{' '}
                        {Dictionary.defValue(DictionaryService.keys.payment)}{' '}
                        {Dictionary.defValue(DictionaryService.keys.method)}
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        className={extraClasses.buttonRight}
                        onClick={() => setOpenUpdatePlanDialog(true)}>
                        {Dictionary.defValue(DictionaryService.keys.update)}{' '}
                        {Dictionary.defValue(DictionaryService.keys.plan)}
                      </Button>
                      <Button
                        className={extraClasses.buttonRight}
                        variant="outlined"
                        onClick={() => setOpenDialog(true)}>
                        {Dictionary.defValue(DictionaryService.keys.cancel)} {Dictionary.defValue(DictionaryService.keys.subscription)}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )
            }
          </Table>
          <br />
          <br />
          <Typography>{Dictionary.defValue(DictionaryService.keys.payments)}</Typography>
          <Table className={extraClasses.table}>
            <TableHead>
              <TableRow>
                <TableCell>
                  {Dictionary.defValue(DictionaryService.keys.receipt)}{' '}
                  {Dictionary.defValue(DictionaryService.keys.info)}
                </TableCell>
                <TableCell>
                  {Dictionary.defValue(DictionaryService.keys.amount)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (store.subscription.payments || []).map((payment, i) => (
                  <TableRow key={i.toString()}>
                    <TableCell className={extraClasses.cell}>
                      <Typography>
                        {Dictionary.defValue(DictionaryService.keys.order)} #{payment.info.order_id}
                      </Typography>
                      {
                        payment.info.coupon && payment.info.coupon.length > 0 && (
                          <Typography variant="caption">
                            {Dictionary.defValue(DictionaryService.keys.coupon)}{' '}
                            ({payment.info.coupon})
                          </Typography>
                        )
                      }
                      <Typography variant="subtitle2">
                        {Dictionary.timeDateString(payment.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell className={extraClasses.cell}>
                      <Typography>
                        ${payment.payment.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell className={extraClasses.cell}>
                      <Link href={payment.serviceRef} target="_blank">
                        <Typography>
                          {Dictionary.defValue(DictionaryService.keys.view)}{' '}
                          {Dictionary.defValue(DictionaryService.keys.receipt)}
                        </Typography>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <DialogAlert
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        title={`${Dictionary.defValue(DictionaryService.keys.cancel)} ${Dictionary.defValue(DictionaryService.keys.subscription)}`}
        content={Dictionary.defValue(DictionaryService.keys.afterSubscriptionCancelExtendedWillBe)}
        okTitle={Dictionary.defValue(DictionaryService.keys.yes)}
        cancelTitle={Dictionary.defValue(DictionaryService.keys.no)}
        onOk={store.cancel}
      />
      <UpdatePlanDialog
        initialPlan={store.plan!.id}
        open={openUpdatePlanDialog}
        onOkHandler={store.updatePlan}
        handleClose={() => setOpenUpdatePlanDialog(false)}
      />
      <Backdrop className={extraClasses.backdrop} open={store.paddle.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  )
}

const Subscription = observer(SubscriptionDetails);

const Details: React.FC<RouteComponentProps> = ({ history }) => {
  const match = matchPath<{ id: string }>(history.location.pathname, {
    path: ROUTE_SUBSCRIPTION_DETAILS + '/:id',
    exact: true,
    strict: false
  });
  const id = match ? Number(match.params.id) : 0;
  const store = new SubscriptionDetailsStore(id);

  React.useEffect(() => {
    return () => store.dispose();
  }, [store]);
  return <Subscription store={store} />
}

export default Details;
