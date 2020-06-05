import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Check, Close, InfoRounded } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import { Theme, TableHead, TableBody, withStyles, createStyles, Link } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { App } from 'models/App';
import SubscriptionPlans, { achievements, Plan } from 'models/SubscriptionPlans';
import { ROUTE_BILLING, ROUTE_DOCS_PRO_PLAN } from 'models/Constants';
import { roseColor, whiteColor } from 'assets/jss/material-dashboard-react';
import ISubscriptionPlan from 'interfaces/ISubscriptionPlan';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    color: theme.palette.background.paper,
    marginBottom: 100
  },
  table: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
  },
  cellTitle: {
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 400,
    width: '20%'
  },
  head: {
    backgroundColor: theme.palette.background.paper,
  },
  preferred: {
    backgroundColor: '#444',
    color: whiteColor,
  },
  textWhite: {
    color: whiteColor,
  },
  button: {
    backgroundColor: '#444',
    color: whiteColor,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#2a2a2a',
    }
  },
  buttonPreferred: {
    backgroundColor: roseColor[0],
    '&:hover': {
      backgroundColor: '#fc0559',
    }
  },
  link: {
    color: '#00BBFF',
    '&:hover': {
      color: 'rgba(0,187,255,0.7)',
    }
  },
  linkPreferred: {
    color: '#bfbebe',
    '&:hover': {
      color: 'rgba(191,190,190,0.7)',
    }
  },
  subtitle: {
    color: '#999',
    fontSize: 12,
    fontWeight: 400
  },
  cell: {
    textAlign: 'center',
  },
  leftTopCell: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    zIndex: 1
  },
  rightTopCell: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  info: {
    fontSize: 12,
  },
  price: {
    fontWeight: 500,
    margin: '15px 0'
  },
  shiftRight: {
    marginLeft: theme.spacing(3)
  }
}));

export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: 'none',
      verticalAlign: 'initial'
    },
    head: {
      textAlign: 'center',
      position: 'sticky',
      paddingTop: 30,
      top: 70
    }
  }),
)(TableCell);

interface PlanProps {
  plans: ISubscriptionPlan[];
  currentPlan: ISubscriptionPlan;
  onPlanClick: () => void;
}

const TableView: React.FC<PlanProps> = ({plans, onPlanClick, currentPlan}) => {
  const classes = useStyles();
  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <StyledTableCell className={classNames(classes.head, classes.leftTopCell)}></StyledTableCell>
          {
            plans.map((plan, i) => {

              const className = classNames({
                [classes.head]: true,
                [classes.preferred]: plan.preferred,
                [classes.rightTopCell]: i === 3
              });

              const buttonClassName = classNames({
                [classes.button]: true,
                [classes.buttonPreferred]: plan.preferred
              });

              const linkClassName = classNames({
                [classes.link]: true,
                [classes.linkPreferred]: plan.preferred
              });

              return <StyledTableCell className={className} key={i.toString()}>
                <Typography variant="subtitle1">{Dictionary.value(plan.title)}</Typography>
                <Typography className={classes.subtitle}>
                  {Dictionary.value(plan.subtitle)}
                </Typography>
                {
                  plan.price > 0 && (
                    <Link href={ROUTE_DOCS_PRO_PLAN} target="_blank" className={linkClassName}>
                      {Dictionary.defValue(DictionaryService.keys.proPlan)}
                    </Link>
                  )
                }
                <Typography variant="h5" className={classes.price}>${plan.price.toFixed(2)}</Typography>
                {
                  plan.price > 0 && (
                    <Button
                      onClick={onPlanClick}
                      className={buttonClassName}
                      fullWidth>
                      {Dictionary.value(plan.getStatus(currentPlan.price))}
                    </Button>
                  )
                }
              </StyledTableCell>
            })
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          achievements.map((achievement, i) => (
            <TableRow key={i.toString()}>
              <StyledTableCell className={classes.cellTitle} key={achievement[0]}>
                {achievement[0]}
                {
                  achievement[1] && (
                    <Tooltip placement="top" title={Dictionary.value(achievement[1])} arrow>
                      <IconButton size="small">
                        <InfoRounded className={classes.info}/>
                      </IconButton>
                    </Tooltip>
                  )
                }
              </StyledTableCell>
              {
                plans.map((plan, j) => {
                  const className = classNames({
                    [classes.cell]: true,
                    [classes.preferred]: plan.preferred,
                  });
                  return (
                    <StyledTableCell key={j.toString()} className={className}>
                      {
                        plan.achievements[i] === true ?
                          <Check color={plan.preferred ? 'inherit' : 'primary'} /> :
                          plan.achievements[i] === false ?
                            <Close color="error" /> :
                            plan.achievements[i]
                      }
                    </StyledTableCell>
                  )
                })
              }
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

const CardView: React.FC<PlanProps> = ({plans, onPlanClick, currentPlan}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={1}>
      {
        plans.map((plan, i) => {

          const className = classNames({
            [classes.head]: true,
            [classes.preferred]: plan.preferred,
          });

          const buttonClassName = classNames({
            [classes.button]: true,
            [classes.buttonPreferred]: plan.preferred
          });
          const priceClasses = classNames({
            [classes.price]: true,
            [classes.textWhite]: plan.preferred
          });

          const linkClassName = classNames({
            [classes.link]: true,
            [classes.linkPreferred]: plan.preferred
          });

          return (
            <Grid item xs={12} sm={12} md={6} key={i.toString()}>
              <Card className={className}>
                <CardHeader
                  title={<Typography variant="h2" align="center">{Dictionary.value(plan.title)}</Typography>}
                  subheader={
                    <React.Fragment>
                      <Typography className={classes.subtitle} align="center">
                        {Dictionary.value(plan.subtitle)}
                      </Typography>
                      {
                        plan.price > 0 && (
                          <Link href={ROUTE_DOCS_PRO_PLAN} target="_blank" className={linkClassName}>
                            {Dictionary.defValue(DictionaryService.keys.proPlan)}
                          </Link>
                        )
                      }
                      <Typography variant="h5" className={priceClasses} align="center">
                        ${plan.price.toFixed(2)}
                      </Typography>
                      {
                        plan.price > 0 && (
                          <Button
                            onClick={onPlanClick}
                            className={buttonClassName}
                            fullWidth>
                            {Dictionary.value(plan.getStatus(currentPlan.price))}
                          </Button>
                        )
                      }
                    </React.Fragment>

                  }
                />
                <CardContent>
                  {
                    achievements.map((achievement, j) => (
                      <Typography key={i + '' + j} align="center">
                        {achievement[0]}{' '}
                        {
                          achievement[1] && (
                            <Tooltip placement="top" title={Dictionary.value(achievement[1])} arrow>
                              <IconButton size="small">
                                <InfoRounded
                                  className={classes.info}
                                  style={{color: plan.preferred ? 'white' : 'grey'}}/>
                              </IconButton>
                            </Tooltip>
                          )
                        }
                        <span className={classes.shiftRight}>
                          {
                            plan.achievements[j] === true ?
                              <Check color={plan.preferred ? 'inherit' : 'primary'} /> :
                              plan.achievements[j] === false ?
                                <Close color="error" /> :
                                plan.achievements[j]
                          }
                        </span>
                      </Typography>
                    ))
                  }
                </CardContent>
              </Card>
            </Grid>
          )
        })
      }
    </Grid>
  )
}

const PricesViewComponent: React.FC = () => {
  const classes = useStyles();

  const currentPlan = App.user ? App.user.plan : Plan.free();

  const plans = Array.from(new SubscriptionPlans().plans.values());
  const onPlanClick = () =>
    App.navigationHistory && App.navigationHistory.push(ROUTE_BILLING);

  return (
    <Container component="main">
      <Typography variant="h2" align="center" className={classes.title}>
        {Dictionary.defValue(DictionaryService.keys.editorAndViewerInYourApp)}
      </Typography>
      <Hidden smDown implementation="css">
        <TableView plans={plans} onPlanClick={onPlanClick} currentPlan={currentPlan} />
      </Hidden>
      <Hidden mdUp>
        <CardView plans={plans} onPlanClick={onPlanClick} currentPlan={currentPlan} />
      </Hidden>

    </Container>
  )
};

const PricesView = observer(PricesViewComponent);

const Prices: React.FC = () => {
  return <PricesView />
}

export default Prices;
