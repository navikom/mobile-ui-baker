import React from "react";
import { observer } from "mobx-react-lite";

// @material-ui/core
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// @material-ui/icons
import { AddCircleOutline } from "@material-ui/icons";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// assets
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

//local components
import BehaviorEventComponent from "views/Segments/components/behavior/BehaviorEventComponent";
import AndOrButton from "components/CustomButtons/AndOrButton";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";
import { SegmentEventViewStore } from "views/Segments/store/SegmentEventViewStore";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      border: "1px solid rgba(0,0,0,.1)"
    },
    padding: {
      padding: theme.typography.pxToRem(5)
    },
    marginLeft: {
      marginLeft: theme.spacing(1)
    },
    textRight: {
      textAlign: "right"
    },
    center: {
      alignItems: "center"
    },
    title: {
      padding: "6px 8px"
    }
  })
);

export default observer(() => {
  const classes = useStyles();
  const eClasses = extraStyles();

  const isAddDidEventButton = SegmentEventViewStore.didEvents.length === 0;
  const isAddDidNotDoEventButton =
    SegmentEventViewStore.didNotDoEvents.length === 0;

  const addOrResetHandler = (didEvents: boolean) => () => {
    if (
      (didEvents && isAddDidEventButton) ||
      (!didEvents && isAddDidNotDoEventButton)
    ) {
      SegmentEventViewStore.addNewItem(didEvents);
    } else {
      SegmentViewStore.clearBehaviorEvents(didEvents);
    }
  };

  return (
    <div className={eClasses.root}>
      <div className={eClasses.padding}>
        <Grid container>
          <Grid item xs={6} sm={6} md={6}>
            <div className={eClasses.title}>
              {Dictionary.defValue(DictionaryService.keys.usersWhoDidEvents)}
            </div>
          </Grid>
          <Grid item xs={6} sm={6} md={6} className={classes.textToRight}>
            {isAddDidEventButton ? (
              <IconButton onClick={addOrResetHandler(true)}>
                <AddCircleOutline color="primary" />
              </IconButton>
            ) : (
              <Button color="primary" onClick={addOrResetHandler(true)}>
                {Dictionary.defValue(DictionaryService.keys.reset)}
              </Button>
            )}
          </Grid>
        </Grid>
        <BehaviorEventComponent didEvents={true} />
      </div>
      <AndOrButton
        isAnd={SegmentEventViewStore.and}
        opacity2={true}
        onClick={() => SegmentEventViewStore.handleAnd()}
        color="secondary"
      />
      <div className={eClasses.padding}>
        <Grid container>
          <Grid item xs={6} sm={6} md={6}>
            <div className={eClasses.title}>
              {Dictionary.defValue(
                DictionaryService.keys.usersWhoDidNotDoEvents
              )}
            </div>
          </Grid>
          <Grid item xs={6} sm={6} md={6} className={classes.textToRight}>
            {isAddDidNotDoEventButton ? (
              <IconButton onClick={addOrResetHandler(false)}>
                <AddCircleOutline color="primary" />
              </IconButton>
            ) : (
              <Button color="primary" onClick={addOrResetHandler(false)}>
                {Dictionary.defValue(DictionaryService.keys.reset)}
              </Button>
            )}
          </Grid>
        </Grid>
        <BehaviorEventComponent didEvents={false} />
      </div>
    </div>
  );
});
