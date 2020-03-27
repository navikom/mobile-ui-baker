import React, { RefObject, useImperativeHandle } from "react";
import { DragSource, DropTarget } from "react-dnd";
import { observer } from "mobx-react-lite";
import { DropEnum } from "models/DropEnum";
import { ItemTypes } from "views/Editor/store/ItemTypes";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core";
import { blackOpacity } from "assets/jss/material-dashboard-react";
import { ControlProps } from "interfaces/IControlProps";
import hover from "utils/hover";
import classNames from "classnames";
import { ControlEnum } from "models/ControlEnum";
import TextInput from "components/CustomInput/TextInput";
import EditorInput from "components/CustomInput/EditorInput";
import { IText } from "interfaces/IControl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: "all 0.1s",
    },
    placeholder: {
      position: "absolute",
      color: blackOpacity(0.3),
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
    hover: {
      "&:hover": {
        cursor: "move",
        border: "1px dotted " + blackOpacity(0.1),
        backgroundColor: blackOpacity(0.05)
      }
    },
    invisible: {
      opacity: 0
    }
  })
);

const Elements = {
  [ControlEnum.Text]: TextInput
};

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
}

const ElementComponent: React.FC<ElementProps> =
  observer(
    ({
       control,
       isOverCurrent,
       isDragging,
       elementRef,
       moveControl,
       selectControl,
       isSelected,
       handleDropElement
     }) => {
      const { id, title, styles, dropTarget, allowChildren, children } = control;
      const classes = useStyles();
      let backgroundColor = isOverCurrent ? "rgba(0,0,0,0.05)" : styles.backgroundColor;
      let borderStyles = {};
      if (isOverCurrent) {
        borderStyles = dropTarget !== undefined ? borders[dropTarget] : {};
        if (dropTarget === DropEnum.Inside && !allowChildren) {
          borderStyles = {};
          backgroundColor = styles.backgroundColor
        }
      }
      let position = {};
      if (!children.length) {
        position = { position: "relative" };
      }

      const controlClass = classNames({
        [classes.hover]: true,
        [classes.invisible]: !control.visible
      });

      let showPlaceholder = children.length === 0;
      let placeholder = <span className={classes.placeholder}>{title}</span>;
      if(control.type === ControlEnum.Text) {
        showPlaceholder = true;
        if(isSelected(control)) {
          placeholder = <EditorInput value={title} onChange={(e) => control.changeTitle(e)} style={{}} />;
        } else {
          placeholder = <span style={{}}>{title}</span>;
        }
      }

      return (
        <div
          data-testid="control"
          onClick={(e) => {
            selectControl(control);
            e.stopPropagation();
          }}
          ref={elementRef}
          style={{
            ...styles, backgroundColor, ...borderStyles, ...position, ...(isDragging ? {
              position: "absolute",
              top: -1000
            } : {}),
          }}
          className={controlClass}>
          {showPlaceholder && placeholder}
          {children && children.map((child, i) =>
            <Item
              key={child.id}
              control={child}
              moveControl={moveControl}
              handleDropElement={handleDropElement}
              isSelected={isSelected}
              selectControl={selectControl} />)}
        </div>
      )
    });

const ControlItem: React.FC<ControlProps> = React.forwardRef(
  (
    {
     control,
     isDragging,
      isOver,
      isOverCurrent,
      connectDragSource,
      connectDropTarget,
      moveControl,
      handleDropElement,
      selectControl,
      isSelected
    },
    ref) => {
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
        handleDropElement={handleDropElement}
        selectControl={selectControl}
        isSelected={isSelected}
        moveControl={moveControl} />
    )
  });

const Item = DropTarget(
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

export default Item;
