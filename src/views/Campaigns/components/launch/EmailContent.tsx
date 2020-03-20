import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { IContentEmailView } from "interfaces/IContentStep";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    letterWrapper: {
      border: "1px solid rgba(0,0,0,.1)",
      minHeight: theme.typography.pxToRem(100),
      padding: theme.spacing(1),
      overflowY: "auto"
    }
  })
);

function EmailContent(props: { store: IContentEmailView }) {
  const classes = useStyles();
  return (
    <div className={classes.letterWrapper}>
      <div dangerouslySetInnerHTML={{ __html: props.store.htmlFile }} />
    </div>
  );
}

export default EmailContent;
