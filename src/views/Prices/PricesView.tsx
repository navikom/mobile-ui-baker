import React, { useEffect } from 'react';
import { when } from 'mobx';
import { observer, useDisposable } from 'mobx-react-lite';
import classNames from 'classnames';
import { Check, Close, InfoRounded } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import { Theme, TableHead, TableBody, withStyles, createStyles } from '@material-ui/core';
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
import { ROUTE_BILLING } from 'models/Constants';
import { roseColor, whiteColor } from 'assets/jss/material-dashboard-react';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    color: theme.palette.background.paper,
    marginBottom: 30
  },
  table: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
    boxShadow: '0 2px 48px 0 rgba(255,255,255,0.2)'
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
      paddingTop: 10,
      top: 0
    }
  }),
)(TableCell);


const PricesViewComponent: React.FC = () => {
  const classes = useStyles();

  const currentPlan = App.user ? App.user.plan : Plan.free();

  const plans = Array.from(new SubscriptionPlans().plans.values());
  const onPlanClick = () =>
    App.navigationHistory && App.navigationHistory.push(ROUTE_BILLING);

  return (
    <Container component="main">
      <Typography variant="h4" align="center" className={classes.title}>
        {Dictionary.defValue(DictionaryService.keys.editorAndViewerInYourApp)}
      </Typography>
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

                return <StyledTableCell className={className} key={i.toString()}>
                  <Typography variant="subtitle1">{Dictionary.value(plan.title)}</Typography>
                  <Typography className={classes.subtitle}>
                    {Dictionary.value(plan.subtitle)}
                  </Typography>
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
    </Container>
  )
};

const PricesView = observer(PricesViewComponent);

const Prices: React.FC = () => {
  const dispose = useDisposable(() =>
    when(() => App.loggedIn, async () => {
      // App.fetchUserSubscription();
    })
  );

  useEffect(() => {
    return () => dispose();
  }, [dispose]);
  return <PricesView />
}

export default Prices;
