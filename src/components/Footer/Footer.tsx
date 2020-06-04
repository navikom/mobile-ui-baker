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
import { ROUTE_DOCS_GET_STARTED, ROUTE_EDITOR, ROUTE_PROJECTS, ROUTE_TERMS, TITLE } from '../../models/Constants';

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            {
              [
                ['/', DictionaryService.keys.home],
                [ROUTE_PROJECTS, DictionaryService.keys.projects],
                [ROUTE_EDITOR, DictionaryService.keys.editor],
                [ROUTE_DOCS_GET_STARTED, DictionaryService.keys.documentation],
                [ROUTE_TERMS, DictionaryService.keys.termsAndConditions]
              ].map((route, i) => (
                <ListItem key={i.toString()} className={classes.inlineBlock}>
                  <Link href={route[0]} className={classes.block}>
                    {Dictionary.defValue(route[1])}
                  </Link>
                </ListItem>
              ))
            }
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
