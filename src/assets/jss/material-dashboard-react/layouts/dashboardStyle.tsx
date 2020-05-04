import {
  drawerWidth,
  transition,
  container
} from "assets/jss/material-dashboard-react";
import { Theme, createStyles, makeStyles } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      position: "relative",
      top: "0",
      height: "100vh"
    },
    mainPanel: {
      [theme.breakpoints.up("md")]: {
        width: `calc(100% - ${drawerWidth}px)`
      },
      overflow: "auto",
      position: "relative",
      float: "right",
      ...transition,
      maxHeight: "100%",
      width: "100%",
      overflowScrolling: "touch"
    },
    content: {
      marginTop: "70px",
      padding: "30px 15px",
      minHeight: "calc(100vh - 123px)"
    },
    container,
    map: {
      marginTop: "70px"
    }
  })
);
