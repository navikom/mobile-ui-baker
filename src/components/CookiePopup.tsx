import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { blackOpacity, whiteColor, whiteOpacity } from 'assets/jss/material-dashboard-react';
import { App } from 'models/App';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { ROUTE_TERMS, PRIVACY_POLICY } from 'models/Constants';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    bottom: -100,
    width: '100%',
    height: 60,
    backgroundColor: blackOpacity(.8),
    boxShadow: '0 10px 24px 0 rgba(54, 61, 77, 0.15)',
    color: whiteColor,
    zIndex: 99,
    transition: 'all 400ms linear',
  },
  link: {
    color: whiteColor,
    '&:hover': {
      color: whiteOpacity(.7),
    }
  },
  button: {
    marginLeft: theme.spacing(3)
  },
  active: {
    bottom: 0
  }
}))

const CookiePopup: React.FC = observer(() => {
  const classes = useStyles();
  const root = classNames({
    [classes.root]: true,
    [classes.active]: App.cookiePopup
  })

  return (
    <div className={root} onClick={() => App.setCookiePopup(false)}>
      <Typography>
        {Dictionary.defValue(DictionaryService.keys.byUsingOurWebsite)}{' '}
        <Link underline="always" href={ROUTE_TERMS + '/' + PRIVACY_POLICY} target="_blank" className={classes.link}>
          {Dictionary.defValue(DictionaryService.keys.privacyPolicy)}
        </Link>
      </Typography>
      <Button
        size="small"
        onClick={() => App.setCookiePopup(false)}
        variant="contained"
        className={classes.button}
        >
        {Dictionary.defValue(DictionaryService.keys.accept)}
      </Button>
    </div>
  )
})
export default CookiePopup;
