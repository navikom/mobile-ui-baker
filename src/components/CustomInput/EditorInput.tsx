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
  ({ onChange, html, ...rest }) => {
  const ref = React.useRef<React.RefObject<HTMLElement>>();
    const classes = useStyles();
    return <ContentEditable
      onClick={(e) => e.stopPropagation()}
      innerRef={ref as unknown as React.RefObject<HTMLElement>}
      className={classes.input}
      html={html.length > 0 ? html : 'h'}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  };

export default EditorInput;
