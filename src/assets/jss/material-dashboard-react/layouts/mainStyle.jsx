import {
  transition,
  container,
  blackColor
} from "assets/jss/material-dashboard-react.ts";
import { createStyles } from '@material-ui/core';

const appStyle = (theme) => createStyles({
  content: {
    padding: "30px 15px",
    minHeight: "calc(100vh - 60px)",
    position: "relative",
    zIndex: 3,
    ...transition
  },
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh"
  },
  fullPage: {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: "0",
    left: "0",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    "&:before": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      content: "\"\"",
      display: "block",
      background: blackColor,
      opacity: .8
    }
  },
  container
});

export default appStyle;
