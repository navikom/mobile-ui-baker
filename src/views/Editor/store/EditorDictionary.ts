import AbstractDictionary, { IObject } from "services/Dictionary/AbstractDictionary";
import { action } from "mobx";

export const data = {
  controls: "controls",
  settings: "settings",
  screen: "screen",
  mode: "mode",
  white: "white",
  dark: "dark",
  autoSave: "auto save",
  save: "save",
  import: "import",
  export: "export",
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
  transformDescription: "The transform CSS property lets you rotate, scale, skew, or translate an element. It modifies the coordinate space of the CSS visual formatting model.",
  transitionDescription: "The transition CSS property is a shorthand property for transition-property, transition-duration, transition-timing-function, and transition-delay.",
  transitionPropertyDescription: "The transition-property CSS property sets the CSS properties to which a transition effect should be applied.",
  transitionDurationDescription: "The transition-duration CSS property sets the length of time a transition animation should take to complete. By default, the value is 0s, meaning that no animation will occur.",
  transitionTimingDescription: "The transition-timing-function CSS property sets how intermediate values are calculated for CSS properties being affected by a transition effect.",
  transitionDelayDescription: "The transition-delay CSS property specifies the duration to wait before starting a property's transition effect when its value changes.",
  positionDescription: "The position CSS property sets how an element is positioned in a document. The top, right, bottom, and left properties determine the final location of positioned elements.",
  learnMore: "Learn more",
  moreOptions: "More Options",
  unit: "unit",
  borders: "borders",
  dimensions: "dimensions",
  font: "font",
  align: "align",
  alignChildren: "align children",
  animations: "animations",
  lockChildren: "Lock children",
  cloneControl: "Clone control",
  styles: "styles",
  actions: "actions",
  style: "style",
  action: "action",
  add: "add",
  delete: "delete",
  goTo: "go to",
  onPress: "on press",
  navigateTo: "navigate to",
  enableStyle: "enable style",
  disableStyle: "disable style",
  toggleStyle: "toggle style",
  elements: "elements",
  project: "project",
  control: "control",
  component: "component",
  makeScreenshot: "make screenshot"
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
