import { RefObject } from "react";
import IControl from "interfaces/IControl";
import { DropEnum } from "enums/DropEnum";
import { DeviceEnum } from 'enums/DeviceEnum';

export interface ControlProps {
  control: IControl;
  moveControl?: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  handleDropElement?: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  isDragging?: boolean;
  connectDragSource?: (ref: RefObject<HTMLDivElement>) => void;
  connectDropTarget?: (ref: RefObject<HTMLDivElement>) => void;
  connectDragPreview?: (ref: HTMLImageElement, options?: {captureDraggingState: boolean}) => void;
  isOver?: boolean;
  isOverCurrent?: boolean;
  device?: DeviceEnum;
  isPortrait?: boolean;
  selectControl?(control?: IControl, screen?: IControl, fromDevice?: boolean): void;
  isSelected?(control: IControl): boolean;
  setCurrentScreen?: (action: string, screen?: IControl, behavior?: (string | number)[]) => void;
}
