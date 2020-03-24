import React from "react";
import { ControlEnum } from "models/ControlEnum";
import EditorViewStore from "views/Editor/store/EditorViewStore";
import ControlTabItem from "views/Editor/components/tabs/ControlTabItem";
import { makeStyles } from "@material-ui/core";
import CustomDragLayer from "views/Editor/components/CustomDragLayer";
import IEditorTabsProps from "interfaces/IEditorTabsProps";
import { primaryOpacity } from "assets/jss/material-dashboard-react";
import IconButton from "@material-ui/core/IconButton";
import { KeyboardArrowUp } from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IControl from "interfaces/IControl";
import Typography from "@material-ui/core/Typography";
import { observer } from "mobx-react-lite";

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
}

const ControlDetails: React.FC<ControlDetailsProps> = observer((
  {selectControl, control}
  ) => {
  const classes = useStyles();
  return (
    <div>
      <Button fullWidth variant="outlined" onClick={() => selectControl && selectControl()}>
        <KeyboardArrowUp />
      </Button>
      <Typography variant="subtitle2" align="center" style={{marginTop: 10}}>{control!.title}</Typography>
    </div>
  )
});

const Control: React.FC<IEditorTabsProps> = ({ selectedControl, selectControl }) => {
  return (
    <div>
      {
        selectedControl === undefined ? <ControlTab /> : <ControlDetails selectControl={selectControl} control={selectedControl} />
      }
    </div>
  )
}

export default Control;
