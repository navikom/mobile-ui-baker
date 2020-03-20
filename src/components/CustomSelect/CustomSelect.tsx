import React from "react";

// @material-ui/core
import NativeSelect from "@material-ui/core/NativeSelect";

// services
import { Dictionary } from "services/Dictionary/Dictionary";

// core components
import BootstrapInput from "components/CustomInput/BootstrapInput";

type CustomSelectType = {
  value?: string | number;
  label?: string;
  options: (string | (string | number)[])[];
  onChange(value: string | number): void;
};

function CustomSelect(props: CustomSelectType) {
  return (
    <NativeSelect
      fullWidth
      value={props.value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        props.onChange(e.target.value)
      }
      input={<BootstrapInput label={props.label} />}
    >
      {props.options.map((e: string | (number | string)[], i: number) => (
        <option key={i} value={Array.isArray(e) ? e[0] : e}>
          {Dictionary.value(Array.isArray(e) ? e[1].toString() : e)}
        </option>
      ))}
    </NativeSelect>
  );
}

export default CustomSelect;
