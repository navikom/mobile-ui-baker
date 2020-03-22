import { v4 as uuidv4 } from 'uuid';
import Control from "models/Control/Control";
import { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { IScreen } from "interfaces/IScreen";

class TextStore extends Control implements IGrid {
  constructor(id: string, screen?: IScreen) {
    super(ControlEnum.Text, id, "Text", false, screen);
  }

  static create(screen?: IScreen) {
    return new TextStore(uuidv4(), screen);
  }
}

export default TextStore;
