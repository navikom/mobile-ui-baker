import { action, observable } from "mobx";
import { v4 as uuidv4 } from 'uuid';
import Control from "models/Control/Control";
import IControl, { IText } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import CreateControl from "models/Control/ControlStores";
import CSSProperty from "models/Control/CSSProperty";
import { CSS_VALUE_NUMBER } from "models/Constants";

class TextStore extends Control implements IText {
  constructor(id: string) {
    super(ControlEnum.Text, id, "Text", false);
    this.mergeProperties([
      new CSSProperty("color", "#000000", "#000000"),
      new CSSProperty("padding", 5, 5, false, CSS_VALUE_NUMBER).setUnits("px", ["px", "%", "rem"]),
      new CSSProperty("fontFamily", "Verdana", "Verdana")
        .setOptions(["\"Times New Roman\"", "Georgia", "Arial", "Verdana", "\"Courier New\"", "\"Lucida Console\"", "Helvetica"]),
      new CSSProperty("fontStyle", "normal", "normal")
        .setOptions(["normal", "italic", "oblique"]),
      new CSSProperty("fontSize", 17, 17, false, CSS_VALUE_NUMBER),
      new CSSProperty("fontWeight", "normal", "normal")
        .setOptions(["normal", "bold", "lighter", "bolder", "100", "200", "300", "400", "500", "600", "700", "800", "900"]),
      new CSSProperty("textDecoration", "none", "none")
        .setOptions(["normal", "blink", "line-through", "overline", "underline", "inherit"]),
      new CSSProperty("lineHeight", "normal", "normal")
        .setDescription(["lineHeightDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height"]),
      new CSSProperty("textOverflow", "ellipsis", "ellipsis")
        .setOptions(["clip", "ellipsis"]).setDescription(["textOverflowDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow"])
    ]);
  }

  @action clone(): IText {
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
