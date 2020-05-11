import React from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    padding: 0
  },
  input: {
    padding: 0,
    position: "absolute",
    top: "50%",
    left: 5,
    transform: "translate(0, -50%)",
    height: 35,
    width: 35,
    border: "none"
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
    ...rest
  }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TextField
        {...rest}
        variant="outlined"
        inputProps={{
          style: { marginLeft: 40, width: 70 }
        }}
        value={color}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange && onChange(e.target.value)
        }
      />
      <input type="color" className={classes.input} value={color} onChange={(e) =>
        onChange && onChange(e.currentTarget.value)} />
    </div>
  );
};

export default withStyles({
  root: {
    "& .MuiInputBase-root": {
      padding: 0
    }
  }
})(ColorInput);

