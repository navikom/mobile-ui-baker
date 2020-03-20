import React from "react";
import { withStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import { primaryColor } from "assets/jss/material-dashboard-react";

const Input = ({ ...props }) => {
  return <TextField {...props} variant="outlined" fullWidth />;
};

const AutocompleteInput = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "1px solid #ced4da",
        padding: "10px 26px 10px 12px"
      },
      "&:hover fieldset": {
        borderColor: primaryColor[0]
      },
      "&.Mui-focused fieldset": {
        borderWidth: "2px",
        borderColor: primaryColor[0]
      }
    }
  }
})(Input);

function AutocompleteSelect({ ...props }) {
  return (
    <Autocomplete
      {...props}
      filterSelectedOptions
      multiple
      size="small"
      options={props.options}
      getOptionLabel={
        props.getOptionLabel ? props.getOptionLabel : (option: string) => option
      }
      value={props.values}
      renderInput={params => (
        <AutocompleteInput
          {...params}
          label={props.label}
          placeholder={props.placeholder}
          onChange={props.onChange}
        />
      )}
    />
  );
}

export default AutocompleteSelect;
