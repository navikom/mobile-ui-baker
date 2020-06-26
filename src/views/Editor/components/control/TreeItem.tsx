import React, { RefObject, useEffect, useImperativeHandle } from 'react';
import { DragSource, DropTarget } from "react-dnd";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { getEmptyImage } from 'react-dnd-html5-backend';

import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core";
import { Add, Delete, DragIndicator, FilterNone, Remove, Visibility, VisibilityOff } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import { DropEnum } from "enums/DropEnum";
import { ItemTypes } from "views/Editor/store/ItemTypes";
import { ControlProps } from "interfaces/IControlProps";
import hover from "utils/hover";
import TextInput from "components/CustomInput/TextInput";
import IControl from "interfaces/IControl";
import { warningOpacity } from "assets/jss/material-dashboard-react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: "all 0.1s",
    },
    input: {
      width: theme.typography.pxToRem(80),
      textOverflow: "ellipsis"
    },
    container: {
      flexWrap: "nowrap",
    },
    hover: {
      cursor: "move",
    },
    list: {
      margin: "0 .1em",
      padding: ".1em",
      maxHeight: "1000px"
    },
    closed: {
      padding: "0 .1em",
      overflow: "hidden",
      maxHeight: 0,
      opacity: 0,
      transition: "all .1s"
    },
    opened: {
      transition: "all .1s"
    },
    selected: {
      backgroundColor: warningOpacity(0.1)
    },
    selectedInput: {
      backgroundColor: warningOpacity(0.01),
    }
  })
);

const borders = {
  [DropEnum.Left]: {
    borderLeft: "2px dotted rgba(0,0,0,0.2)",
  },
  [DropEnum.Right]: {
    borderRight: "2px dotted rgba(0,0,0,0.2)",
  },
  [DropEnum.Above]: {
    borderTop: "2px dotted rgba(0,0,0,0.2)",
  },
  [DropEnum.Below]: {
    borderBottom: "2px dotted rgba(0,0,0,0.2)",
  },
  [DropEnum.Inside]: {
    border: "2px dotted rgba(0,0,0,0.2)",
  }
};

interface ElementProps extends ControlProps {
  elementRef: RefObject<HTMLDivElement>;
  level: number;
  cloneControl: (control: IControl) => void;
  selectControl: (control?: IControl, screen?: IControl) => void;
  isSelected: (control: IControl) => boolean;
  screen: IControl;
}

const ElementComponent: React.FC<ElementProps> =
  observer(
    ({
       control,
       isOverCurrent,
       isDragging,
       elementRef,
       moveControl,
       handleDropElement,
       level,
       cloneControl,
       selectControl,
       isSelected,
       screen
     }) => {
      const { title, dropTarget, allowChildren, children, changeTitle, opened, switchOpened, lockedChildren } = control;
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

      const selected = isSelected(control);

      const itemClass = classNames({
        [classes.container]: true,
        [classes.selected]: selected
      });
      const inputClass = classNames({
        [classes.input]: true,
        [classes.selectedInput]: selected
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
          <Grid container direction="row" className={itemClass} alignItems="center"
                style={{ marginLeft: `${level * 10 - 10}px` }}>
            {children && children.length > 0 ? (
              <IconButton onClick={switchOpened} size="small">
                {opened ? <Remove /> : <Add />}
              </IconButton>
            ) : <span style={{ marginLeft: 30 }} />}
            <DragIndicator className={classes.hover} />
            <TextInput
              className={inputClass}
              value={title}
              onChange={(e) => changeTitle(e.currentTarget.value)}
              onClick={() => selectControl(control, screen)}
            />
            <IconButton size="small" onClick={control.switchVisibility} style={{marginLeft: "auto"}}>
              {control.visible ? <Visibility /> : <VisibilityOff color="disabled" />}
            </IconButton>
            <IconButton size="small" onClick={() => cloneControl(control)}>
              <FilterNone />
            </IconButton>
            <IconButton size="small" onClick={() => {
              selected && selectControl();
              control.deleteSelf()
            }}>
              <Delete />
            </IconButton>
          </Grid>
          <div className={list}>
            {children && !lockedChildren && children.map((child, i) =>
              <TreeItem
                key={child.id}
                control={child}
                moveControl={moveControl}
                handleDropElement={handleDropElement}
                level={level + 1}
                cloneControl={cloneControl}
                selectControl={selectControl}
                isSelected={isSelected}
                screen={screen}
              />)
            }
          </div>
        </div>
      )
    });

interface ControlItemProps extends ControlProps {
  level: number;
  cloneControl: (control: IControl) => void;
  selectControl: (control?: IControl) => void;
  isSelected: (control: IControl) => boolean;
  screen: IControl;
}

const ControlItem: React.FC<ControlItemProps> = React.forwardRef(
  ({
     control,
     isDragging,
     isOver,
     isOverCurrent,
     connectDragSource,
     connectDragPreview,
     connectDropTarget,
     moveControl,
     handleDropElement,
     level,
     cloneControl,
     selectControl,
     isSelected,
     screen
   }, ref) => {
    const elementRef = React.useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));

    useEffect(() => {
      connectDragSource && connectDragSource(elementRef);
      connectDropTarget && connectDropTarget(elementRef);
      connectDragPreview && connectDragPreview(getEmptyImage())
    }, [connectDragPreview, connectDragSource, connectDropTarget]);

    return (
      <ElementComponent
        level={level}
        elementRef={elementRef}
        control={control}
        isDragging={isDragging}
        isOverCurrent={isOverCurrent}
        handleDropElement={handleDropElement}
        moveControl={moveControl}
        cloneControl={cloneControl}
        selectControl={selectControl}
        isSelected={isSelected}
        screen={screen}
      />
    )
  });

ControlItem.displayName = 'ControlItem';

const TreeItem = DropTarget(
  ItemTypes.TREE_CONTROL,
  {
    hover(props: ControlProps, monitor, component) {

      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      const monitorItem = monitor.getItem();
      if (!monitorItem.treeItem) {
        return;
      }

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
      if (!dragItem.treeItem) {
        return;
      }
      const dropAction = hover(props, monitor, component.decoratedRef.current);
      props.handleDropElement && props.handleDropElement(props.control, dragItem.control, dropAction);
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true })
  }),
)(
  DragSource(
    ItemTypes.TREE_CONTROL,
    {
      beginDrag: (props: ControlProps) => {
        return {
          control: props.control,
          treeItem: true,
        }
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    }),
  )(ControlItem),
);

export default TreeItem;
