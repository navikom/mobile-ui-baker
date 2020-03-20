import { withStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import React from "react";

const Input = ({ ...props }) => {
  return (
    <TextField
      {...props}
      variant="outlined"
      fullWidth
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        props.onChange(e.target.value)
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
