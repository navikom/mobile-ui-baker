import { XYCoord } from "react-dnd";
import { DropEnum } from "enums/DropEnum";
import { ControlProps } from "interfaces/IControlProps";
import { DragAndDropItem } from "views/Editor/store/EditorViewStore";

const hover = (props: ControlProps | DragAndDropItem, monitor: any, component: any) => {
  // node = HTML Div element from imperative API
  const node = component.getNode();
  // Determine rectangle on screen
  const hoverBoundingRect = node.getBoundingClientRect();
  const { x, width, height } = hoverBoundingRect;
  const x2 = x + width;
  // Get vertical middle
  const hoverMiddleY = height / 2;
  const shiftTarget = Math.min(height / 4, 5);
  // Determine mouse position
  const clientOffset = monitor.getClientOffset();
  // Get pixels to the top
  const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
  const hoverClientX = (clientOffset as XYCoord).x;

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
  return dropAction;
};

export default hover;
