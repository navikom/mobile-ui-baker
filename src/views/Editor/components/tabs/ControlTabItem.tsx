import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { ControlEnum } from "enums/ControlEnum";
import { ItemTypes } from "views/Editor/store/ItemTypes";
import { ControlStores } from "models/Control/ControlStores";
import IControl from "interfaces/IControl";
import { inheritBoxShadow, whiteOpacity } from "assets/jss/material-dashboard-react";
import Tooltip from "@material-ui/core/Tooltip";

const controlStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      cursor: "move",
      alignItems: "center",
      padding: "0.5rem 1rem",
      backgroundColor: whiteOpacity(0.5),
      boxShadow: inheritBoxShadow.boxShadow
    }
  })
);

interface ControlProps {
  type?: ControlEnum;
  control?: IControl;
  handleMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const ControlTabItemPreview: React.FC<ControlProps> = (
  {
    type, control
  }: ControlProps) => {
  const classes = controlStyles();

  return (
    <Paper elevation={0} className={classes.container}>
      {(control && control.title) || type}
    </Paper>
  )
};

const ControlTabItem: React.FC<ControlProps> = (
  {
    type, control, handleMenu
  }) => {
  const classes = controlStyles();

  const [_, drag, preview] = useDrag({
    item: {
      type: ItemTypes.CONTROL,
      typeControl: type,
      control: control || ControlStores[type!].create()
    },
    begin: () => {
      const controlItem = control || ControlStores[type!].create();
      return {
        type: ItemTypes.CONTROL,
        typeControl: type,
        control: controlItem
      }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview]);

  let style;
  if(control && control.instance && control.instance.hasPreview) {
    style = {
      backgroundImage: `url(${control.instance.preview})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "90%",
      color: "transparent",
      ...control.instance.previewSize,
      padding: 0
    };
  }

  return (
    <Tooltip placement="top" title={(control && control.title) || type}>
      <Paper elevation={0} ref={drag} className={classes.container} onClick={handleMenu} style={style || {}}>
        {(control && control.title) || type}
      </Paper>
    </Tooltip>
  )
};

export default ControlTabItem;
