import React, { RefObject, useEffect, useImperativeHandle } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { observer } from 'mobx-react-lite';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { DropEnum } from 'enums/DropEnum';
import { ItemTypes } from 'views/Editor/store/ItemTypes';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import { ControlProps } from 'interfaces/IControlProps';
import hover from 'utils/hover';
import classNames from 'classnames';
import { ControlEnum } from 'enums/ControlEnum';
import { DeviceEnum } from '../../../../enums/DeviceEnum';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: 'all 0.1s',
    },
    placeholder: {
      position: 'absolute',
      color: blackOpacity(0.3),
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
    hover: {
      '&:hover': {
        cursor: 'move',
        backgroundColor: blackOpacity(0.05)
      }
    },
    invisible: {
      opacity: 0
    }
  })
);

const borders = {
  [DropEnum.Left]: {
    borderLeft: '2px dotted rgba(0,0,0,0.2)',
  },
  [DropEnum.Right]: {
    borderRight: '2px dotted rgba(0,0,0,0.2)',
  },
  [DropEnum.Above]: {
    borderTop: '2px dotted rgba(0,0,0,0.2)',
  },
  [DropEnum.Below]: {
    borderBottom: '2px dotted rgba(0,0,0,0.2)',
  },
  [DropEnum.Inside]: {
    border: '2px dotted rgba(0,0,0,0.2)',
  }
};

interface ElementProps extends ControlProps {
  elementRef?: RefObject<HTMLDivElement>;
  locked?: boolean;
}


export const ElementComponent: React.FC<ElementProps> =
  observer(
    (
      {
        control,
        isOverCurrent,
        isDragging,
        elementRef,
        moveControl,
        selectControl,
        isSelected,
        handleDropElement,
        locked,
        setCurrentScreen,
        device,
        isPortrait
      }) => {
      const { title, dropTarget, allowChildren, children, lockedChildren } = control;
      const styles = control.styles(device as DeviceEnum, !!isPortrait);
      const classes = useStyles();
      let backgroundColor = isOverCurrent ? 'rgba(0,0,0,0.05)' : styles.backgroundColor;
      let borderStyles = {};
      if (isOverCurrent) {
        borderStyles = dropTarget !== undefined ? borders[dropTarget] : {};
        if (dropTarget === DropEnum.Inside && !allowChildren) {
          borderStyles = {};
          backgroundColor = styles.backgroundColor
        }
      }

      const controlClass = classNames({
        [classes.hover]: !locked,
        [classes.invisible]: !control.visible
      });

      let showPlaceholder = children.length === 0;
      let Tag = 'div';
      let placeholder = (<div style={{position: "relative", height: "100%"}} key={`${control.id}_1`}>
        <div className={classes.placeholder}>{title}</div>
      </div>);

      if (control.type === ControlEnum.Text) {
        if (!control.hasImage) {
          Tag = 'span';
          showPlaceholder = true;
          // if (isSelected && isSelected(control)) {
          //   backgroundColor = styles.backgroundColor;
          //   placeholder =
          //     <EditorInput
          //       html={title}
          //       onChange={(e) => control.changeTitle(e)}
          //       style={{...styles, opacity: 1}} />;
          // } else {
          //   // @ts-ignore
          //   placeholder = title;
          // }
        } else {
          showPlaceholder = false;
        }
        placeholder = title as unknown as JSX.Element;
      }

      const emptyControl: React.CSSProperties = {};
      if (!control.children.length && control.type === ControlEnum.Grid) {
        emptyControl.padding = '15px';
      }

      const lock = locked || lockedChildren;

      const props = {
        id: `capture_${control.id}`,
        key: control.id,
        'data-testid': 'control',
        onClick: (e: MouseEvent) => {
          if (locked) {
            return;
          }
          selectControl && selectControl(control, undefined, true);
          if (!control.hasImage) {
            control.applyActions(setCurrentScreen);
            e.stopPropagation();
          }
        },
        ref: elementRef,
        style: {
          ...styles, backgroundColor, ...emptyControl, ...borderStyles, ...(isDragging ? {
            position: 'absolute',
            top: -1000
          } : {}),
        },
        className: controlClass
      };

      const elementChildren = children.length ? children.map((child, i) =>
        lock ? (
          <ElementComponent
            key={child.id}
            control={child}
            locked={true}
          />
        ) : (
          <Item
            key={child.id}
            control={child}
            moveControl={moveControl}
            handleDropElement={handleDropElement}
            isSelected={isSelected}
            setCurrentScreen={setCurrentScreen}
            selectControl={selectControl} />
        )
      ) : showPlaceholder ? [placeholder] : [];

      return React.createElement(Tag, props, elementChildren);
    }
  );

const ControlItem: React.FC<ControlProps> = React.forwardRef(
  (
    {
      control,
      isDragging,
      isOver,
      isOverCurrent,
      connectDragSource,
      connectDragPreview,
      connectDropTarget,
      moveControl,
      handleDropElement,
      selectControl,
      setCurrentScreen,
      isSelected,
      device,
      isPortrait
    },
    ref) => {
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
        device={device}
        isPortrait={isPortrait}
        elementRef={elementRef}
        control={control}
        isDragging={isDragging}
        isOverCurrent={isOverCurrent}
        handleDropElement={handleDropElement}
        selectControl={selectControl}
        isSelected={isSelected}
        setCurrentScreen={setCurrentScreen}
        moveControl={moveControl} />
    )
  });

ControlItem.displayName = 'ControlItem';

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
    ItemTypes.CONTROL,
    {
      beginDrag: (props: ControlProps, monitor, component) => {
        return {
          control: props.control,
          component
        }
      }
    },
    (connect, monitor) => ({
      connectDragPreview: connect.dragPreview(),
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }),
  )(ControlItem),
);

export default Item;
