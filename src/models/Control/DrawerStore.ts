import { v4 as uuidv4 } from 'uuid';
import Control from "models/Control/Control";
import { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { IScreen } from "interfaces/IScreen";

class DrawerStore extends Control implements IGrid {
  constructor(id: string, screen?: IScreen) {
    super(ControlEnum.Drawer, id, "Drawer", true, screen);
  }

  static create(screen?: IScreen) {
    return new DrawerStore(uuidv4(), screen);
  }
}

export default DrawerStore;
