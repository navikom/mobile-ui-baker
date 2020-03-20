import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { whiteColor } from "assets/jss/material-dashboard-react";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      textAlign: "center"
    },
    button: {
      color: whiteColor,
      opacity: 0.7,
      "&:hover": {
        opacity: 0.9
      }
    },
    buttonAdd: {
      marginTop: theme.typography.pxToRem(20)
    }
  })
);
