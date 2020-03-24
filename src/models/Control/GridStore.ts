import { v4 as uuidv4 } from "uuid";
import { action } from "mobx";
import Control from "models/Control/Control";
import IControl, { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import CreateControl from "models/Control/ControlStores";

class GridStore extends Control implements IGrid {
  constructor(id: string) {
    super(ControlEnum.Grid, id, "Grid", true);
  }

  @action clone(): IGrid {
    const clone = CreateControl(ControlEnum.Grid);
    this.children.forEach(child => clone.addChild(child.clone() as IControl));
    super.cloneProps(clone);
    return clone;
  }

  static create() {
    return new GridStore(uuidv4());
  }
}

export default GridStore;
