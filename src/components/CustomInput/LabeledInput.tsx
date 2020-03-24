import React, { CSSProperties } from "react";
import { InputBaseComponentProps, PropTypes, withStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

interface InputProps {
  onChange?: (value: string | number) => void;
  className?: string;
  type?: string;
  style?: CSSProperties;
  label?: React.ReactNode;
  value?: string | number;
  error?: boolean;
  margin?: PropTypes.Margin;
  id?: string;
  helperText?: string;
  fullWidth?: boolean;
  inputProps?: InputBaseComponentProps;
}
const Input: React.FC<InputProps> = ({ onChange, ...props }) => {
  return (
    <TextField
      {...props}
      variant="outlined"
      fullWidth
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange && onChange(e.target.value)
      }
    />
  );
};

export default withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "1px solid #ced4da",
        padding: "10px 26px 10px 12px"
      }
    }
  }
})(Input);
