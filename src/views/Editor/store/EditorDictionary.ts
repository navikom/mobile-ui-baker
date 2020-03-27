import AbstractDictionary, { IObject } from "services/Dictionary/AbstractDictionary";
import { action } from "mobx";

export const data = {
  controls: "controls",
  settings: "settings",
  screen: "screen",
  mode: "mode",
  white: "white",
  dark: "dark",
  background: "background",
  statusBar: "status bar",
  backgroundImageDescription: "The background-image CSS property sets one or more background images on an element",
  displayDescription: "The display CSS property sets whether an element is treated as a block or inline element and the layout used for its children, such as flow layout, grid or flex.",
  lineHeightDescription: "The line-height CSS property sets the height of a line box. It's commonly used to set the distance between lines of text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced inline elements, it specifies the height that is used to calculate line box height",
  flexWrapDescription: "The flex-wrap CSS property sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is allowed, it sets the direction that lines are stacked.",
  textOverflowDescription: "The text-overflow CSS property sets how hidden overflow content is signaled to users. It can be clipped, display an ellipsis ('…'), or display a custom string.",
  overflowDescription: "The overflow shorthand CSS property sets what to do when an element's content is too big to fit in its block formatting context. It is a shorthand for overflow-x and overflow-y.",
  whiteSpaceDescription: "The white-space CSS property sets how white space inside an element is handled.",
  backgroundSizeDescription: "The background-size CSS property sets the size of the element's background image. The image can be left to its natural size, stretched, or constrained to fit the available space.",
  borderDescription: "The border shorthand CSS property sets an element's border. It sets the values of border-width, border-style, and border-color.",
  learnMore: "Learn more",
  moreOptions: "More Options",
  unit: "unit"
};

class EditorDictionary extends AbstractDictionary {
  static keys: typeof data = data;

  constructor() {
    super(data, {});
    let key: keyof typeof data;
    for (key in EditorDictionary.keys) {
      this.reversed[EditorDictionary.keys[key]] = key;
    }
  }

  @action setData<T extends typeof data>(newData: T & IObject) {
    Object.keys(this.data).forEach((k) => (this.data[k] = newData[k]));
  }
}

export default EditorDictionary;
