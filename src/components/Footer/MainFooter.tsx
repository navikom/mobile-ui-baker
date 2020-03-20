import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import footerStyle from "assets/jss/material-dashboard-react/components/footerStyle.ts";

function Footer({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.mainFooter}>
      <div className={classes.container}>
        <div className={classes.left} />
        <p className={classes.right} style={{ paddingRight: "15px" }}>
          <span>
            &copy; {new Date().getFullYear()}{" "}
            <a href="http://webinsolut.com" className={classes.a}>
              WebInSolut
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
