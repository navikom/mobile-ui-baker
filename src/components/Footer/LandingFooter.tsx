/*eslint-disable*/
import React from 'react';
// nodejs library to set property for components

// nodejs library that concatenates classes
import classNames from 'classnames';
// material-ui core components
import { List, ListItem, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// @material-ui/icons
import Favorite from '@material-ui/icons/Favorite';

import styles from 'assets/jss/material-kit-react/components/footerStyle';
import {
  ROUTE_DOCS_GET_STARTED,
  ROUTE_EDITOR,
  ROUTE_PRICES,
  TITLE,
  ROUTE_TERMS,
  TERMS_OF_SERVICE,
  TERMS_OF_SUPPORT,
  PRIVACY_POLICY
} from 'models/Constants';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { App } from 'models/App';

const useStyles = makeStyles(styles);

interface FooterProps {
  whiteFont?: boolean;
  darkBlue?: boolean;
  isMobile?: boolean;
}

const Footer: React.FC<FooterProps> = (
  {
    isMobile= false,
    whiteFont = false,
    darkBlue = false
  }) => {
  const classes = useStyles();
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont,
    [classes.darkBlue]: darkBlue
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });

  const linkClasses = classNames({
    [classes.block]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <Grid container justify="space-between">
        <Grid item xs={12} sm={6} md={6}>
          <Grid container style={{ width: 'auto' }}>
            <List className={classes.list}>
              {
                [
                  [ROUTE_EDITOR, DictionaryService.keys.editor],
                  [ROUTE_PRICES, DictionaryService.keys.price],
                  [ROUTE_DOCS_GET_STARTED, DictionaryService.keys.documentation],
                ].map((route, i) => (
                  <ListItem
                    button
                    component="a"
                    key={i.toString()}
                    className={classes.colBlock}
                    onClick={() => App.navigationHistory && App.navigationHistory.push(route[0])}
                  >
                  <span className={linkClasses}>
                    {route[1]}
                  </span>
                  </ListItem>
                ))
              }
            </List>
            <List className={classNames(classes.list, classes.listRight)}>
              {
                [
                  [ROUTE_TERMS + '/' + TERMS_OF_SERVICE, DictionaryService.keys.termsOfService],
                  [ROUTE_TERMS + '/' + PRIVACY_POLICY, DictionaryService.keys.privacyPolicy],
                  [ROUTE_TERMS + '/' + TERMS_OF_SUPPORT, DictionaryService.keys.support],
                ].map((route, i) => (
                  <ListItem
                    button
                    component="a"
                    key={i.toString()}
                    className={classes.colBlock}
                    onClick={() => App.navigationHistory && App.navigationHistory.push(route[0])}
                  >
                  <span className={linkClasses}>
                    {route[1]}
                  </span>
                  </ListItem>
                ))
              }
            </List>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={6}
          md={6}
          justify={isMobile ? 'center' : 'flex-end'}
          alignItems="flex-end"
        >
          &copy; {new Date().getFullYear()} , made with{' '}
          <Favorite className={classes.icon} /> by{' '}
          <a
            href="https://www.muiditor.com"
            className={aClasses}
            target="_blank"
          >
            {TITLE}
          </a>{' '}
          {Dictionary.defValue(DictionaryService.keys.forBetterExperience)}
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
