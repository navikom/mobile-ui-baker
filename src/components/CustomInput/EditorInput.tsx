import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      borderColor: "transparent",
    }
  })
);

interface EditorInputProps {
  value: string;
  onChange: (value: string) => void;
  style: React.CSSProperties;
}

const EditorInput: React.FC<EditorInputProps> =
  ({ onChange, ...rest }) => {
    const classes = useStyles();
    return <input
      className={classes.input}
      type="text"
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  };

export default EditorInput;
