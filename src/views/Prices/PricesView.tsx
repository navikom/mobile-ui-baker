import React from 'react';
import { Grid, Theme } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { StarBorder } from '@material-ui/icons';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { App } from 'models/App';
import { ROUTE_EDITOR, ROUTE_SIGN_UP, ROUTE_USER_PROFILE } from 'models/Constants';
import { observer } from 'mobx-react-lite';
import CheckoutStore from 'views/Checkout/CheckoutStore';

const useStyles = makeStyles((theme: Theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  title: {
    color: theme.palette.background.paper,
    marginBottom: 30
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
  upgraded: {
    ...theme.typography.button,
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    padding: theme.spacing(1),
  }
}));

const PricesView: React.FC = () => {
  const classes = useStyles();
  const checkoutStore = new CheckoutStore(CheckoutStore.PRO_PLAN_CODE);

  const tiers = [
    {
      title: DictionaryService.keys.freePlan,
      price: '0',
      description: [
        'Embed Drag & drop editor',
        'Embed Mobile UI Viewer',
      ],
      buttonText: App.loggedIn ? DictionaryService.keys.getStarted : Dictionary.defValue(DictionaryService.keys.signUpForFree),
      action: () => {
        if (App.loggedIn) {
          App.navigationHistory && App.navigationHistory.push(ROUTE_USER_PROFILE);
        } else {
          App.navigationHistory && App.navigationHistory.push(ROUTE_SIGN_UP);
        }
      },
      buttonVariant: 'outlined',
      upgraded: false
    },
    {
      title: DictionaryService.keys.proPlan,
      subheader: 'Most popular',
      price: '20',
      description: [
        'Includes all Free plan benefits',
        'Ads-free Editor',
        'Editor header & tools customization',
        'Viewer tools customization',
      ],
      buttonText: App.loggedIn ? DictionaryService.keys.upgrade : Dictionary.defValue(DictionaryService.keys.signUpForFree),
      action: () => {
        if (App.loggedIn) {
          checkoutStore.startCheckout();
        } else {
          App.navigationHistory && App.navigationHistory.push(ROUTE_SIGN_UP);
        }
      },
      buttonVariant: 'contained',
      upgraded: App.user && App.user!.proPlan
    }
  ];

  return (
    <Container maxWidth="md" component="main">
      <Typography variant="h4" align="center" className={classes.title}>
        {Dictionary.defValue(DictionaryService.keys.editorAndViewerInYourApp)}
      </Typography>
      <Grid container spacing={5} alignItems="flex-end">
        {tiers.map((tier) => (
          // Enterprise card is full width at sm breakpoint
          <Grid item key={tier.title} xs={12} sm={6} md={6}>
            <Card>
              <CardHeader
                title={Dictionary.defValue(tier.title)}
                subheader={tier.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={tier.title === DictionaryService.keys.proPlan ? <StarBorder color="primary" /> : null}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    ${tier.price}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /mo
                  </Typography>
                </div>
                <ul>
                  {tier.description.map((line) => (
                    <Typography component="li" variant="subtitle1" align="center" key={line}>
                      {line}
                    </Typography>
                  ))}
                </ul>
              </CardContent>
              {
                tier.upgraded ? (
                  <Typography variant="subtitle1" align="center" color="primary" className={classes.upgraded}>
                    {Dictionary.defValue(DictionaryService.keys.upgraded)}
                  </Typography>
                ) : (
                  <CardActions>
                    <Button
                      onClick={tier.action}
                      fullWidth variant={tier.buttonVariant as 'outlined'}
                      color="primary">
                      {tier.buttonText}
                    </Button>
                  </CardActions>
                )
              }
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
};

export default observer(PricesView);
