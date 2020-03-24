import React from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import LabeledInput from "components/CustomInput/LabeledInput";
import setContrast from "utils/color";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative"
  },
  input: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    opacity: 0,
  }
}));

interface ColorInputProps {
  color: string;
  label?: React.ReactNode;
  onChange?: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = (
  {
    color,
    onChange,
    label,
    ...rest }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <LabeledInput
        {...rest}
        className={classes.root}
        style={{ width: 130 }}
        value={color}
        inputProps={{
          style: { color: setContrast(color), height: 25, padding: "3px 5px", backgroundColor: color }
        }}
      />
      <input type="color" className={classes.input} value={color} onChange={(e) => onChange && onChange(e.currentTarget.value)} />
    </div>
  );
};

export default withStyles({
  root: {
    "& .MuiInputBase-root": {
      padding: "5px 8px"
    }
  }
})(ColorInput);

