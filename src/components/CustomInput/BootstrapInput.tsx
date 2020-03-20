import React from "react";
import classNames from "classnames";

// @material-ui/core
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";

import {
  dangerColor,
  primaryColor,
  whiteColor
} from "assets/jss/material-dashboard-react";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative"
    },
    label: {
      top: theme.typography.pxToRem(-10),
      left: theme.typography.pxToRem(10),
      position: "absolute",
      backgroundColor: whiteColor,
      paddingLeft: theme.typography.pxToRem(3),
      paddingRight: theme.typography.pxToRem(3),
      borderRadius: theme.typography.pxToRem(10)
    },
    labelError: {
      color: dangerColor[0]
    },
    inputSuccess: {
      border: "1px solid #ced4da"
    },
    inputError: {
      border: "1px solid " + dangerColor[0]
    }
  })
);

const Input = ({ ...props }) => {
  const classes = useStyles();
  const underline = classNames({
    [props.classes.input]: true,
    [classes.inputError]: props.error,
    [classes.inputSuccess]: !props.error
  });
  const labelStyle = classNames({
    [classes.label]: true,
    [classes.labelError]: props.error
  });

  return (
    <div className={classes.root}>
      <InputBase
        {...props}
        classes={{ input: underline }}
        endAdornment={null}
      />
      {props.label && <label className={labelStyle}>{props.label}</label>}
      {props.error && (
        <FormHelperText className={classes.labelError}>
          {props.endAdornment}
        </FormHelperText>
      )}
    </div>
  );
};

export const ThemedInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "label + &": {
        marginTop: theme.spacing(3)
      }
    },
    input: {
      borderRadius: 4,
      position: "relative",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(","),
      "&:focus": {
        borderRadius: 4,
        borderWidth: 2,
        backgroundColor: whiteColor,
        borderColor: primaryColor[0]
      }
    }
  })
);

export default ThemedInput(Input);
