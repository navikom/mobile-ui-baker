import { v4 as uuidv4 } from 'uuid';
import Control from "models/Control/Control";
import { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";

class GridStore extends Control implements IGrid {
  constructor(id: string) {
    super(ControlEnum.Grid, id, "Grid");
  }

  static create() {
    return new GridStore(uuidv4());
  }
}

export default GridStore;
