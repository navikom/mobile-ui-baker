import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";
import React, {useState} from "react";
import validate from "validate.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import LabeledInput from "components/CustomInput/LabeledInput";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {observer} from "mobx-react-lite";
import {ITestSegment, ITestStep} from "interfaces/ITestStep";
import {createStyles, Grid, makeStyles, Theme} from "@material-ui/core";
import FiltarableComponent from "components/Filter/FiltarableComponent";
import {TestStepStore} from "views/Campaigns/store/TestStepStore";
import Typography from "@material-ui/core/Typography";
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import classNames from "classnames";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
   container: {
    marginTop: theme.typography.pxToRem(20)
   },
   label: {
    width: theme.typography.pxToRem(100),
   }
  }));

const SegmentDialog = (props: {store: ITestStep}) => {
 const constraints = {
  name: {
   presence: {
    message: `^${Dictionary.defValue(DictionaryService.keys.cantBeEmpty, Dictionary.defValue(DictionaryService.keys.name))}`
   },
   length: {
    minimum: 2,
    maximum: 50,
    message: `^${Dictionary.defValue(DictionaryService.keys.cantBeMoreAndLessThan, [Dictionary.defValue(DictionaryService.keys.name), "50", "2"])}`
   }
  }
 };

 const [errors, setErrors] = useState<{[key: string]: string} | undefined>(undefined);

 const {store} = props;
 const classes = useStyles();
 const extraClasses = extraStyles();
 const centerNote = classNames(classes.note, classes.center, extraClasses.label);

 const onChange = (name: string) => {
  setErrors(validate({name}, constraints));
  store.currentSegment.update({name} as ITestSegment);
 };

 const first = {
  value: store.currentSegment.propertyName,
  options: TestStepStore.propertyNames,
  onChange: (propertyName: string) => store.currentSegment.update({propertyName} as ITestSegment),
  label: Dictionary.defValue(DictionaryService.keys.userAttributes)
 };

 const second = {
  values: store.currentSegment.propertyValues,
  onChange: (propertyValues: (string | number)[]) => store.currentSegment.update({propertyValues} as ITestSegment)
 };

 return (
   <Dialog open={store.open} onClose={() => store.setOpen(false)} aria-labelledby="form-dialog-title" fullWidth
           maxWidth="md">
    <DialogTitle id="form-dialog-title">
     {Dictionary.defValue(DictionaryService.keys.segment)} {Dictionary.defValue(DictionaryService.keys.name)}
    </DialogTitle>
    <DialogContent>
     <DialogContentText>
      {Dictionary.defValue(DictionaryService.keys.testSendMessageDescription)}.
     </DialogContentText>
      <Grid item xs={12} sm={6} md={6}>
       <LabeledInput
         error={errors !== undefined}
         margin="dense"
         value={store.currentSegment.name}
         onChange={onChange}
         id="name"
         label={Dictionary.defValue(DictionaryService.keys.Test) + " " + Dictionary.defValue(DictionaryService.keys.segment) + " " + Dictionary.defValue(DictionaryService.keys.name)}
         helperText={errors && errors.name}
         fullWidth
       />
      </Grid>
     <Grid container item direction="row" className={extraClasses.container}>
      <Typography variant="subtitle2" className={centerNote}>
       {Dictionary.defValue(DictionaryService.keys.filter)}
      </Typography>
      <Grid container item xs={12} sm={10} md={10}>
       <FiltarableComponent first={first} second={second} />
      </Grid>
     </Grid>
    </DialogContent>
    <DialogActions>
     <Button onClick={() => store.setOpen(false)} color="primary">
      {Dictionary.defValue(DictionaryService.keys.cancel)}
     </Button>
     <Button disabled={errors !== undefined || store.currentSegment.name.length === 0} onClick={store.save}
             color="primary">
      {Dictionary.defValue(DictionaryService.keys.save)}
     </Button>
    </DialogActions>
   </Dialog>
 );
};

export default observer(SegmentDialog);
