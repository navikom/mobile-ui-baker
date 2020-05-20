import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import footerStyle from "assets/jss/material-dashboard-react/components/footerStyle";
import { Dictionary, DictionaryService } from '../../services/Dictionary/Dictionary';
import { Link } from '@material-ui/core';
import { ROUTE_DOCS_GET_STARTED, ROUTE_EDITOR, ROUTE_PROJECTS, TITLE } from '../../models/Constants';

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <Link href="/" className={classes.block}>
                {Dictionary.defValue(DictionaryService.keys.home)}
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link href={ROUTE_PROJECTS} className={classes.block}>
                {Dictionary.defValue(DictionaryService.keys.projects)}
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link href={ROUTE_EDITOR} className={classes.block}>
                {Dictionary.defValue(DictionaryService.keys.editor)}
              </Link>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Link href={ROUTE_DOCS_GET_STARTED} className={classes.block}>
                {Dictionary.defValue(DictionaryService.keys.documentation)}
              </Link>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy; {new Date().getFullYear()}{" "}
            <a href="https://muiditor.com" className={classes.a}>
              {TITLE}
            </a>
            , made with love for a better web
          </span>
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(Footer);
