import React from "react";
import { observer } from "mobx-react-lite";
import { FormControl, makeStyles } from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import IEditorTabsProps from "interfaces/IEditorTabsProps";
import ColorInput from "components/CustomInput/ColorInput";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {
  CloudUpload,
} from "@material-ui/icons";
import { blackOpacity } from "assets/jss/material-dashboard-react";
import { Mode } from "enums/ModeEnum";
import TextInput from "components/CustomInput/TextInput";

const useStyles = makeStyles(theme => ({
  root: {},
  container: {
    marginTop: theme.typography.pxToRem(10),
    padding: 5
  },
  title: {
    marginTop: 5,
    padding: 5,
    backgroundColor: blackOpacity(0.05)
  },
  tools: {
    padding: 3,
    backgroundColor: blackOpacity(0.03)
  },
  input: {
    backgroundColor: blackOpacity(0.001),
    textOverflow: "ellipsis",
    fontSize: 17
  }
}));

const ProjectTab: React.FC<IEditorTabsProps> = (
  {
    mode,
    switchMode,
    background,
    setBackground,
    statusBarColor,
    setStatusBarColor,
    saveProject,
    savingProject,
    project,
    changeProjectTitle,
    dictionary
  }
) => {
  const classes = useStyles();
  return (<div className={classes.root}>
    <Grid container className={classes.title}>
      <TextInput
        fullWidth
        className={classes.input}
        value={project!.title}
        onChange={(e) => changeProjectTitle && changeProjectTitle(e.currentTarget.value)}
      />
    </Grid>
    <Grid container justify="space-between" className={classes.tools}>
      <Tooltip
        title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.project)}`}>
        <IconButton size="small" onClick={saveProject} disabled={savingProject}>
          <CloudUpload />
        </IconButton>
      </Tooltip>
    </Grid>
    <Grid container className={classes.container}>
      <FormControl component="fieldset">
        <FormLabel>{dictionary!.defValue(EditorDictionary.keys.mode).toUpperCase()}</FormLabel>
        <RadioGroup row aria-label="mode" name="mode" value={mode} onChange={switchMode}>
          <FormControlLabel value={Mode.WHITE} control={<Radio color="primary" />}
                            label={dictionary!.defValue(EditorDictionary.keys.white)} />
          <FormControlLabel value={Mode.DARK} control={<Radio color="primary" />}
                            label={dictionary!.defValue(EditorDictionary.keys.dark)} />
        </RadioGroup>
      </FormControl>
    </Grid>
    <Grid container className={classes.container} justify="space-between">
      <FormControl component="fieldset">
        <FormLabel
          style={{ marginBottom: 10 }}>{dictionary!.defValue(EditorDictionary.keys.statusBar).toUpperCase()}</FormLabel>
        <ColorInput
          color={statusBarColor!.toString()}
          onChange={(e) => setStatusBarColor && setStatusBarColor(e)}
          label={dictionary!.defValue(EditorDictionary.keys.background)} />
      </FormControl>
      <FormControl component="fieldset">
        <FormLabel
          style={{ marginBottom: 10 }}>{dictionary!.defValue(EditorDictionary.keys.background).toUpperCase()}</FormLabel>
        <ColorInput
          color={background!.backgroundColor}
          onChange={(e) => setBackground && setBackground({ backgroundColor: e })}
          label={dictionary!.defValue(EditorDictionary.keys.background)} />
      </FormControl>
    </Grid>
  </div>)
};

export default observer(ProjectTab);
