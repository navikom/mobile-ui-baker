import React from "react";

// @material-ui/core
import { FormControl } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

function LabeledSelect({ ...props }) {
  const inputLabel = React.useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel ref={inputLabel} htmlFor={props.id}>{props.labelTitle}</InputLabel>
      <Select
        native
        value={props.value}
        onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => props.onChange(e.target.value)}
        labelWidth={labelWidth}
        inputProps={{
          name: props.labelTitle,
          id: props.id
        }}
      >
        {
          props.options.map((option: string | number | (string | number)[], index: number) => {
            const value = Array.isArray(option) ? option[0] : option;
            const name = Array.isArray(option) ? option[1] : option;
            return <option key={index} value={value}>{name}</option>;
          })
        }
      </Select>
    </FormControl>
  );
}

export default LabeledSelect;
