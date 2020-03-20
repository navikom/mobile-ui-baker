import React from "react";
import classNames from "classnames";

// @material-ui/core
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

import { whiteColor } from "assets/jss/material-dashboard-react";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dividerWrapper: {
      width: "100%",
      position: "relative",
      height: theme.typography.pxToRem(20),
      marginBottom: theme.typography.pxToRem(10)
    },
    opacity1: {
      opacity: 0.7,
      borderBottom: "1px dashed rgba(0,0,0,.15)"
    },
    opacity2: {
      opacity: 0.8,
      borderBottom: "1px solid rgba(0,0,0,.15)"
    },
    buttons: {
      position: "absolute",
      left: "50%",
      bottom: 0,
      transform: "translate(-50%, 50%)",
      backgroundColor: whiteColor
    },
    button: {
      fontSize: theme.typography.pxToRem(2),
      padding: "2px"
    }
  })
);

type ColorType = "inherit" | "primary" | "secondary" | "default";

export default (props: {
  isAnd?: boolean;
  onClick: () => void;
  opacity2?: boolean;
  color?: ColorType;
}) => {
  const classes = useStyles();
  const wrapper = classNames({
    [classes.dividerWrapper]: true,
    [classes.opacity1]: true,
    [classes.opacity2]: props.opacity2
  });

  const color = props.color || "primary";
  const isAnd = props.isAnd === undefined ? true : props.isAnd;

  return (
    <div className={wrapper}>
      <ButtonGroup
        size="small"
        aria-label="small outlined button group"
        className={classes.buttons}
      >
        <Button
          onClick={props.onClick}
          className={classes.button}
          variant={isAnd ? "contained" : "outlined"}
          color={isAnd ? color : "default"}
        >
          {Dictionary.defValue(DictionaryService.keys.and)}
        </Button>
        <Button
          onClick={props.onClick}
          className={classes.button}
          variant={!isAnd ? "contained" : "outlined"}
          color={!isAnd ? color : "default"}
        >
          {Dictionary.defValue(DictionaryService.keys.or)}
        </Button>
      </ButtonGroup>
    </div>
  );
};
