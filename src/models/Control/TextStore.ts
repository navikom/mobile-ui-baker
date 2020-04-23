import { action } from "mobx";
import { v4 as uuidv4 } from 'uuid';
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
import ControlStore, { MAIN_CSS_STYLE } from "models/Control/ControlStore";
import ICSSProperty from "interfaces/ICSSProperty";

const styles = [
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
];
class TextStore extends ControlStore implements IText {
  constructor(id: string, style?: Map<string, ICSSProperty[]>) {
    super(ControlEnum.Text, id, "Text", false);
    const keys = style ? Array.from(new Map(style).keys()) : [MAIN_CSS_STYLE];
    this.mergeStyles(new Map(keys.map((key: string) => [key, styles.map(style => style.clone())])));
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
