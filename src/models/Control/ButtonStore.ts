import { v4 as uuidv4 } from "uuid";
import { action } from "mobx";
import Control, { MAIN_CSS_PROPERTY } from "models/Control/Control";
import IControl, { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import CreateControl from "models/Control/ControlStores";
import CSSProperty from "models/Control/CSSProperty";
import { CSS_CAT_ALIGN_CHILDREN, CSS_CAT_DIMENSIONS, CSS_VALUE_NUMBER } from "models/Constants";

class ButtonStore extends Control implements IGrid {
  constructor(id: string) {
    super(ControlEnum.Button, id, "Button", true);
    this.mergeStyles(
      new Map([
        [MAIN_CSS_PROPERTY,
          [new CSSProperty("padding", "3px 5px", "3px 5px", CSS_CAT_ALIGN_CHILDREN, true),
            new CSSProperty("width", 40, 40, CSS_CAT_DIMENSIONS, true, CSS_VALUE_NUMBER)
              .setUnits("px", ["px", "%", "rem"]),
            new CSSProperty("height", 20, 20, CSS_CAT_DIMENSIONS, true, CSS_VALUE_NUMBER)
              .setUnits("px", ["px", "%", "rem"])]
        ]
      ])
    );
  }

  @action clone(): IGrid {
    const clone = CreateControl(ControlEnum.Button);
    this.children.forEach(child => clone.addChild(child.clone() as IControl));
    super.cloneProps(clone);
    return clone;
  }

  static create() {
    return new ButtonStore(uuidv4());
  }
}

export default ButtonStore;
