import React from "react";

// @material-ui/core
import NativeSelect from "@material-ui/core/NativeSelect";

// core components
import BootstrapInput from "components/CustomInput/BootstrapInput";

type CustomSelectType = {
  value?: string | number;
  label?: string;
  options: (string | (string | number)[])[];
  onChange(value: string | number): void;
  fullWidth?: boolean;
  className?: string;
  small?: boolean;
};

const CustomSelect: React.FC<CustomSelectType> = (
  {fullWidth,
    value,
    onChange,
    label,
    options,
    small = false,
    className}
  ) => {
  return (
    <NativeSelect
      fullWidth={fullWidth}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(e.target.value)
      }
      input={<BootstrapInput label={label} root={className} small={small} />}
    >
      {options.map((e: string | (number | string)[], i: number) => (
        <option key={i} value={Array.isArray(e) ? e[0] : e}>
          {Array.isArray(e) ? e[1].toString() : e}
        </option>
      ))}
    </NativeSelect>
  );
}

export default CustomSelect;
