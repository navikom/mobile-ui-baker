import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import ContentEditable from "react-contenteditable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      display: "inline-block",
      "&:hover": {
        cursor: "text",
      }
    }
  })
);

interface EditorInputProps {
  html: string;
  onChange: (value: string) => void;
  style: React.CSSProperties;
  tagName?: string;
}

const EditorInput: React.FC<EditorInputProps> =
  ({ onChange, ...rest }) => {
  const ref = React.useRef<React.RefObject<HTMLElement>>();
    const classes = useStyles();
    return <ContentEditable
      innerRef={ref as unknown as React.RefObject<HTMLElement>}
      className={classes.input}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  };

export default EditorInput;
