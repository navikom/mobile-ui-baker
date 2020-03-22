import React, { RefObject, useImperativeHandle } from "react";
import { DragSource, DropTarget } from "react-dnd";
import { observer } from "mobx-react-lite";
import { DropEnum } from "models/DropEnum";
import { ItemTypes } from "views/Editor/store/ItemTypes";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core";
import { ControlProps } from "interfaces/IControlProps";
import hover from "utils/hover";
import TextInput from "components/CustomInput/TextInput";
import { Add, DragIndicator, Remove } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    container: {
      flexWrap: "nowrap",
    },
    hover: {
      cursor: "move",
    },
    list: {
      margin: "0 .1em",
      padding: ".1em"
    },
    closed: {
      fontSize: 0,
      margin: 0,
      opacity: 0,
      padding: 0,
      height: 0,
      overflow: "hidden",
      transition: "opacity .25s,font-size .1s,margin .1s,padding .1s,height .1s"
    },
    opened: {
      transition: "font-size .1s,margin .1s,height .1s,padding .1s,opacity .1s"
    }
  })
);

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const borders = {
  [DropEnum.Left]: {
    borderLeft: "4px dotted rgba(0,0,0,0.2)",
  },
  [DropEnum.Right]: {
    borderRight: "4px dotted rgba(0,0,0,0.2)",
  },
  [DropEnum.Above]: {
    borderTop: "4px dotted rgba(0,0,0,0.2)",
  },
  [DropEnum.Below]: {
    borderBottom: "4px dotted rgba(0,0,0,0.2)",
  },
  [DropEnum.Inside]: {
    border: "4px dotted rgba(0,0,0,0.2)",
  }
};

interface ElementProps extends ControlProps {
  elementRef: RefObject<HTMLDivElement>;
  level: number;
}

const ElementComponent: React.FC<ElementProps> =
  observer(
    ({ control, isOverCurrent, isDragging, elementRef, moveControl, handleDropElement, level }) => {
      const { id, title, dropTarget, allowChildren, children, changeTitle, opened, switchOpened } = control;
      const classes = useStyles();
      let borderStyles = {};
      if (isOverCurrent) {
        borderStyles = dropTarget !== undefined ? borders[dropTarget] : {};
        if (dropTarget === DropEnum.Inside && !allowChildren) {
          borderStyles = {};
        }
      }
      const list = classNames({
        [classes.list]: true,
        [classes.opened]: opened,
        [classes.closed]: !opened
      });

      return (
        <div
          data-testid="control"
          ref={elementRef}
          style={{
            ...borderStyles,
            ...(isDragging ? {
              position: "absolute",
              top: -1000
            } : {})
          }}
          className={classes.root}
        >
          <Grid container direction="row" className={classes.container} alignItems="center"
                style={{ marginLeft: `${level * 10 - 10}px` }}>
            {children && children.length > 0 ? (
              <IconButton onClick={switchOpened} size="small">
                {opened ? <Remove /> : <Add />}
              </IconButton>
            ) : <span style={{marginLeft: 30}}/>}
            <DragIndicator className={classes.hover} />
            <TextInput value={title} onChange={(e) => changeTitle(e.currentTarget.value)} />
          </Grid>
          <div className={list}>
            {children && children.map((child, i) =>
              <TreeItem key={child.id} control={child} moveControl={moveControl} handleDropElement={handleDropElement}
                        level={level + 1} />)}
          </div>
        </div>
      )
    });

const ControlItem: React.FC<ControlProps & { level: number }> = React.forwardRef(
  ({ control, isDragging, isOver, isOverCurrent, connectDragSource, connectDropTarget, moveControl, handleDropElement, level }, ref) => {
    const elementRef = React.useRef<HTMLDivElement>(null);
    connectDragSource && connectDragSource(elementRef);
    connectDropTarget && connectDropTarget(elementRef);
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));

    return (
      <ElementComponent
        level={level}
        elementRef={elementRef}
        control={control}
        isDragging={isDragging}
        isOverCurrent={isOverCurrent}
        handleDropElement={handleDropElement}
        moveControl={moveControl} />
    )
  });

const TreeItem = DropTarget(
  ItemTypes.CONTROL,
  {
    hover(props: ControlProps, monitor, component) {

      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      const monitorItem = monitor.getItem();

      const dropAction = hover(props, monitor, component);

      if (dropAction === undefined) {
        return;
      }
      props.moveControl &&
      props.moveControl(
        props.control,
        monitorItem.control,
        dropAction,
      );
    },
    drop(props: ControlProps, monitor, component) {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      const dragItem = monitor.getItem();
      const dropAction = hover(props, monitor, component.decoratedRef.current);
      props.handleDropElement(props.control, dragItem.control, dropAction);
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true })
  }),
)(
  DragSource(
    ItemTypes.CONTROL,
    {
      beginDrag: (props: ControlProps) => {
        return {
          control: props.control,
        }
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(ControlItem),
);

export default TreeItem;
