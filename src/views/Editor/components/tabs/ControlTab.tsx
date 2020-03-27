import React from "react";
import { ControlEnum } from "models/ControlEnum";
import EditorViewStore from "views/Editor/store/EditorViewStore";
import ControlTabItem from "views/Editor/components/tabs/ControlTabItem";
import { makeStyles } from "@material-ui/core";
import CustomDragLayer from "views/Editor/components/CustomDragLayer";
import IEditorTabsProps from "interfaces/IEditorTabsProps";
import { primaryOpacity } from "assets/jss/material-dashboard-react";
import { KeyboardArrowUp } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import IControl from "interfaces/IControl";
import Typography from "@material-ui/core/Typography";
import { observer } from "mobx-react-lite";
import CSSProperties from "views/Editor/components/tabs/CSSProperties";
import EditorDictionary from "views/Editor/store/EditorDictionary";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  disableDetailsButton: {
    backgroundColor: primaryOpacity(.05)
  }
}));

const ControlTab: React.FC<IEditorTabsProps> = () => {
  const classes = useStyles();
  const keys = Object.keys(EditorViewStore.CONTROLS) as (keyof typeof ControlEnum)[];
  return (
    <div className={classes.root}>
      {
        keys.map((k, i) =>
          <ControlTabItem key={i.toString()} type={EditorViewStore.CONTROLS[k]} />)
      }
      <CustomDragLayer />
    </div>
  )
};

interface ControlDetailsProps {
  selectControl?: (control?: IControl) => void;
  control?: IControl;
  dictionary: EditorDictionary;
}

const ControlDetails: React.FC<ControlDetailsProps> = observer((
  {selectControl, control, dictionary}
  ) => {
  return (
    <div style={{height: "100%"}}>
      <Button fullWidth variant="outlined" onClick={() => selectControl && selectControl()}>
        <KeyboardArrowUp />
      </Button>
      <Typography variant="subtitle1" align="center" style={{marginTop: 10}}>{control!.title}</Typography>
      <CSSProperties properties={control!.cssProperties} dictionary={dictionary} />
    </div>
  )
});

const Control: React.FC<IEditorTabsProps> = (
  { selectedControl, selectControl, dictionary }
  ) => {
  return (
    <div style={{height: "100%"}}>
      {
        selectedControl === undefined ?
          <ControlTab /> :
          <ControlDetails selectControl={selectControl} control={selectedControl} dictionary={dictionary as EditorDictionary} />
      }
    </div>
  )
}

export default Control;
