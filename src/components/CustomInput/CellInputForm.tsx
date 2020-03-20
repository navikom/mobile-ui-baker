import React from "react";
import { createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import Fab from "components/CustomButtons/Fab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      marginLeft: theme.typography.pxToRem(10)
    }
  })
);

function CellInputForm({ ...props }) {
  const classes = useStyles();
  const { onClick, color, disabled, icon, ...rest } = props;
  return (
    <div>
      <TextField id="standard-basic" {...rest} />
      <Fab
        color={color}
        onClick={onClick}
        size="superSm"
        disabled={disabled}
        className={classes.fab}
      >
        {React.createElement(icon)}
      </Fab>
    </div>
  );
}

export default CellInputForm;
