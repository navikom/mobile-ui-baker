import React from "react";
import { observer } from "mobx-react-lite";

// @material-ui/icons
import { AddCircleOutline, DeleteOutline } from "@material-ui/icons";

// @material-ui/core
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

// interfaces
import { ISegmentDevice } from "interfaces/ISegmentDevice";

// local components
import FiltarableComponent from "components/Filter/FiltarableComponent";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";
import { SegmentTechnologyViewStore } from "views/Segments/store/SegmentTechnologyViewStore";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import Divider from "@material-ui/core/Divider";
import classNames from "classnames";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    textRight: {
      textAlign: "right"
    },
    marginTop: {
      marginTop: theme.spacing(2)
    }
  })
);

interface IPropsArgument {
  index: number;
  count: number;
  addNewItem(): void;
  deleteItem(): void;
  item: ISegmentDevice;
  device: "android" | "ios";
}

const DeviceItem = observer((props: IPropsArgument) => {
  const classes = useStyles();
  const store = SegmentTechnologyViewStore[props.device];
  const first = {
    value: props.item.currentPropertyName,
    options: store.propertyNames,
    onChange: (e: string) => props.item.setPropertyName(e)
  };

  let second, third, fourth;
  if(props.item.currentExpression) {
    second = {
      value: props.item.currentExpression,
      options: props.item.expressions,
      onChange: (e: string) => props.item.setExpression(e),
      label: Dictionary.defValue(DictionaryService.keys.is)
    };
  }
  if(props.item.keys) {
    third = {
      [props.item.keys![0]]: props.item[props.item.keys![0]],
      onChange: (e: Date | string | number | (string | number)[]) => props.item.setValue(e, props.item.keys![0])
    };
    if(props.item.keys.length > 1) {
      fourth = {
        [props.item.keys![1]]: props.item[props.item.keys![1]],
        onChange: (e: Date | string | number | (string | number)[]) => props.item.setValue(e, props.item.keys![1])
      };
    }
  }

  const showAdd = (props.item.keys !== undefined || props.item.currentPropertyName !== undefined)
  && props.index + 1 === props.count;

  const showTrash = true;
  const showDivider = props.index + 1 < props.count;

  const dividerStyle = classNames(classes.root, classes.marginTop);

  return (
    <Grid container className={classes.marginTop}>
      <Grid item xs={12} sm={10} md={10}>
        <FiltarableComponent
          first={first}
          second={second}
          third={third}
          fourth={fourth}
        />
      </Grid>
      <Grid container item xs={12} sm={2} md={2} alignItems="center" justify="flex-end">
        {
          showAdd && (
            <IconButton onClick={props.addNewItem} size="small">
              <AddCircleOutline color="primary"/>
            </IconButton>
          )
        }
        {
          showTrash && (
            <IconButton onClick={props.deleteItem} size="small">
              <DeleteOutline color="primary"/>
            </IconButton>
          )
        }
      </Grid>
      {
        showDivider && <Divider light className={dividerStyle}/>
      }
    </Grid>
  )
});

const DeviceComponent = (props: {device: "android" | "ios"}) => {
  const classes = useStyles();
  if (!SegmentViewStore.segment) return null;
  const store = SegmentTechnologyViewStore[props.device];
  const showAdd = store.list.length === 0;
  return (
    <div className={classes.root}>
      {
        showAdd ? (
          <IconButton onClick={() => store.addNewItem()}>
            <AddCircleOutline color="primary"/>
          </IconButton>
        ) : store.list.map((item: ISegmentDevice, i: number) =>
          <DeviceItem
            key={i}
            item={item}
            addNewItem={() => store.addNewItem()}
            deleteItem={() => store.removeItem(i)}
            index={i}
            device={props.device}
            count={store.list.length}/>)
      }
    </div>
  );
};

export default observer(DeviceComponent);
