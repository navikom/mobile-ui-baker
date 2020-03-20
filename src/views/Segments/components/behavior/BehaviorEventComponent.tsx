import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/icons
import { AddCircleOutline, DeleteOutline } from "@material-ui/icons";

// @material-ui/core
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";
import { SegmentEventViewStore } from "views/Segments/store/SegmentEventViewStore";

// interfaces
import { ISegmentEventView } from "interfaces/ISegmentEventView";

// core components
import AndOrButton from "components/CustomButtons/AndOrButton";
import FiltarableComponent from "components/Filter/FiltarableComponent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      border: "1px dashed rgba(0,0,0,.1)",
    },
    textRight: {
      textAlign: "right"
    },
    marginTop: {
      marginTop: theme.spacing(2)
    },
    marginLeft: {
      marginLeft: theme.spacing(1)
    }
  })
);

interface IPropsArgument {
  index: number;
  count: number;
  didEvents: boolean;

  addNewItem(): void;
  deleteItem(): void;
  item: ISegmentEventView;
  handleAndOr(): void;
}

const UserEventComponent = observer((props: IPropsArgument) => {
  const classes = useStyles();
  const first = {
    value: props.item.currentEventName,
    options: Array.from(SegmentEventViewStore.systemEventsList),
    onChange: (e: string) => props.item.setEventName(e)
  };

  let third, fourth, fifth;
  const second = {
      value: props.item.currentOccurExpression,
      options: SegmentEventViewStore.occurExpressionNames,
      onChange: (e: string) => props.item.setOccurExpression(e),
      label: Dictionary.defValue(DictionaryService.keys.occurs)
    };

  if(props.item.currentExpression) {
    third = {
      value: props.item.currentExpression,
      options: props.item.expressions,
      onChange: (e: string) => props.item.setRestExpression(e)
    };
  }

  if (props.item.keys) {
    fourth = {
      [props.item.keys![0]]: props.item[props.item.keys![0]],
      onChange: (e: string | number | (string | number)[]) => props.item.setValue(e, props.item.keys![0])
    };
    if (props.item.keys.length > 1) {
      fifth = {
        [props.item.keys![1]]: props.item[props.item.keys![1]],
        onChange: (e: Date | string | number | (string | number)[]) => props.item.setValue(e, props.item.keys![1])
      };
    }
  }

  const showAdd = props.index + 1 === props.count;
  const showTrash = true;
  const andOr = props.index + 1 < props.count;
  const isAnd = SegmentEventViewStore.isAnd(props.index, props.didEvents);
  return (
    <Grid container className={classes.marginTop}>
      <Grid container className={classes.marginLeft}>
        <FiltarableComponent
          first={first}
        />
      </Grid>

      <Grid container className={classNames(classes.marginTop, classes.marginLeft)}>
        <Grid item xs={12} sm={9} md={10}>
          <FiltarableComponent
            first={second}
            second={third}
            third={fourth}
            fourth={fifth}
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2} className={classes.textRight}>
          {
            showAdd && (
              <IconButton onClick={props.addNewItem}>
                <AddCircleOutline color="primary"/>
              </IconButton>
            )
          }
          {
            showTrash && (
              <IconButton onClick={props.deleteItem}>
                <DeleteOutline color="primary"/>
              </IconButton>
            )
          }
        </Grid>
      </Grid>
      {
        andOr && (
          <AndOrButton isAnd={isAnd} onClick={props.handleAndOr}/>
        )
      }
    </Grid>
  );
});

export default observer((props: { didEvents: boolean }) => {
  if (!SegmentViewStore.segment) return null;
  const classes = useStyles();
  const store = props.didEvents ? SegmentEventViewStore.didEvents : SegmentEventViewStore.didNotDoEvents;
  const container = classNames({
    [classes.container]: store.length > 0
  });
  return (
    <div className={container}>
      {
        store.map((item: ISegmentEventView, i: number) =>
            <UserEventComponent
              key={i}
              item={item}
              addNewItem={() => SegmentEventViewStore.addNewItem(props.didEvents)}
              deleteItem={() => SegmentEventViewStore.removeItem(i, props.didEvents)}
              handleAndOr={() => SegmentEventViewStore.handleAndOr(i, props.didEvents)}
              index={i}
              didEvents={props.didEvents}
              count={store.length}/>)
      }
    </div>
  );
});
