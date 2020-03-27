import { v4 as uuidv4 } from "uuid";
import { action } from "mobx";
import Control from "models/Control/Control";
import IControl, { IGrid } from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import CreateControl from "models/Control/ControlStores";
import CSSProperty from "models/Control/CSSProperty";
import { CSS_VALUE_SELECT } from "models/Constants";

class GridStore extends Control implements IGrid {
  constructor(id: string) {
    super(ControlEnum.Grid, id, "Grid", true);
    this.mergeProperties([
      new CSSProperty("display", "flex", "flex", true, CSS_VALUE_SELECT)
        .setOptions(["inherit", "flex", "block", "inline"])
        .setDescription(["displayDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/display"]),
      new CSSProperty("justifyContent", "center", "center", true, CSS_VALUE_SELECT)
        .setOptions(["inherit", "center", "flex-start", "flex-end", "space-around", "space-between"])
        .setShowWhen(["display", "flex"]),
      new CSSProperty("alignItems", "center", "center", true, CSS_VALUE_SELECT)
        .setOptions(["inherit", "center", "flex-start", "flex-end"]).setShowWhen(["display", "flex"]),
      new CSSProperty("flexWrap", "nowrap", "nowrap", false, CSS_VALUE_SELECT)
        .setOptions(["nowrap", "wrap", "wrap-reverse"]).setShowWhen(["display", "flex"])
        .setDescription(["flexWrapDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap"]),
      new CSSProperty("overflow", "visible", "visible", false, CSS_VALUE_SELECT)
        .setOptions(["visible", "hidden", "clip", "scroll"]).makeExpandable()
        .setDescription(["overflowDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow"]),
      new CSSProperty("overflowX", "visible", "visible", false, CSS_VALUE_SELECT)
        .setOptions(["visible", "hidden", "clip", "scroll"]).setShowWhen(["overflow", "expanded"]),
      new CSSProperty("overflowY", "visible", "visible", false, CSS_VALUE_SELECT)
        .setOptions(["visible", "hidden", "clip", "scroll"]).setShowWhen(["overflow", "expanded"]),
      new CSSProperty("whiteSpace", "normal", "normal", false, CSS_VALUE_SELECT)
        .setOptions(["normal", "nowrap", "pre", "pre-wrap", "pre-line"])
        .setDescription(["whiteSpaceDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/white-space"])
    ]);
  }

  @action clone(): IGrid {
    const clone = CreateControl(ControlEnum.Grid);
    this.children.forEach(child => clone.addChild(child.clone() as IControl));
    super.cloneProps(clone);
    return clone;
  }

  static create() {
    return new GridStore(uuidv4());
  }
}

export default GridStore;
