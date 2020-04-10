import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core";
import { ControlEnum } from "enums/ControlEnum";
import Paper from "@material-ui/core/Paper";
import { ItemTypes } from "views/Editor/store/ItemTypes";
import { whiteOpacity } from "assets/jss/material-dashboard-react";
import { ControlStores } from "models/Control/ControlStores";

const controlStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      cursor: "move",
      alignItems: "center",
      padding: "0.5rem 1rem",
      backgroundColor: whiteOpacity(0.5),
    }
  })
);

interface ControlProps {
  type: ControlEnum;
}

export const ControlTabItemPreview: React.FC<ControlProps> = ({ type }) => {
  const classes = controlStyles();

  return (
    <Paper elevation={0} className={classes.container}>
      {type}
    </Paper>
  )
};

const ControlTabItem: React.FC<ControlProps> = ({ type }) => {
  const classes = controlStyles();

  const [_, drag, preview] = useDrag({
    item: { type: ItemTypes.CONTROL, typeControl: type, control: ControlStores[type].create() },
    begin: () => {
      const control = ControlStores[type].create();
      return {
        type: ItemTypes.CONTROL,
        typeControl: type,
        control
      }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  return (
    <Paper elevation={0} ref={drag} className={classes.container}>
      {type}
    </Paper>
  )
};

export default ControlTabItem;
