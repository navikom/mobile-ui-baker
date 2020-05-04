import React from "react";
import classNames from "classnames";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Checkbox, makeStyles } from "@material-ui/core";
import { dangerColor } from "assets/jss/material-dashboard-react";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    checkboxError: {
      color: dangerColor[0]
    }
  })
);

interface Props {
  label: string;
  checked?: boolean;
  onChange?: () => void;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  error?: boolean;
}

const CustomCheckbox: React.FC<Props> = (
  { label, error, ...rest }
) => {
  const classes = useStyles();

  const errorClass = classNames({
    [classes.checkboxError]: error
  })

  return (
    <FormControlLabel
      label={<Typography className={errorClass}>{label}</Typography>}
      control={<Checkbox color="primary" className={errorClass} />}
      {...rest}
    />
  )
};

export default CustomCheckbox;
