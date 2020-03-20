import React from "react";
import { ControlEnum } from "models/ControlEnum";
import EditorViewStore from "views/Editor/store/EditorViewStore";
import ControlTabItem from "views/Editor/components/tabs/ControlTabItem";
import { makeStyles } from "@material-ui/core";
import CustomDragLayer from "views/Editor/components/CustomDragLayer";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const ControlTab: React.FC = () => {
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

export default ControlTab;
