/*eslint-disable*/
import React from "react";
// nodejs library to set property for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import styles from "assets/jss/material-kit-react/components/footerStyle";
import { ROUTE_EDITOR, ROUTE_PRICES, TITLE } from '../../models/Constants';
import { Dictionary, DictionaryService } from '../../services/Dictionary/Dictionary';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(styles);

interface FooterProps {
  whiteFont?: boolean;
}

const Footer: React.FC<FooterProps> = ({whiteFont = false}) => {
  const classes = useStyles();
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://www.muiditor.com"
                className={classes.block}
              >
                {TITLE}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link
                to={ROUTE_EDITOR}
                className={classes.block}
                target="_blank"
              >
                {Dictionary.defValue(DictionaryService.keys.editor)}
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link
                to={ROUTE_PRICES}
                className={classes.block}
                target="_blank"
              >
                {Dictionary.defValue(DictionaryService.keys.price)}
              </Link>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {new Date().getFullYear()} , made with{" "}
          <Favorite className={classes.icon} /> by{" "}
          <a
            href="https://www.muiditor.com"
            className={aClasses}
            target="_blank"
          >
            {TITLE}
          </a>{" "}
          {Dictionary.defValue(DictionaryService.keys.forBetterExperience)}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
