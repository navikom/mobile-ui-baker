import React from "react";
import classNames from "classnames";
import useStyles from "components/CustomInput/inputStyles";

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
  onClick?: (e: any) => void;

  /**
   * Read only mode. Default: false
   */
  disabled?: boolean;

  /**
   * Stretch to max width. Default: false
   */
  fullWidth?: boolean;

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

const TextInput: React.FC<Props> = ({ fullWidth, className, error, ...otherProps }) => {
  const classes = useStyles();
  return <input
    className={classNames(classes.input, className, { [classes.fullWidth]: fullWidth, [classes.error]: error })}
    {...otherProps}
  />
};

export default TextInput;
