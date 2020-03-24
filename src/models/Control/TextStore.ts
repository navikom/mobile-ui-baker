import { action } from "mobx";
import { v4 as uuidv4 } from 'uuid';
import Control from "models/Control/Control";
import IControl, { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import CreateControl from "models/Control/ControlStores";

class TextStore extends Control implements IGrid {
  constructor(id: string) {
    super(ControlEnum.Text, id, "Text", false);
  }

  @action clone(): IGrid {
    const clone = CreateControl(ControlEnum.Text);
    this.children.forEach(child => clone.addChild(child.clone() as IControl));
    super.cloneProps(clone);
    return clone;
  }

  static create() {
    return new TextStore(uuidv4());
  }
}

export default TextStore;
