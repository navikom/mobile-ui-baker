import React from "react";
import { observer } from "mobx-react-lite";

// @material-ui/icons
import { AddCircleOutline, DeleteOutline } from "@material-ui/icons";

// @material-ui/core
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

// interfaces
import { ISegmentAttributeView } from "interfaces/ISegmentAttributeView";

// view store
import SegmentViewStore from "views/Segments/store/SegmentViewStore";

// local components
import FiltarableComponent from "components/Filter/FiltarableComponent";
import AndOrButton from "components/CustomButtons/AndOrButton";

// view store
import { SegmentAttributeViewStore } from "views/Segments/store/SegmentAttributeViewStore";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

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
  item: ISegmentAttributeView;
  handleAndOr(): void;
}

const UserAttributeComponent = observer((props: IPropsArgument) => {
  const classes = useStyles();
  const first = {
    value: props.item.currentAttributeName,
    options: SegmentAttributeViewStore.attributeNamesKeys,
    onChange: (e: string) => props.item.setAttributeName(e)
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

  const showAdd = (props.item.keys !== undefined || props.item.currentAttributeName !== undefined)
  && props.index + 1 === props.count ? true : false;

  const showTrash = props.count > 1 ? true : false;
  const andOr = props.index + 1 < props.count;
  const isAnd = SegmentAttributeViewStore.isAnd(props.index);

  return (
    <Grid container className={classes.marginTop}>
      <Grid item xs={12} sm={9} md={10}>
        <FiltarableComponent
          first={first}
          second={second}
          third={third}
          fourth={fourth}
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
      {
        andOr && (
          <AndOrButton isAnd={isAnd} onClick={props.handleAndOr}/>
        )
      }
    </Grid>
  )
});

export default observer(() => {
  if (!SegmentViewStore.segment) return null;
  const classes = useStyles();
  const showAdd = SegmentAttributeViewStore.list.length === 0;
  return (
    <div className={classes.root}>
      {
        showAdd ? (
          <IconButton onClick={() => SegmentAttributeViewStore.addNewItem()}>
            <AddCircleOutline color="primary"/>
          </IconButton>
        ) : SegmentAttributeViewStore.list.map((item: ISegmentAttributeView, i: number) =>
          <UserAttributeComponent
            key={i}
            item={item}
            addNewItem={() => SegmentAttributeViewStore.addNewItem()}
            deleteItem={() => SegmentAttributeViewStore.removeItem(i)}
            handleAndOr={() => SegmentAttributeViewStore.handleAndOr(i)}
            index={i}
            count={SegmentAttributeViewStore.list.length}/>)
      }
    </div>
  );
});
