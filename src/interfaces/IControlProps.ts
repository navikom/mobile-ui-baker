import IControl from "interfaces/IControl";
import { DropEnum } from "models/DropEnum";
import { RefObject } from "react";

export interface ControlProps {
  control: IControl;
  moveControl?: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  handleDropElement: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  isDragging: boolean;
  connectDragSource?: (ref: RefObject<HTMLDivElement>) => void;
  connectDropTarget?: (ref: RefObject<HTMLDivElement>) => void;
  isOver?: boolean;
  isOverCurrent: boolean;
  selectControl(control?: IControl): void;
  isSelected(control: IControl): boolean;
}