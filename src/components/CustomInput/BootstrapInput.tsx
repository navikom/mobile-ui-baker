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
import { WithStyles } from '@material-ui/core/styles/withStyles';

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

interface InputProps extends WithStyles {
  fullWidth?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  small?: boolean;
  error?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  value?: string;
  root?: string;
  label?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ small, ...props }) => {
  const classes = useStyles();
  const underline = classNames({
    [props.classes.input]: true,
    [props.classes.inputSmall]: small,
    [classes.inputError]: props.error,
    [classes.inputSuccess]: !props.error
  });
  const labelStyle = classNames({
    [classes.label]: true,
    [classes.labelError]: props.error
  });

  const root = classNames(classes.root, props.root || {});

  return (
    <div className={root}>
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
      padding: "7px 26px 7px 12px",
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
        borderWidth: 1,
        backgroundColor: whiteColor,
        borderColor: primaryColor[0]
      }
    },
    inputSmall: {
      borderRadius: 2,
      fontSize: 13,
      padding: "2px 26px 6px 12px",
    }
  })
);

export default ThemedInput(Input);
