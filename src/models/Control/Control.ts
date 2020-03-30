import React from "react";
import { action, computed, IObservableArray, observable } from "mobx";
import IControl from "interfaces/IControl";
import { ControlEnum } from "models/ControlEnum";
import { DropEnum } from "models/DropEnum";
import Movable from "models/Movable";
import { ErrorHandler } from "utils/ErrorHandler";
import ICSSProperty from "interfaces/ICSSProperty";
import CSSProperty from "models/Control/CSSProperty";
import {
  ACTION_DISABLE_STYLE,
  ACTION_ENABLE_STYLE,
  ACTION_NAVIGATE_TO,
  ACTION_TOGGLE_STYLE,
  CSS_CAT_ALIGN,
  CSS_CAT_ALIGN_CHILDREN,
  CSS_CAT_ANIMATIONS,
  CSS_CAT_BACKGROUND,
  CSS_CAT_BORDERS,
  CSS_CAT_DIMENSIONS,
  CSS_VALUE_COLOR,
  CSS_VALUE_NUMBER,
  CSS_VALUE_SELECT
} from "models/Constants";

export const MAIN_CSS_STYLE = "Main";

type ModelType = IControl;
export type ModelCtor<M extends IControl = IControl> = (new (id: string) => M) & ModelType;

class Control extends Movable implements IControl {
  type: ControlEnum;
  id: string;
  readonly allowChildren: boolean;
  static controls: IControl[] = [];
  static actions: string[] = ["onPress"];
  @observable static classes: string[] = [];
  @observable title: string;
  @observable parentId?: string;
  @observable dropTarget?: DropEnum;
  @observable visible: boolean = true;
  @observable lockedChildren: boolean = false;
  @observable cssStyles: Map<string, IObservableArray<ICSSProperty>>;
  @observable classes: string[] = observable([MAIN_CSS_STYLE]);
  @observable actions: IObservableArray<IObservableArray<string>> = observable([]);

  get toJSON() {
    const keys = Array.from(this.cssStyles.keys());
    const cssStyles = [];
    let l = keys.length, i = 0;
    while (l--) {
      const key = keys[i++];
      cssStyles.push([key, this.cssStyles.get(key)!.filter(prop => prop.enabled).map(prop => prop.toJSON)]);
    }

    return {
      type: this.type,
      title: this.title,
      parentId: this.parentId,
      children: this.children.map(child => child.toJSON),
      id: this.id,
      heldChildren: this.lockedChildren,
      allowChildren: this.allowChildren,
      cssStyles
    }
  }

  @computed get styles() {
    const styles: React.CSSProperties = {};
    let l = this.classes.length, i = 0;
    while (l--) {
      const clazz = this.classes[i++];
      this.cssStyles.has(clazz) && this.cssStyles.get(clazz)!.filter(prop => {
        if(!prop.enabled && styles.hasOwnProperty(prop.key)) {
          delete styles[prop.key];
        }
        return prop.enabled;
      })
        .forEach((prop) => {
          // @ts-ignore
          styles[prop.key] = prop.inject ? prop.inject.replace("$", prop.value) : prop.valueWithUnit;
        });
    }
    return styles;
  }

  constructor(type: ControlEnum, id: string, title: string, allowChildren: boolean = true) {
    super();
    this.id = id;
    this.type = type;
    this.allowChildren = allowChildren;
    this.title = title;
    this.cssStyles = new Map([
      [MAIN_CSS_STYLE, observable([
        new CSSProperty("position", "static", "static", CSS_CAT_ALIGN, false, CSS_VALUE_SELECT)
          .setOptions(["static", "relative", "absolute", "sticky"])
          .setDescription(["positionDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/position"]),
        new CSSProperty("top", 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["position", "absolute"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("bottom", 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["position", "absolute"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("left", 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["position", "absolute"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("right", 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["position", "absolute"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("backgroundColor", "#ffffff", "#ffffff", CSS_CAT_BACKGROUND, false,
          CSS_VALUE_COLOR),
        new CSSProperty("backgroundImage",
          "https://res.cloudinary.com/dnfk5l75j/image/upload/v1579263129/email-editor/v2/placeholder_01.png",
          "https://res.cloudinary.com/dnfk5l75j/image/upload/v1579263129/email-editor/v2/placeholder_01.png", CSS_CAT_BACKGROUND)
          .makeExpandable().setInjectable("url($)")
          .setDescription(["backgroundImageDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/background-image"]),
        new CSSProperty("backgroundSize", "", "", CSS_CAT_BACKGROUND).setShowWhen(["backgroundImage", "expanded"])
          .setDescription(["backgroundSizeDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/background-size"]),
        new CSSProperty("backgroundRepeat", "no-repeat", "no-repeat", CSS_CAT_BACKGROUND, false, CSS_VALUE_SELECT)
          .setShowWhen(["backgroundImage", "expanded"])
          .setOptions(["no-repeat", "repeat", "repeat-x", "repeat-y", "space", "round", "repeat space", "repeat repeat", "round space", "no-repeat round"])
          .setDescription(["backgroundSizeDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/background-size"]),
        new CSSProperty("width", 10, 10, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
          .setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("height", 10, 10, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
          .setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("minWidth", 10, 10, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
          .setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("minHeight", 10, 10, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
          .setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("maxWidth", 40, 40, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
          .setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("maxHeight", 20, 20, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
          .setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("padding", 15, 0, CSS_CAT_ALIGN_CHILDREN, true)
          .makeExpandable(),
        new CSSProperty("paddingTop", 0, 0, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["padding", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("paddingRight", 0, 0, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["padding", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("paddingBottom", 0, 0, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["padding", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("paddingLeft", 0, 0, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["padding", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("margin", 0, 0, CSS_CAT_ALIGN).makeExpandable(),
        new CSSProperty("marginTop", 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["margin", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("marginRight", 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["margin", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("marginBottom", 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["margin", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("marginLeft", 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
          .setShowWhen(["margin", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("border", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)", CSS_CAT_BORDERS)
          .makeExpandable().setDescription(["borderDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/border"]),
        new CSSProperty("borderTop", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)", CSS_CAT_BORDERS)
          .setShowWhen(["border", "expanded"]),
        new CSSProperty("borderRight", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)", CSS_CAT_BORDERS)
          .setShowWhen(["border", "expanded"]),
        new CSSProperty("borderBottom", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)", CSS_CAT_BORDERS)
          .setShowWhen(["border", "expanded"]),
        new CSSProperty("borderLeft", "1px solid rgba(0,0,0,0.2)", "1px solid rgba(0,0,0,0.2)", CSS_CAT_BORDERS)
          .setShowWhen(["border", "expanded"]),
        new CSSProperty("borderRadius", 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
          .makeExpandable().setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("borderTopLeftRadius", 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
          .setShowWhen(["borderRadius", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("borderTopRightRadius", 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
          .setShowWhen(["borderRadius", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("borderBottomRightRadius", 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
          .setShowWhen(["borderRadius", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("borderBottomLeftRadius", 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
          .setShowWhen(["borderRadius", "expanded"]).setUnits("px", ["px", "%", "rem"]),
        new CSSProperty("transform", "rotate(3turn)", "rotate(3turn)", CSS_CAT_ANIMATIONS)
          .setDescription(["transformDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/transform"]),
        new CSSProperty("transition", "all 3s ease-out 1s", "all 1s ease-out 1s", CSS_CAT_ANIMATIONS)
          .makeExpandable()
          .setDescription(["transitionDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/transition"]),
        new CSSProperty("transitionProperty", "all", "all", CSS_CAT_ANIMATIONS)
          .setDescription(["transitionPropertyDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property"])
          .setShowWhen(["transition", "expanded"]),
        new CSSProperty("transitionDuration", 1, 1, CSS_CAT_ANIMATIONS, false, CSS_VALUE_NUMBER)
          .setDescription(["transitionDurationDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration"])
          .setShowWhen(["transition", "expanded"]).setUnits("s", ["s", "ms"]),
        new CSSProperty("transitionTimingFunction", "ease-in", "ease-in", CSS_CAT_ANIMATIONS)
          .setDescription(["transitionTimingDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function"])
          .setShowWhen(["transition", "expanded"]),
        new CSSProperty("transitionDelay", 0.5, 0.5, CSS_CAT_ANIMATIONS, false, CSS_VALUE_NUMBER)
          .setDescription(["transitionDelayDescription", "https://developer.mozilla.org/en-US/docs/Web/CSS/transition-delay"])
          .setShowWhen(["transition", "expanded"]).setUnits("s", ["s", "ms"]),
      ])]
    ]);
  }

  @action addClass(value: string) {
    !this.classes.includes(value) && this.classes.push(value);
  }

  @action removeClass(value: string) {
    this.classes.includes(value) && this.classes.splice(this.classes.indexOf(value), 1);
  }

  @action switchLockChildren = () => {
    this.lockedChildren = !this.lockedChildren;
  };

  @action switchVisibility = () => {
    this.visible = !this.visible;
  };

  @action setParent(parentId?: string): void {
    this.parentId = parentId;
  }

  @action setTarget(target?: DropEnum): void {
    this.dropTarget = target;
  }

  @action deleteSelf = () => {
    if (this.parentId) {
      const parent = Control.getById(this.parentId);
      parent && parent.removeChild(this);
    }
    Control.removeItem(this);
  };

  @action addCSSStyle = () => {
    const key = `Style${this.cssStyles.size}`;
    this.cssStyles.set(key, observable(this.cssStyles.get(MAIN_CSS_STYLE)!.map(prop => prop.clone())));
    Control.addClass(this.id, key);
  };

  @action renameCSSStyle = (oldKey: string, newKey: string) => {
    if (!this.cssStyles.has(oldKey)) {
      return;
    }
    let key = newKey.replace(/\//g, "1");
    if (key === MAIN_CSS_STYLE || key === oldKey) {
      key = newKey + "" + 1;
    }
    this.cssStyles.set(key, this.cssStyles.get(oldKey) as IObservableArray<ICSSProperty>);
    this.cssStyles.delete(oldKey);
    Control.renameClass(this.id, oldKey, key);
  };

  @action removeCSSStyle(key: string): void {
    this.cssStyles.delete(key);
    Control.removeClass(this.id, key);
  }

  @action cloneProps(clone: IControl) {
    clone.changeTitle(this.title);
    clone.mergeStyles(this.cssStyles);
    if (clone.cssStyles.size > 1) {
      Array.from(clone.cssStyles.keys())
        .filter(k => k !== MAIN_CSS_STYLE).forEach(k => Control.addClass(clone.id, k));
    }
  }

  @action mergeStyles(props: Map<string, ICSSProperty[]>) {
    const keys = Array.from(props.keys());
    let l = keys.length, i = 0;
    while (l--) {
      const key = keys[i++];
      props.has(key) && this.merge(key, props.get(key) as ICSSProperty[]);
    }
  }

  @action merge(key: string, props: ICSSProperty[]) {
    if(!this.cssStyles.has(key)) {
      this.cssStyles.set(key, observable([]));
    }
    const sliced = props.slice();
    let prop: ICSSProperty;
    while (prop = sliced.shift() as ICSSProperty) {
      if (!this.cssStyles.has(key)) {
        continue;
      }
      const same = this.cssStyles.get(key)!.find(p => p.key === prop.key);
      if (same) {
        same.updateProperties(prop as unknown as { [key: string]: string | number });
      } else {
        const property = prop instanceof CSSProperty ? prop.clone() : CSSProperty.fromJSON(prop);
        this.cssStyles.get(key)!.push(property);
      }
    }
  }

  @action addAction = (action: string[]) => {
    this.actions.push(observable(action));
  };

  @action editAction = (index: number, action: string, props: string) => {
    this.actions[index].replace([action, ...props.split("/")]);
  };

  @action removeAction = (index: number) => {
    this.actions.splice(index, 1);
  }

  applyActions = (cb?: (screen: IControl) => void) => {
    this.actions.forEach(action => {
      if (!Control.has(action[1])) {
        return;
      }
      const control = Control.getById(action[1]) as IControl;
      if (action[0] === ACTION_NAVIGATE_TO) {
        cb && cb(control);
      } else {

        const style = action[2];
        if(!control.cssStyles.has(style)) {
          return;
        }
        if (action[0] === ACTION_ENABLE_STYLE) {
          control.addClass(style);
        } else if (action[0] === ACTION_DISABLE_STYLE) {
          control.removeClass(style);
        } else if (action[0] === ACTION_TOGGLE_STYLE) {
          control.classes.includes(style) ? control.removeClass(style) : control.addClass(style);
        }
      }
    });
  };

  clone(): IControl {
    throw new ErrorHandler("Redefine in children");
  }

  //######### static ##########//

  static has(controlId: string) {
    return this.controls.some(control => control.id === controlId);
  }

  static getById(id: string) {
    return this.controls.find(c => c.id === id);
  }

  static addItem(control: IControl) {
    this.controls.push(control);
  }

  static getOrCreate(instance: ModelCtor, control: IControl) {
    let contr = this.getById(control.id);
    if (!contr) {
      contr = Control.fromJSON(instance, control);
      this.addItem(contr);
    }
    return contr;
  }

  static removeItem(control: IControl) {
    this.controls.splice(this.controls.indexOf(control), 1);
  }

  static fromJSON(instance: ModelCtor, json: IControl) {
    const control = new instance(json.id);
    control.title = json.title;
    control.parentId = json.parentId;
    control.children.replace(json.children);
    control.lockedChildren = json.lockedChildren;
    control.mergeStyles(new Map(json.cssStyles));
    if (control.cssStyles.size > 1) {
      Array.from(control.cssStyles.keys())
        .filter(k => k !== MAIN_CSS_STYLE).forEach(k => this.addClass(control.id, k));
    }
    return control;
  }

  @action static addClass(id: string, className: string) {
    const clazz = `${id}/${className}`;
    !this.classes.includes(clazz) && this.classes.push(clazz);
  }

  @action static removeClass(id: string, className: string) {
    const clazz = `${id}/${className}`;
    this.classes.includes(clazz) && this.classes.splice(this.classes.indexOf(clazz), 1);
  }

  @action static renameClass(id: string, oldClassName: string, newClassName: string) {
    const oldClass = `${id}/${oldClassName}`;
    const newClass = `${id}/${newClassName}`;
    this.classes.splice(this.classes.indexOf(oldClass), 1, newClass);
  }

  static create(instance: ModelCtor, control: IControl) {
    return this.getOrCreate(instance, control);
  }
}

export default Control;
