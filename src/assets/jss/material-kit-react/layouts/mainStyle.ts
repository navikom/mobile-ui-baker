import { container } from "assets/jss/material-kit-react";
import { createStyles, makeStyles } from '@material-ui/core';

const mainLayoutStyle = makeStyles(theme => createStyles({
  container: {
    ...container,
    zIndex: 2,
    position: "relative",
    color: "#FFFFFF",
    marginTop: '-15%',
    paddingBottom: "150px",
    [theme.breakpoints.up("xs")]: {
      paddingLeft: "0",
      paddingRight: "0",
    }
  },
  pageHeader: {
    minHeight: "60vh",
    height: "auto",
    display: "inherit",
    position: "relative",
    margin: "0",
    padding: "0",
    border: "0",
    alignItems: "center",
    "&:before": {
      backgroundColor: "#36275d"
    },
    "&:before,&:after": {
      position: "absolute",
      zIndex: 1,
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: '""'
    },
    "& footer li a,& footer li a:hover,& footer li a:active": {
      color: "#FFFFFF"
    },
    "& footer": {
      position: "absolute",
      bottom: "0",
      width: "100%"
    }
  },
  mobileContainer: {
    marginTop: '-85%',
  },
  gradientLightBlue: {
    "&:after": {
      background: 'linear-gradient(-45deg, rgba(156,39,176,0.83) 0%, rgba(28,206,234,0.82) 100%)',
    }
  }
}));

export default mainLayoutStyle;
