import React, { useEffect } from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";

// @material-ui/icons
import { ArrowForwardIos, ArrowBackIos } from "@material-ui/icons";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// interfaces
import { IAttributesEventsPopper } from "interfaces/IPopper";

import { inheritColor } from "assets/jss/material-dashboard-react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1)
    },
    list: {
      width: theme.typography.pxToRem(250),
      maxHeight: 300,
      overflowY: "auto"
    },
    subheader: {
      backgroundColor: inheritColor[1],
      padding: 0,
      textAlign: "center"
    },
    button: {
      borderRadius: 0
    },
    item: {
      paddingRight: theme.spacing(5)
    },
    box: {
      zIndex: 4,
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper
    }
  })
);

const ListComponent = observer((props: { store: IAttributesEventsPopper }) => {
  const classes = useStyles();
  const { store } = props;
  const listClasses = classNames({
    [classes.list]: true
  });
  const { size, back, currentProperty, select } = store;
  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          className={classes.subheader}
        >
          {size > 0 ? (
            <Button onClick={back} fullWidth className={classes.button}>
              <ArrowBackIos fontSize="small" />
              <ListItemText
                primary={Dictionary.defValue(
                  DictionaryService.keys.back
                ).toUpperCase()}
              />
            </Button>
          ) : (
            Dictionary.defValue(DictionaryService.keys.variables).toUpperCase()
          )}
        </ListSubheader>
      }
      className={listClasses}
    >
      {currentProperty.keys.map((prop: string, i: number) => {
        return (
          <ListItem key={i} button onClick={() => select(prop)}>
            <ListItemText primary={prop} className={classes.item} />
            {currentProperty.hasNext(prop) && (
              <ArrowForwardIos fontSize="small" />
            )}
          </ListItem>
        );
      })}
    </List>
  );
});

export default observer((props: { store: IAttributesEventsPopper }) => {
  const classes = useStyles();
  const { store } = props;

  useEffect(() => {
    return () => {
      console.log("clear poppers");
      store.clear();
    };
  }, [store]);

  return (
    <Popper
      open={store.open}
      anchorEl={store.anchorEl}
      placement="bottom-end"
      className={classes.box}
      transition
    >
      <Fade in={true} mountOnEnter unmountOnExit>
        <ListComponent store={store} />
      </Fade>
    </Popper>
  );
});
