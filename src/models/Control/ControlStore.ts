import React from 'react';
import { action, computed, IObservableArray, observable } from 'mobx';
import sum from 'hash-sum';
import IControl, { IScreen } from 'interfaces/IControl';
import { ControlEnum } from 'enums/ControlEnum';
import { DropEnum } from 'enums/DropEnum';
import Movable from 'models/Movable';
import { ErrorHandler } from 'utils/ErrorHandler';
import ICSSProperty from 'interfaces/ICSSProperty';
import CSSProperty, { CSS_SET_VALUE, CSS_SWITCH_ENABLED, CSS_SWITCH_EXPANDED } from 'models/Control/CSSProperty';
import {
  ACTION_DISABLE_STYLE,
  ACTION_ENABLE_STYLE,
  ACTION_NAVIGATE_BACK,
  ACTION_NAVIGATE_REPLACE,
  ACTION_NAVIGATE_TO,
  ACTION_TOGGLE_STYLE,
  CSS_CAT_ALIGN,
  CSS_CAT_ALIGN_CHILDREN,
  CSS_CAT_ANIMATIONS,
  CSS_CAT_BACKGROUND,
  CSS_CAT_BORDERS,
  CSS_CAT_DIMENSIONS, CSS_VALUE_BORDER,
  CSS_VALUE_COLOR,
  CSS_VALUE_NUMBER,
  CSS_VALUE_SELECT, DEVICE_HEIGHT, DEVICE_WIDTH
} from 'models/Constants';
import EditorHistory, {
  ControlStatic,
  HIST_ADD_ACTION,
  HIST_ADD_CSS_STYLE,
  HIST_CHANGE_TITLE,
  HIST_CONTROL_PROP_CHANGE,
  HIST_CSS_PROP,
  HIST_DELETE_SELF,
  HIST_EDIT_ACTION,
  HIST_REMOVE_ACTION,
  HIST_REMOVE_CSS_STYLE,
  HIST_RENAME_CSS_STYLE
} from 'views/Editor/store/EditorHistory';
import IHistory from 'interfaces/IHistory';
import IProject from 'interfaces/IProject';
import DelayEnum from 'enums/DelayEnum';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';
import { TextMetaEnum } from 'enums/TextMetaEnum';
import ColorsStore from '../ColorsStore';
import { DeviceEnum } from 'enums/DeviceEnum';

export const MAIN_CSS_STYLE = 'Main';

type ModelType = IControl;
export type ModelCtor<M extends IControl = IControl> =
  (new (id: string, styles?: Map<string, IObservableArray<ICSSProperty>>) => M)
  & ModelType;

const styles = [
  new CSSProperty('position', 'static', 'static', CSS_CAT_ALIGN, false, CSS_VALUE_SELECT)
    .setOptions(['static', 'relative', 'absolute', 'sticky'])
    .setDescription(['positionDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/position']),
  new CSSProperty('top', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['position', 'absolute']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('bottom', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['position', 'absolute']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('left', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['position', 'absolute']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('right', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['position', 'absolute']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('background', 'linear-gradient( to bottom,rgba(0,0,0,0.01),rgba(0,0,0,0.7) )', 'linear-gradient( to bottom,rgba(0,0,0,0.01),rgba(0,0,0,0.7) )', CSS_CAT_BACKGROUND),
  new CSSProperty('backgroundColor', '#ffffff', '#ffffff', CSS_CAT_BACKGROUND, false,
    CSS_VALUE_COLOR),
  new CSSProperty('backgroundImage',
    'https://res.cloudinary.com/dnfk5l75j/image/upload/v1579263129/email-editor/v2/placeholder_01.png',
    'https://res.cloudinary.com/dnfk5l75j/image/upload/v1579263129/email-editor/v2/placeholder_01.png', CSS_CAT_BACKGROUND)
    .makeExpandable().setInjectable('url($)')
    .setDescription(['backgroundImageDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/background-image']),
  new CSSProperty('backgroundSize', '100%', '100%', CSS_CAT_BACKGROUND, false, CSS_VALUE_SELECT)
    .setOptions(['100% 100%', '100%', 'contain', 'cover'])
    .setShowWhen(['backgroundImage', 'expanded'])
    .setDescription(['backgroundSizeDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/background-size']),
  new CSSProperty('backgroundRepeat', 'no-repeat', 'no-repeat', CSS_CAT_BACKGROUND, false, CSS_VALUE_SELECT)
    .setShowWhen(['backgroundImage', 'expanded'])
    .setOptions(['no-repeat', 'repeat', 'space', 'round'])
    .setDescription(['backgroundSizeDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/background-size']),
  new CSSProperty('backgroundPosition', 'center', 'center', CSS_CAT_BACKGROUND, false, CSS_VALUE_SELECT)
    .setOptions(['center'])
    .setShowWhen(['backgroundImage', 'expanded']),
  new CSSProperty('mask', 'url(https://res.cloudinary.com/dnfk5l75j/image/upload/v1589468711/muiditor/svg/menu_vnllet.svg)', 'url(https://res.cloudinary.com/dnfk5l75j/image/upload/v1589468711/muiditor/svg/menu_vnllet.svg)', CSS_CAT_BACKGROUND)
    .setDescription(['maskDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/mask']),
  new CSSProperty('maskImage',
    'https://res.cloudinary.com/dnfk5l75j/image/upload/v1589468711/muiditor/svg/menu_vnllet.svg',
    'https://res.cloudinary.com/dnfk5l75j/image/upload/v1589468711/muiditor/svg/menu_vnllet.svg', CSS_CAT_BACKGROUND)
    .makeExpandable().setInjectable('url($)')
    .setDescription(['maskImageDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image']),
  new CSSProperty('maskRepeat', 'round', 'round', CSS_CAT_BACKGROUND, false, CSS_VALUE_SELECT)
    .setShowWhen(['maskImage', 'expanded'])
    .setOptions(['no-repeat', 'round'])
    .setDescription(['maskRepeatDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/mask-repeat']),
  new CSSProperty('opacity', 1, 1, CSS_CAT_BACKGROUND, false, CSS_VALUE_NUMBER)
    .setControlProps({ min: 0, max: 1, double: true }),
  new CSSProperty('width', 10, 10, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
    .setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('height', 10, 10, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
    .setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('minWidth', 10, 10, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
    .setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('minHeight', 10, 10, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
    .setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('maxWidth', 40, 40, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
    .setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('maxHeight', 20, 20, CSS_CAT_DIMENSIONS, false, CSS_VALUE_NUMBER)
    .setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('padding', '15px', 0, CSS_CAT_ALIGN_CHILDREN)
    .makeExpandable(),
  new CSSProperty('paddingTop', 0, 0, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['padding', 'expanded']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('paddingRight', 0, 0, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['padding', 'expanded']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('paddingBottom', 0, 0, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['padding', 'expanded']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('paddingLeft', 0, 0, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['padding', 'expanded']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('lineHeight', 10, 10, CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_NUMBER)
    .setControlProps({ min: 0 })
    .setUnits('px', ['px'])
    .setDescription(['lineHeightDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/line-height']),
  new CSSProperty('margin', 0, 0, CSS_CAT_ALIGN).makeExpandable(),
  new CSSProperty('marginTop', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['margin', 'expanded']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('marginRight', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['margin', 'expanded']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('marginBottom', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['margin', 'expanded']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('marginLeft', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER)
    .setShowWhen(['margin', 'expanded']).setUnits('px', ['px', '%', 'rem', DEVICE_WIDTH, DEVICE_HEIGHT]),
  new CSSProperty('transform', 'translate(-50%,0)', 'translate(-50%,0)', CSS_CAT_ALIGN)
    .setDescription(['transformDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/transform']),
  new CSSProperty('zIndex', 0, 0, CSS_CAT_ALIGN, false, CSS_VALUE_NUMBER),
  new CSSProperty('border', '1px solid rgba(0,0,0,0.2)', '1px solid rgba(0,0,0,0.2)',
    CSS_CAT_BORDERS, false, CSS_VALUE_BORDER)
    .makeExpandable().setDescription(['borderDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/border']),
  new CSSProperty('borderTop', '1px solid rgba(0,0,0,0.2)', '1px solid rgba(0,0,0,0.2)',
    CSS_CAT_BORDERS,false, CSS_VALUE_BORDER)
    .setShowWhen(['border', 'expanded']),
  new CSSProperty('borderRight', '1px solid rgba(0,0,0,0.2)', '1px solid rgba(0,0,0,0.2)',
    CSS_CAT_BORDERS, false, CSS_VALUE_BORDER)
    .setShowWhen(['border', 'expanded']),
  new CSSProperty('borderBottom', '1px solid rgba(0,0,0,0.2)', '1px solid rgba(0,0,0,0.2)',
    CSS_CAT_BORDERS, false, CSS_VALUE_BORDER)
    .setShowWhen(['border', 'expanded']),
  new CSSProperty('borderLeft', '1px solid rgba(0,0,0,0.2)', '1px solid rgba(0,0,0,0.2)',
    CSS_CAT_BORDERS, false, CSS_VALUE_BORDER)
    .setShowWhen(['border', 'expanded']),
  new CSSProperty('borderRadius', 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
    .makeExpandable().setUnits('px', ['px', 'rem']),
  new CSSProperty('borderTopLeftRadius', 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
    .setShowWhen(['borderRadius', 'expanded']).setUnits('px', ['px', 'rem']),
  new CSSProperty('borderTopRightRadius', 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
    .setShowWhen(['borderRadius', 'expanded']).setUnits('px', ['px', 'rem']),
  new CSSProperty('borderBottomRightRadius', 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
    .setShowWhen(['borderRadius', 'expanded']).setUnits('px', ['px', 'rem']),
  new CSSProperty('borderBottomLeftRadius', 5, 5, CSS_CAT_BORDERS, false, CSS_VALUE_NUMBER)
    .setShowWhen(['borderRadius', 'expanded']).setUnits('px', ['px', 'rem']),
  new CSSProperty('transition', 'all .5s ease-out', 'all .5s ease-out', CSS_CAT_ANIMATIONS)
    .makeExpandable()
    .setDescription(['transitionDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/transition']),
  new CSSProperty('transitionProperty', 'all', 'all', CSS_CAT_ANIMATIONS)
    .setDescription(['transitionPropertyDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property'])
    .setShowWhen(['transition', 'expanded']),
  new CSSProperty('transitionDuration', 1, 1, CSS_CAT_ANIMATIONS, false, CSS_VALUE_NUMBER)
    .setDescription(['transitionDurationDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration'])
    .setShowWhen(['transition', 'expanded']).setUnits('s', ['s', 'ms']),
  new CSSProperty('transitionTimingFunction', 'ease-in', 'ease-in', CSS_CAT_ANIMATIONS)
    .setDescription(['transitionTimingDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function'])
    .setShowWhen(['transition', 'expanded']),
  new CSSProperty('boxShadow', '2px 4px 20px rgba(0,0,0,0.4)', '2px 4px 20px rgba(0,0,0,0.4)', CSS_CAT_BACKGROUND)
    .setDescription(['boxShadow', 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow']),
];

class ControlStore extends Movable implements IControl {
  type: ControlEnum;
  id: string;
  readonly allowChildren: boolean;
  static controls: IControl[] = [];
  static actions: string[] = ['onPress'];
  @observable static history: IHistory;
  @observable static classes: IObservableArray<string> = observable([]);
  @observable title: string;
  @observable parentId?: string;
  @observable dropTarget?: DropEnum;
  @observable visible = true;
  @observable lockedChildren = false;
  @observable cssStyles: Map<string, IObservableArray<ICSSProperty>>;
  @observable classes: IObservableArray<string> = observable([MAIN_CSS_STYLE]);
  @observable actions: IObservableArray<IObservableArray<string>> = observable([]);
  @observable saving = false;
  @observable meta: ScreenMetaEnum | TextMetaEnum = ScreenMetaEnum.COMPONENT;
  path: string[] = [];
  hashChildren?: string;
  hashChildrenWithStyle?: string;
  hashChildrenWithStyleAndTitles?: string;
  instance?: IProject;
  refObj?: HTMLDivElement;

  @computed get cssStylesJSON() {
    const keys = Array.from(this.cssStyles.keys());
    const cssStyles = [];
    let l = keys.length, i = 0;
    while (l--) {
      const key = keys[i++];
      cssStyles.push([key, this.cssStyles.get(key)!.filter(prop => prop.enabled).map(prop => prop.toJSON)]);
    }
    return cssStyles;
  }

  get toJSON() {
    return {
      type: this.type,
      title: this.title,
      parentId: this.parentId,
      actions: this.actions.toJS(),
      classes: this.classes.toJS(),
      children: this.children.map(child => child.toJSON),
      id: this.id,
      lockedChildren: this.lockedChildren,
      allowChildren: this.allowChildren,
      cssStyles: this.cssStylesJSON,
      meta: this.meta
    }
  }

  @computed get hasImage() {
    const styles = this.cssStylesJSON;
    let l = styles.length;
    while (l--) {
      const subStyles = styles[l] as {[key: string]: any}[];
      let j = subStyles[1].length;
      while (j--) {
        const subStyle = subStyles[1][j];
        if(['background', 'backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition',
          'mask', 'maskImage', 'maskRepeat'].includes(subStyle.key)) {
          return true;
        }
      }
    }
    return false;
  }

  get hasSVG() {
    const styles = this.cssStylesJSON;
    let l = styles.length;
    while (l--) {
      const subStyles = styles[l] as {[key: string]: any}[];
      let j = subStyles[1].length;
      while (j--) {
        const subStyle = subStyles[1][j];
        if(['mask', 'maskImage'].includes(subStyle.key)) {
          return true;
        }
      }
    }
    return false;
  }

  get hashSumChildren() {
    return {
      type: this.type,
      hasImage: this.hasImage,
      children: this.children.map(child => child.hashSumChildren),
    }
  }

  get hashSumChildrenWithStyles() {
    return {
      type: this.type,
      cssStyles: this.cssStylesJSON,
    }
  }

  get hashSumChildrenWithStylesAndTitles() {
    return {
      title: this.title,
      type: this.type,
      cssStyles: this.cssStylesJSON,
    }
  }

  styles(device: DeviceEnum, isPortrait: boolean) {
    return computed(() => {
      const styles: React.CSSProperties = {};
      let l = this.classes.length, i = 0;
      while (l--) {
        const clazz = this.classes[i++];
        this.cssStyles.has(clazz) && this.cssStyles.get(clazz)!.filter(prop => {
          if (!prop.enabled && Object.prototype.hasOwnProperty.call(styles, prop.key)) {
            delete styles[prop.key];
          }
          return prop.enabled;
        })
          .forEach((prop) => {
            // @ts-ignore
            styles[prop.key] =
              prop.inject ?
                prop.inject.replace('$', prop.value as string) :
                prop.valueWithUnit(device, isPortrait);
            if(prop.key.includes('mask') || prop.key === 'mask') {
              const key = prop.key.substring(1);
              // @ts-ignore
              styles[`WebkitM${key}`] =
                prop.inject ?
                  prop.inject.replace('$', prop.value as string) :
                  prop.valueWithUnit(device, isPortrait);
            }
            const id = this.id + '_' + clazz;
            if(prop.key === 'color') {
              styles[prop.key] = CSSProperty.controlColor.get(id);
            }
            if(prop.key === 'backgroundColor') {
              styles[prop.key] = CSSProperty.controlBackgroundColor.get(id);
            }
          });
      }
      return styles;
    }).get();
  }

  cssProperty(key: string, propName: string) {
    return computed(() => this.cssStyles.get(key)!.find(e => e.key === propName)).get();
  }

  activeClass(key: string) {
    return computed(() => this.classes.includes(key)).get();
  }

  setRefObject(ref: HTMLDivElement) {
    this.refObj = ref;
  }

  constructor(type: ControlEnum, id: string, title: string, allowChildren = true) {
    super();
    this.id = id;
    this.type = type;
    this.allowChildren = allowChildren;
    this.title = title;
    this.cssStyles = new Map([
      [MAIN_CSS_STYLE, observable(styles.map(style => style.clone()))]
    ]);
  }

  setId(id: string) {
    this.id = id;
  }

  setInstance(project?: IProject) {
    this.instance = project;
  }

  @action applyFoSelected() {
    this.setOpened(true);
    this.parentId !== undefined && ControlStore.getById(this.parentId)!.applyFoSelected();
  }

  @action setSaving(value: boolean): void {
    this.saving = value;
  }

  @action addClass(style: string) {
    !this.activeClass(style) && this.classes.push(style);
  }

  @action switchClass(style: string) {
    this.activeClass(style) ? this.removeClass(style) : this.addClass(style);
  }

  @action removeClass(style: string) {
    this.activeClass(style) && this.classes.splice(this.classes.indexOf(style), 1);
  }

  @action switchVisibility = () => {
    this.visible = !this.visible;
  };

  @action setParent(parentId?: string): void {
    this.parentId = parentId;
  }

  @action setTarget(target?: DropEnum): void {
    this.dropTarget = target;
  }

  @action setCSSStyle(key: string, style: ICSSProperty[]) {
    this.cssStyles.set(key, observable(style.map(e => CSSProperty.fromJSON(e))));
    ControlStore.addClass(this.id, key);
    this.cssStyles.get(key)!.forEach(prop => CSSProperty.addColor(this, key, prop));

  }

  @action deleteSelfTraverseChildren() {
    Array.from(this.cssStyles.keys()).forEach(key =>
      this.cssStyles.get(key)!.forEach(prop => CSSProperty.deleteColor(this, key, prop.key, prop.value as string)));
    this.children.forEach(child => child.deleteSelfTraverseChildren());
    ControlStore.removeItem(this);
  }

  @action setMeta(meta: ScreenMetaEnum) {
    this.meta = meta;
  }

  // ###### apply history start ######## //

  @action changeTitle = (title: string, noHistory?: boolean) => {
    if (title.length > 1000) {
      return;
    }
    const undo = { control: this.id, title: this.title };
    this.title = title;
    const redo = { control: this.id, title: this.title };
    !noHistory && ControlStore.history.add([HIST_CHANGE_TITLE, undo, redo]);
  };

  @action deleteSelf = (noHistory?: boolean) => {
    if (this.parentId) {
      const parent = ControlStore.getById(this.parentId);
      const undo = { control: this.toJSON, index: parent!.children.indexOf(this) };
      const redo = { control: this.id };
      parent && parent.removeChild(this);
      !noHistory && ControlStore.history.add([HIST_DELETE_SELF, undo, redo]);
    }
    this.deleteSelfTraverseChildren();
  };

  @action addCSSStyle = (noHistory?: boolean) => {
    const key = `Style${this.cssStyles.size}`;
    this.cssStyles.set(key, observable(this.cssStyles.get(MAIN_CSS_STYLE)!.map(prop => prop.clone())));
    ControlStore.addClass(this.id, key);
    this.cssStyles.get(key)!.forEach(prop => CSSProperty.addColor(this, key, prop));
    !noHistory && ControlStore.history.add([HIST_ADD_CSS_STYLE, { control: this.id, key }, { control: this.id }]);
  };

  @action renameCSSStyle = (oldKey: string, newKey: string, noHistory?: boolean) => {
    if (!this.cssStyles.has(oldKey)) {
      return;
    }
    this.cssStyles.get(oldKey)!.forEach(prop => CSSProperty.deleteColor(this, oldKey, prop.key, prop.value as string));

    let key = newKey.replace(/\//g, '1');
    if (key === MAIN_CSS_STYLE || key === oldKey) {
      key = newKey + '' + 1;
    }
    this.cssStyles.set(key, this.cssStyles.get(oldKey) as IObservableArray<ICSSProperty>);
    this.cssStyles.delete(oldKey);
    ControlStore.renameClass(this.id, oldKey, key);
    this.cssStyles.get(key)!.forEach(prop => CSSProperty.addColor(this, key, prop));
    !noHistory && ControlStore.history.add([HIST_RENAME_CSS_STYLE,
      { control: this.id, oldKey: key, key: oldKey }, { control: this.id, key, oldKey }]);
  };

  @action removeCSSStyle(key: string, noHistory?: boolean): void {
    const undo = { control: this.id, style: this.cssStyles.get(key)!.map(prop => prop.toJSON), key };
    this.cssStyles.get(key)!.forEach(prop => CSSProperty.deleteColor(this, key, prop.key, prop.value as string));
    this.cssStyles.delete(key);
    ControlStore.removeClass(this.id, key);
    const redo = { control: this.id, key };
    !noHistory && ControlStore.history.add([HIST_REMOVE_CSS_STYLE, undo, redo]);
  }

  @action addAction = (action: string[], noHistory?: boolean) => {
    this.actions.push(observable(action));
    !noHistory && ControlStore.history.add([HIST_ADD_ACTION,
      { control: this.id, index: this.actions.length - 1 },
      { control: this.id, action: action.slice() }
    ]);
  };

  @action editAction = (index: number, action: string, props: string, noHistory?: boolean) => {
    const undo = { control: this.id, action: this.actions[index].slice(), index };
    this.actions[index].replace([action, ...props.split('/')]);
    const redo = { control: this.id, action: [action, props], index };
    !noHistory && ControlStore.history.add([HIST_EDIT_ACTION, undo, redo]);
  };

  @action removeAction = (index: number, noHistory?: boolean) => {
    const undo = { control: this.id, action: this.actions[index].slice(), index };
    this.actions.splice(index, 1);
    const redo = { control: this.id, index };
    !noHistory && ControlStore.history.add([HIST_REMOVE_ACTION, undo, redo]);
  };

  @action switchLockChildren = () => {
    const undo = { control: this.id, model: { lockedChildren: this.lockedChildren } };
    this.lockedChildren = !this.lockedChildren;
    const redo = { control: this.id, model: { lockedChildren: this.lockedChildren } };
    ControlStore.history.add([HIST_CONTROL_PROP_CHANGE, undo, redo]);
  };

  // ####### styles handlers ######## //
  @action switchExpanded = (key: string, propName: string) => () => {

    const property = this.cssProperty(key, propName);
    if (property) {
      const undo = { control: this.id, key, method: [CSS_SWITCH_EXPANDED, propName, property.expanded] };
      property.switchExpanded();
      const redo = { control: this.id, key, method: [CSS_SWITCH_EXPANDED, propName, property.expanded] };
      ControlStore.history.add([HIST_CSS_PROP, undo, redo]);
    }
  };

  @action switchEnabled = (key: string, propName: string) => () => {
    const property = this.cssProperty(key, propName);
    if (property) {
      const undo = { control: this.id, key, method: [CSS_SWITCH_ENABLED, propName, property.enabled] };
      property.switchEnabled(this, key);
      const redo = { control: this.id, key, method: [CSS_SWITCH_ENABLED, propName, property.enabled] };
      ControlStore.history.add([HIST_CSS_PROP, undo, redo]);
    }
  };

  @action setValue = (key: string, propName: string) => (value: string | number) => {
    const property = this.cssProperty(key, propName);
    if (property) {
      CSSProperty.deleteColor(this, key, property.key, property.value as string);
      const undo = { control: this.id, key, method: [CSS_SET_VALUE, propName, property.value] }
      property.setValue(value);
      const redo = { control: this.id, key, method: [CSS_SET_VALUE, propName, property.value] }
      ControlStore.history.add([HIST_CSS_PROP, undo, redo]);
      CSSProperty.addColor(this, key, property);
    }
  };

  // ###### apply history end ######## //

  @action applyPropertyMethod(styleKey: string, method: string, propName: string, value: string | number | boolean) {
    const property = this.cssProperty(styleKey, propName);
    if (property) {
      if (method === CSS_SWITCH_ENABLED) {
        property.updateProperties({ enabled: value }, this, styleKey);
      } else if (method === CSS_SWITCH_EXPANDED) {
        property.updateProperties({ expanded: value }, this, styleKey);
      } else {
        CSSProperty.deleteColor(this, styleKey, property.key, property.value as string);
        property.setValue(value as string | number);
        CSSProperty.addColor(this, styleKey, property);
      }
    }
  }

  @action applyChanges(changes: IControl) {
    Object.assign(this, changes)
  }

  @action setAction(index: number, actions: string[]): void {
    this.actions.splice(index, 0, observable(actions));
  }

  @action cloneProps(clone: IControl) {
    clone.title = this.title;
    clone.mergeStyles(this.cssStyles);
    this.actions && clone.actions.replace(this.actions.map(actions => {
      return observable([actions[0], actions[1] === this.id ? clone.id : actions[1], actions[2]]);
    }));
    this.classes && clone.classes.replace(this.classes);
    if (clone.cssStyles.size > 1) {
      Array.from(clone.cssStyles.keys())
        .filter(k => k !== MAIN_CSS_STYLE).forEach(k => ControlStore.addClass(clone.id, k));
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
    if (!this.cssStyles.has(key)) {
      this.cssStyles.set(key, observable(styles.map(style => style.clone())));
    }
    const sliced = props.slice();

    while (sliced.length) {
      const prop = sliced.shift() as ICSSProperty;
      if (!this.cssStyles.has(key)) {
        continue;
      }
      const same = this.cssStyles.get(key)!.find(p => p.key === prop.key);
      if (same) {
        same.updateProperties(prop as unknown as { [key: string]: string | number }, this, key);
      } else {
        const property = prop instanceof CSSProperty ? prop.clone() : CSSProperty.fromJSON(prop);
        this.cssStyles.get(key)!.push(property);
        CSSProperty.addColor(this, key, property);
      }
    }
  }

  private act(actions: Array<Array<string>>, cb?: (action: string, screen?: IControl, behavior?: string[]) => void) {
    const action = actions.shift();
    if (!(action && ControlStore.has(action[1]))) {
      return;
    }
    const control = ControlStore.getById(action[1]) as IControl;
    const delay = action.length > 3 && action[3];
    setTimeout(() => {
      if ([ACTION_NAVIGATE_TO, ACTION_NAVIGATE_REPLACE, ACTION_NAVIGATE_BACK].includes(action[0])) {
        cb && cb(action[0], action[0] === ACTION_NAVIGATE_BACK ? undefined : control, action.slice(2));
      } else {

        const style = action[2];
        if (!control.cssStyles.has(style)) {
          return;
        }

        if (action[0] === ACTION_ENABLE_STYLE) {
          control.addClass(style);
        } else if (action[0] === ACTION_DISABLE_STYLE) {
          control.removeClass(style);
        } else if (action[0] === ACTION_TOGGLE_STYLE) {
          control.switchClass(style);
        }
      }

      setTimeout(() => {
        this.act(actions, cb);
      }, delay && delay === DelayEnum.AFTER ? Number(action[4]) : 0);

    }, delay && delay === DelayEnum.BEFORE ? Number(action[4]) : 0);

  }

  applyActions = (cb?: (action: string, screen?: IControl) => void) => {
    const actions = this.actions.slice();
    this.act(actions, cb);
  };

  setChecksum(depth: number, path: string[], index: number, cb: (depth: number, i: number, item: IControl) => void) {
    this.hashChildren = sum(this.hashSumChildren);
    this.hashChildrenWithStyle = sum(this.hashSumChildrenWithStyles);
    this.hashChildrenWithStyleAndTitles = sum(this.hashSumChildrenWithStylesAndTitles);
    this.path = path;
    cb(depth, index, this);
    this.children.forEach((child, j) => child.setChecksum(depth + 1, [...path, this.id], j, cb));
  }

  clone(): IControl {
    throw new ErrorHandler('Redefine in children');
  }

  toString() {
    const keys = Array.from(this.cssStyles.keys());
    const cssStyles = [];
    let l = keys.length, i = 0;
    while (l--) {
      const key = keys[i++];
      const props = this.cssStyles.get(key)!.filter(prop => prop.enabled).map(prop => prop.toString());
      if(props.length) {
        cssStyles.push(
          `[
          ${['"' + key + '"', '[' + props + ']']}
          ]`
        );
      }
    }

    return `{
      type: "${this.type}",
      id: "${this.id}",
      allowChildren: ${this.allowChildren},
      title: "${this.title}",
      parentId: ${this.parentId ? '"' + this.parentId + '"' : undefined},
      lockedChildren: ${this.lockedChildren},
      cssStyles: [${cssStyles}],
      classes: [${this.classes}],
      actions: [${this.actions}],
    }`;
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

  static getOrCreate(instance: ModelCtor, control: IControl, isMenu?: boolean) {
    let contr = this.getById(control.id);
    if (!contr) {
      contr = this.fromJSON(instance, control, isMenu);
      this.addItem(contr);
    }
    return contr;
  }

  static removeItem(control: IControl) {
    this.controls.splice(this.controls.indexOf(control), 1);
    this.clearClasses();
  }

  static fromJSON(instance: ModelCtor, json: IControl, isMenu?: boolean) {
    const control = new instance(json.id, json.cssStyles);
    control.title = json.title;
    control.parentId = json.parentId;
    control.lockedChildren = json.lockedChildren;
    json.actions && control.actions.replace(json.actions.map(actions => observable(actions)));
    json.meta && (control.meta = json.meta);
    json.type === ControlEnum.Screen && (control as IScreen).setScreenProps(json as IScreen);
    control.mergeStyles(new Map(json.cssStyles));
    if(json.classes) {
      const keys = Array.from(control.cssStyles.keys());
      const classes = json.classes.filter(clazz => keys.includes(clazz));
      control.classes.replace(classes);
    }
    if (control.cssStyles.size > 1 && !isMenu) {
      Array.from(control.cssStyles.keys())
        .filter(k => k !== MAIN_CSS_STYLE).forEach(k => this.addClass(control.id, k));
    }
    return control;
  }

  @action
  static addClass(id: string, className: string) {
    const clazz = `${id}/${className}`;
    !this.classes.includes(clazz) && this.classes.push(clazz);
  }

  @action
  static removeClass(id: string, className: string) {
    const clazz = `${id}/${className}`;
    this.classes.includes(clazz) && this.classes.splice(this.classes.indexOf(clazz), 1);
  }

  @action
  static renameClass(id: string, oldClassName: string, newClassName: string) {
    const oldClass = `${id}/${oldClassName}`;
    const newClass = `${id}/${newClassName}`;
    this.classes.splice(this.classes.indexOf(oldClass), 1, newClass);
  }

  @action
  static clearClasses() {
    const classes = this.classes.filter(clazz => {
      const classPair = clazz.split('/');
      return this.has(classPair[0]);
    });
    this.classes.replace(classes);
  }

  static clear() {
    this.controls = [];
    this.classes.replace([]);
    CSSProperty.clear();
    ColorsStore.clear();
  }

  static create(instance: ModelCtor, control: IControl, isMenu?: boolean) {
    return this.getOrCreate(instance, control, isMenu);
  }

  static clone(instance: ModelCtor, control: IControl) {
    return this.fromJSON(instance, control);
  }
}

ControlStore.history = new EditorHistory(ControlStore as ControlStatic);

export default ControlStore;
