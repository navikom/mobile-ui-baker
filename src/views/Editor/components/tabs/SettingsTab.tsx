import React from "react";
import { observer } from "mobx-react-lite";
import { FormControl, makeStyles } from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import { Mode } from "views/Editor/store/EditorViewStore";
import IEditorTabsProps from "interfaces/IEditorTabsProps";
import ColorInput from "components/CustomInput/ColorInput";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.typography.pxToRem(5)
  },
  container: {
    marginTop: theme.typography.pxToRem(10)
  }
}));

const SettingsTab: React.FC<IEditorTabsProps> = (
  {mode, switchMode, background, setBackground, dictionary}
) => {
  const classes = useStyles();
  return (<div className={classes.root}>
    <Grid container>
      <FormControl component="fieldset">
        <FormLabel>{dictionary!.defValue(EditorDictionary.keys.mode).toUpperCase()}</FormLabel>
        <RadioGroup row aria-label="mode" name="mode" value={mode} onChange={switchMode}>
          <FormControlLabel value={Mode.WHITE} control={<Radio color="primary" />} label={dictionary!.defValue(EditorDictionary.keys.white)} />
          <FormControlLabel value={Mode.DARK} control={<Radio color="primary" />} label={dictionary!.defValue(EditorDictionary.keys.dark)} />
        </RadioGroup>
      </FormControl>
    </Grid>
    <Grid container className={classes.container} justify="space-between">
      <FormControl component="fieldset">
        <FormLabel style={{marginBottom: 10}}>{dictionary!.defValue(EditorDictionary.keys.statusBar).toUpperCase()}</FormLabel>
        <ColorInput
          color={background!.backgroundColor}
          onChange={(e) => setBackground && setBackground({backgroundColor: e})}
          label={dictionary!.defValue(EditorDictionary.keys.background)} />
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel style={{marginBottom: 10}}>{dictionary!.defValue(EditorDictionary.keys.background).toUpperCase()}</FormLabel>
        <ColorInput
          color={background!.backgroundColor}
          onChange={(e) => setBackground && setBackground({backgroundColor: e})}
          label={dictionary!.defValue(EditorDictionary.keys.background)} />
      </FormControl>
    </Grid>
  </div>)
};

export default observer(SettingsTab);
