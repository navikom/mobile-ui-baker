import { v4 as uuidv4 } from "uuid";
import Control from "models/Control/Control";
import { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { observable } from "mobx";
import { IScreen } from "interfaces/IScreen";

class GridStore extends Control implements IGrid {
  constructor(id: string, screen?: IScreen) {
    super(ControlEnum.Grid, id, "Grid", true, screen);
  }

  static create(screen?: IScreen) {
    return new GridStore(uuidv4(), screen);
  }
}

export default GridStore;
