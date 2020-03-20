import { v4 as uuidv4 } from 'uuid';
import Control from "models/Control/Control";
import { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";

class TextStore extends Control implements IGrid {
  constructor(id: string) {
    super(ControlEnum.Text, id, "Text", false);
  }

  static create() {
    return new TextStore(uuidv4());
  }
}

export default TextStore;
