import { v4 as uuidv4 } from 'uuid';
import Control from "models/Control/Control";
import { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";

class ButtonStore extends Control implements IGrid {
  constructor(id: string) {
    super(ControlEnum.Button, id, "Button");
  }

  static create() {
    return new ButtonStore(uuidv4());
  }
}

export default ButtonStore;
