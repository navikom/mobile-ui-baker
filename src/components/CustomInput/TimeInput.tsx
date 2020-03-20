import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core";
import { primaryColor } from "assets/jss/material-dashboard-react";

const CustomDateInput = ({ ...props }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TimePicker
        disabled={props.disabled}
        className={props.classes.picker}
        margin="normal"
        label={props.label || ""}
        value={props.date}
        onChange={props.onChange}
        inputVariant="outlined"
        inputProps={{
          className: props.classes.input
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default withStyles({
  input: {
    padding: "11px 12px"
  },
  picker: {
    marginTop: 0,
    marginBottom: 0,
    "&:hover": {
      borderWidth: 1,
      borderColor: primaryColor[0]
    },
    "&:focus": {
      borderWidth: 1,
      borderRadius: 4,
      borderColor: primaryColor[0],
      boxShadow: "0 0 0 0.2rem rgba(156,39,176,.25)"
    }
  }
})(CustomDateInput);
