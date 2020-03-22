import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import classNames from "classnames";
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
    fillWidth: {
      width: "100%"
    },
    error: {
      border: "1px solid " + dangerColor[1],
      backgroundColor: dangerColor[0]
    }
  })
);

interface Props {
  /**
   * Input value type
   */
  type?: "text" | "number" | "email" | "password";

  /**
   * Identifier for form submit
   */
  name?: string;

  /**
   * Placeholder to show when empty
   */
  placeholder?: string;

  /**
   * Register callback for change event
   */
  onChange?: (e: any) => void;

  /**
   * Register callback for focus event
   */
  onClick?: () => void;

  /**
   * Read only mode. Default: false
   */
  disabled?: boolean;

  /**
   * Stretch to max width. Default: false
   */
  fillWidth?: boolean;

  /**
   * Display error state
   */
  error?: boolean;

  /**
   * input className
   */
  className?: string;

  /**
   * Current value of input
   */
  value?: string;

  /**
   * React ref passtrough to input node
   */
  ref?: React.Ref<HTMLInputElement>;
}

const TextInput: React.FC<Props> = ({ fillWidth, className, error, ...otherProps }) => {
  const classes = useStyles();
  return <input
    className={classNames(classes.input, className, { [classes.fillWidth]: fillWidth, [classes.error]: error })}
    {...otherProps}
  />
};

export default TextInput;
