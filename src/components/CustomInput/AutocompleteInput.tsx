import React, { useState } from "react";

// @material-ui/core
import { withStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";

// @material-ui/icons
import { Close } from "@material-ui/icons";

import Autocomplete from "@material-ui/lab/Autocomplete";

import { primaryColor } from "assets/jss/material-dashboard-react";

function Input({ ...props }) {
  const [value, setValue] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const data = val.split(",");
      props.values.push(data[0]);
      props.onChange(props.values.slice());
      setValue("");
    } else {
      setValue(val);
    }
  };

  const onBlur = () => {
    if (value.length) {
      props.values.push(value);
      props.onChange(props.values.slice());
      setValue("");
    }
  };
  return (
    <TextField
      {...props}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      variant="outlined"
      label=""
      fullWidth
    />
  );
}

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

function CustomAutocomplete({ ...props }) {
  return (
    <div className={props.classes.root}>
      <Autocomplete
        size="small"
        multiple
        id="tags-outlined"
        value={props.values}
        closeIcon={null}
        renderTags={(value: (string | number)[], getTagProps) =>
          value.map((option: string | number, index: number) => (
            <Chip
              key={index}
              label={option}
              clickable
              size="small"
              {...getTagProps({ index })}
              onDelete={() => {
                props.values.splice(index, 1);
                props.onChange(props.values.slice());
              }}
            />
          ))
        }
        open={false}
        popupIcon={null}
        renderInput={(params: any) => (
          <AutocompleteInput
            {...params}
            placeholder="values"
            onChange={props.onChange}
            values={props.values}
          />
        )}
      />
      {props.values.length > 0 && (
        <IconButton
          size="small"
          className={props.classes.closeIcon}
          onClick={() => props.onChange([])}
        >
          <Close />
        </IconButton>
      )}
    </div>
  );
}

export default withStyles({
  root: {
    position: "relative"
  },
  closeIcon: {
    position: "absolute",
    right: 5,
    top: "50%",
    transform: "translate(0,-50%)",
    opacity: 0.6
  }
})(CustomAutocomplete);
