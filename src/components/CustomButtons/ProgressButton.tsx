import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
// material-ui components
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import Button from "components/CustomButtons/Button.tsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { primaryColor } from "assets/jss/material-dashboard-react";

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      width: "100%",
      position: "relative",
      textAlign: "center"
    },
    progress: {
      color: primaryColor[0],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: "-16px",
      marginLeft: "-16px"
    },
    success: {
      backgroundColor: primaryColor[0],
      "&:hover": {
        backgroundColor: primaryColor[2]
      }
    }
  })
);

const ProgressButton = ({ ...props }) => {
  const { loading, text, ...rest } = props;
  const classes = useStyle();
  const btnClasses = classNames({
    [classes.success]: !loading
  });
  return (
    <div className={classes.wrapper}>
      <Button
        color="primary"
        disabled={loading}
        className={btnClasses}
        {...rest}
      >
        {text}
      </Button>
      {loading && <CircularProgress size={32} className={classes.progress} />}
    </div>
  );
};

export default ProgressButton;
