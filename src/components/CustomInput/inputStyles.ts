import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { dangerColor, inheritColor, primaryColor } from "assets/jss/material-dashboard-react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      fontSize: theme.typography.pxToRem(14),
      lineHeight: "150%",
      fontWeight: 500,
      transition: "all 0.1s",
      padding: "5px 10px",
      border: '1px solid transparent',
      "&::placeholder": {
        fontSize: theme.typography.pxToRem(14),
      },
      "&:hover": {
        borderColor: primaryColor[1]
      },
      "&:focus": {
        borderColor: primaryColor[0]
      },

      "&:disabled": {
        color: inheritColor[0],
        opacity: 1
      }
    },
    fullWidth: {
      width: "100%"
    },
    error: {
      border: "1px solid " + dangerColor[1],
      backgroundColor: dangerColor[0]
    }
  })
);

export default useStyles;
