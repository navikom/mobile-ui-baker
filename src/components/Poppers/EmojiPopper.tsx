import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Picker } from "emoji-mart";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";

// interfaces
import { IPopper } from "interfaces/IPopper";

import "emoji-mart/css/emoji-mart.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      zIndex: 4
    }
  })
);

export default observer((props: { store: IPopper }) => {
  const classes = useStyles();
  const { store } = props;

  useEffect(() => {
    return () => {
      console.log("clear poppers");
      store.clear();
    };
  }, [store]);

  // @ts-ignore
  const picker = <Picker onSelect={store.select} darkMode={false} />;
  return (
    <Popper
      open={store.open}
      anchorEl={store.anchorEl}
      placement="bottom-end"
      className={classes.box}
      transition
    >
      <Fade in={true} mountOnEnter unmountOnExit>
        {picker}
      </Fade>
    </Popper>
  );
});
