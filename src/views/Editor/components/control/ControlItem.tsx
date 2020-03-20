import React, { RefObject, useImperativeHandle } from "react";
import { DragSource, DropTarget, XYCoord } from "react-dnd";
import { observer } from "mobx-react-lite";
import IControl from "interfaces/IControl";
import { DropEnum } from "models/DropEnum";
import { ItemTypes } from "views/Editor/store/ItemTypes";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core";
import { blackOpacity } from "assets/jss/material-dashboard-react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    placeholder: {
      position: "absolute",
      color: blackOpacity(0.3),
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
    hover: {
      "&:hover": {
        border: "1px dotted " + blackOpacity(0.1),
        backgroundColor: blackOpacity(0.1)
      }
    }
  })
);

interface ControlProps {
  control: IControl;
  index?: number;
  moveControl?:
    (parent: IControl, source: IControl, dropAction: DropEnum, newItem: boolean, dropIndex: number, hoverIndex: number)
      => void;
  isDragging: boolean;
  connectDragSource?: (ref: RefObject<HTMLDivElement>) => void;
  connectDropTarget?: (ref: RefObject<HTMLDivElement>) => void;
  isOver?: boolean;
  isOverCurrent: boolean;
}

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
  elementRef: RefObject<HTMLDivElement>
}

const ElementComponent: React.FC<ElementProps> =
  observer(({ control, isOverCurrent, isDragging, elementRef, moveControl }) => {
    const { id, name, styles, dropTarget, allowChildren, children } = control;
    const classes = useStyles();
    const opacity = isDragging ? 0 : 1;
    let backgroundColor = isOverCurrent ? "rgba(0,0,0,0.05)" : styles.backgroundColor;
    let borderStyles = {};
    if (isOverCurrent) {
      borderStyles = dropTarget !== undefined ? borders[dropTarget] : {};
      if (DropEnum.Inside && !allowChildren) {
        borderStyles = {};
        backgroundColor = styles.backgroundColor
      }
    }
    let position = {};
    if (!children.length) {
      position = { position: "relative" };
    }
    return (
      <div ref={elementRef} style={{ ...styles, opacity, backgroundColor, ...borderStyles, ...position }}
           className={classes.hover}>
        {!children.length && (<span className={classes.placeholder}>{name}</span>)}
        {children && children.map((child, i) =>
          <Item key={child.id} index={i} control={child} moveControl={moveControl} />)}
      </div>
    )
  });

const ControlItem: React.FC<ControlProps> = React.forwardRef(
  ({ control, isDragging, isOver, isOverCurrent, connectDragSource, connectDropTarget, moveControl }, ref) => {
    const elementRef = React.useRef<HTMLDivElement>(null);
    connectDragSource && connectDragSource(elementRef);
    connectDropTarget && connectDropTarget(elementRef);
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));

    return (
      <ElementComponent
        elementRef={elementRef}
        control={control}
        isDragging={isDragging}
        isOverCurrent={isOverCurrent}
        moveControl={moveControl} />
    )
  });

const Item = DropTarget(
  ItemTypes.CONTROL,
  {
    hover(props: ControlProps, monitor, component) {

      // if(!monitor.isOver({shallow: true})) {
      //   return;
      // }

      if (props.index === undefined) {
        return;
      }
      if (!component) {
        return null
      }
      // node = HTML Div element from imperative API
      const node = component.getNode();
      if (!node) {
        return null
      }
      const monitorItem = monitor.getItem();
      const dragIndex = monitorItem.index;

      const hoverIndex = props.index;
      const newItem = monitorItem.typeControl !== undefined;

      const dropItem = props.control;
      const dragItem = monitorItem.control;
      if(dropItem === dragItem) {
        return;
      }
      const dragItemIsDropItemChild = dropItem.hasChild(dragItem);
      const dropItemIsDragItemChild = dragItem.hasChild(dropItem);
      console.log(999999, dragIndex, hoverIndex, dropItem.name, dragItem.name, dragItemIsDropItemChild, dropItemIsDragItemChild);
      if(dropItemIsDragItemChild) {
        return;
      }

      // Don't replace items with themselves
      if (dropItem === dragItem) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect();
      const { x, width, height } = hoverBoundingRect;
      const x2 = x + width;
      // Get vertical middle
      const hoverMiddleY = height / 2;
      const shiftTarget = Math.min(height / 4, 7);
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      const hoverClientX = (clientOffset as XYCoord).x;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY + shiftTarget < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY - shiftTarget > hoverMiddleY) {
        return;
      }

      let dropAction = DropEnum.Inside;

      if (hoverClientX - shiftTarget < x) {
        dropAction = DropEnum.Left;
      } else if (hoverClientX + shiftTarget > x2) {
        dropAction = DropEnum.Right;
      } else if (hoverClientY + shiftTarget < hoverMiddleY) {
        dropAction = DropEnum.Above;
      } else if (hoverClientY - shiftTarget > hoverMiddleY) {
        dropAction = DropEnum.Below;
      }
      // Time to actually perform the action
      const moved = props.moveControl &&
      props.moveControl(
        props.control,
        monitorItem.control,
        dropAction,
        newItem,
        dragIndex,
        hoverIndex
      );
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      !newItem && moved && (monitorItem.index = hoverIndex);
    },
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
          index: props.index,
        }
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(ControlItem),
);

export default Item;
