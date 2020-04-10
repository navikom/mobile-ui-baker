import { action } from "mobx";
import { v4 as uuidv4 } from 'uuid';
import Control, { MAIN_CSS_STYLE } from "models/Control/Control";
import IControl, { IText } from "interfaces/IControl";
import { ControlEnum } from "enums/ControlEnum";
import CreateControl from "models/Control/ControlStores";
import CSSProperty from "models/Control/CSSProperty";
import {
  CSS_CAT_ALIGN_CHILDREN,
  CSS_CAT_BACKGROUND, CSS_CAT_FONT,
  CSS_VALUE_COLOR,
  CSS_VALUE_NUMBER,
  CSS_VALUE_SELECT
} from "models/Constants";

class TextStore extends Control implements IText {
  constructor(id: string) {
    super(ControlEnum.Text, id, "Text", false);
    this.mergeStyles(new Map([
      [MAIN_CSS_STYLE, [
        new CSSProperty("backgroundColor", "#ffffff", "#ffffff", CSS_CAT_BACKGROUND,false, CSS_VALUE_COLOR),
        new CSSProperty("color", "#000000", "#000000", CSS_CAT_FONT, false, CSS_VALUE_COLOR),
        new CSSProperty("padding", "5px", "5px", CSS_CAT_ALIGN_CHILDREN),
        new CSSProperty("fontFamily", "Verdana", "Verdana", CSS_CAT_FONT, false, CSS_VALUE_SELECT)
          .setOptions(["\"Times New Roman\"", "Georgia", "Arial", "Verdana", "\"Courier New\"", "\"Lucida Console\"", "Helvetica"]),
        new CSSProperty("fontStyle", "normal", "normal", CSS_CAT_FONT, false, CSS_VALUE_SELECT)
          .setOptions(["normal", "italic", "oblique"]),
        new CSSProperty("fontSize", 17, 17, CSS_CAT_FONT, false, CSS_VALUE_NUMBER)
          .setUnits("px", ["px", "rem"]),
        new CSSProperty("fontWeight", "normal", "normal", CSS_CAT_FONT, false, CSS_VALUE_SELECT)
          .setOptions(["normal", "bold", "lighter", "bolder", "100", "200", "300", "400", "500", "600", "700", "800", "900"]),
        new CSSProperty("textDecoration", "none", "none", CSS_CAT_FONT, false, CSS_VALUE_SELECT)
          .setOptions(["normal", "blink", "line-through", "overline", "underline", "inherit"]),
        new CSSProperty("lineHeight", "normal", "normal", CSS_CAT_FONT)
          .setDescription(["lineHeightDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height"]),
        new CSSProperty("textOverflow", "ellipsis", "ellipsis", CSS_CAT_FONT, false, CSS_VALUE_SELECT)
          .setOptions(["clip", "ellipsis"]).setDescription(["textOverflowDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow"])
      ]]
    ]));
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
