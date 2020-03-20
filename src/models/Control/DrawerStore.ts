import { v4 as uuidv4 } from 'uuid';
import Control from "models/Control/Control";
import { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";

class DrawerStore extends Control implements IGrid {
  constructor(id: string) {
    super(ControlEnum.Drawer, id, "Drawer");
  }

  static create() {
    return new DrawerStore(uuidv4());
  }
}

export default DrawerStore;
