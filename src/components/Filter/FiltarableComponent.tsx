import React from "react";
import classNames from "classnames";

// @material-ui/core
import {createStyles, GridSize, makeStyles, Theme} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";

// core components
import AutocompleteInput from "components/CustomInput/AutocompleteInput";
import DateInput from "components/CustomInput/DateInput";
import LabeledInput from "components/CustomInput/LabeledInput";
import AutocompleteSelect from "components/CustomSelect/AutocompleteSelect";
import TimeInput from "components/CustomInput/TimeInput";
import LabeledSelect from "components/CustomSelect/LabeledSelect";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
   container: {
    padding: theme.typography.pxToRem(4)
   }
  })
);

type FormItemType = {
 onChange(e: string | number | Date | (string | number)[], key?: string): void;
 value?: number | string;
 values?: (number | string)[];
 min?: number;
 max?: number;
 date?: Date;
 time?: Date;
 from?: Date;
 to?: Date;
 options?: string[];
 label?: string;
 gridSize?: {xs: GridSize; sm: GridSize; md: GridSize};
 placeholder?: string;
 type?: string;
 disabled?: boolean;
};

function FilterGrid(props: FormItemType) {
 const classes = useStyles();
 const from = props.from !== undefined;
 const to = props.to !== undefined;
 const min = props.min !== undefined;
 const max = props.max !== undefined;
 const container = classNames({
  [classes.container]: !(min && max) && !(from && to)
 });
 const containerInner = classNames({
  [classes.container]: (min && max) || (from && to)
 });
 return (
   <Grid item {...props.gridSize} className={container}>
    {
     props.value !== undefined && props.options && (
       <LabeledSelect
         id={`${props.label}_1`}
         labelTitle={props.label}
         value={props.value}
         onChange={props.onChange}
         options={props.options} />
     )
    }
    {
     props.value !== undefined && !props.options && (
       <FormControl fullWidth>
        <LabeledInput type={props.type} value={props.value} onChange={(e: string) => props.onChange(e, "value")} />
       </FormControl>
     )
    }
    {
     props.date !== undefined && (
       <FormControl fullWidth>
        <DateInput date={props.date} onChange={(e: Date) => props.onChange(e, "date")} disabled={props.disabled} />
       </FormControl>
     )
    }
    {
     props.time !== undefined && (
       <FormControl fullWidth>
        <TimeInput date={props.time} onChange={(e: Date) => props.onChange(e, "time")} label={props.label}
                   disabled={props.disabled} />
       </FormControl>
     )
    }
    {
     props.values !== undefined && (
       <FormControl fullWidth>
        {
         props.options === undefined ? (
           <AutocompleteInput
             values={props.values}
             onChange={(e: string[]) => props.onChange(e, "values")}
           />
         ) : (
           <AutocompleteSelect
             options={props.options}
             values={props.values}
             onChange={props.onChange}
             placeholder={props.placeholder}
             label={props.label} />
         )
        }
       </FormControl>
     )
    }
    {
     from && to && (
       <Grid container>
        <Grid item xs={6} sm={6} md={6} className={containerInner}>
         <FormControl fullWidth>
          <DateInput
            label={Dictionary.defValue(DictionaryService.keys.from)}
            date={props.from} onChange={(e: Date) => props.onChange(e, "from")} />
         </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={6} className={containerInner}>
         <FormControl fullWidth>
          <DateInput
            label={Dictionary.defValue(DictionaryService.keys.to)}
            date={props.to} onChange={(e: Date) => props.onChange(e, "to")} />
         </FormControl>
        </Grid>
       </Grid>
     )
    }
    {
     from && !to && (
       <FormControl fullWidth>
        <DateInput
          label={Dictionary.defValue(DictionaryService.keys.from)}
          date={props.from} onChange={(e: Date) => props.onChange(e, "from")} />
       </FormControl>
     )
    }
    {
     !from && to && (
       <FormControl fullWidth>
        <DateInput
          label={Dictionary.defValue(DictionaryService.keys.to)}
          date={props.to} onChange={(e: Date) => props.onChange(e, "to")} />
       </FormControl>
     )
    }
    {
     min && max && (
       <Grid container>
        <Grid item xs={6} sm={6} md={6} className={containerInner}>
         <FormControl fullWidth>
          <LabeledInput
            label={Dictionary.defValue(DictionaryService.keys.min)}
            value={props.min} onChange={(e: string) => props.onChange(e, "min")} />
         </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={6} className={containerInner}>
         <FormControl fullWidth>
          <LabeledInput
            label={Dictionary.defValue(DictionaryService.keys.max)}
            value={props.max} onChange={(e: string) => props.onChange(e, "max")} />
         </FormControl>
        </Grid>
       </Grid>
     )
    }
    {
     min && !max && (
       <FormControl fullWidth>
        <LabeledInput
          label={Dictionary.defValue(DictionaryService.keys.min)}
          value={props.min} onChange={(e: string) => props.onChange(e, "min")} />
       </FormControl>
     )
    }
    {
     !min && max && (
       <FormControl fullWidth>
        <LabeledInput
          label={Dictionary.defValue(DictionaryService.keys.max)}
          value={props.max} onChange={(e: string) => props.onChange(e, "max")} />
       </FormControl>
     )
    }
   </Grid>
 );
}

function FiltarableComponent({...props}) {
 const data = [props.first, props.second, props.third, props.fourth].filter(e => e !== undefined);
 const gridSize = {xs: 10, sm: 3, md: 3};
 if (data.length <= 2) {
  gridSize.sm = gridSize.md = 6;
 }
 if (data.length === 3) {
  gridSize.sm = gridSize.md = 4;
 }
 return (
   <Grid container>
    {
     data.map((prop, i: number) => <FilterGrid key={i} gridSize={gridSize} {...prop} />)
    }
   </Grid>
 );
}

export default FiltarableComponent;
