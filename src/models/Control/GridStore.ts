import { v4 as uuidv4 } from 'uuid';
import { action } from 'mobx';
import IControl, { IGrid } from 'interfaces/IControl';
import { ControlEnum } from 'enums/ControlEnum';
import CreateControl from 'models/Control/ControlStores';
import CSSProperty from 'models/Control/CSSProperty';
import { CSS_CAT_ALIGN_CHILDREN, CSS_VALUE_SELECT } from 'models/Constants';
import ControlStore, { MAIN_CSS_STYLE } from 'models/Control/ControlStore';
import ICSSProperty from 'interfaces/ICSSProperty';

const styles = [
  new CSSProperty('display', 'flex', 'flex', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['inherit', 'flex', 'block', 'inline'])
    .setDescription(['displayDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/display']),
  new CSSProperty('justifyContent', 'center', 'center', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['inherit', 'center', 'flex-start', 'flex-end', 'space-around', 'space-between'])
    .setShowWhen(['display', 'flex']),
  new CSSProperty('alignItems', 'center', 'center', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['inherit', 'center', 'flex-start', 'flex-end']).setShowWhen(['display', 'flex']),
  new CSSProperty('flexDirection', 'row', 'row', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['inherit', 'initial', 'unset', 'row', 'row-reverse', 'column', 'column-reverse'])
    .setShowWhen(['display', 'flex'])
    .setDescription(['flexDirectionDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction']),
  new CSSProperty('flexWrap', 'nowrap', 'nowrap', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['nowrap', 'wrap', 'wrap-reverse']).setShowWhen(['display', 'flex'])
    .setDescription(['flexWrapDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap']),
  new CSSProperty('overflow', 'visible', 'visible', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['visible', 'hidden', 'scroll']).makeExpandable()
    .setDescription(['overflowDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/overflow']),
  new CSSProperty('overflowX', 'visible', 'visible', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['visible', 'hidden', 'scroll']).setShowWhen(['overflow', 'expanded']),
  new CSSProperty('overflowY', 'visible', 'visible', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['visible', 'hidden', 'scroll']).setShowWhen(['overflow', 'expanded']),
  new CSSProperty('whiteSpace', 'normal', 'normal', CSS_CAT_ALIGN_CHILDREN, false, CSS_VALUE_SELECT)
    .setOptions(['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line'])
    .setDescription(['whiteSpaceDescription', 'https://developer.mozilla.org/en-US/docs/Web/CSS/white-space'])
];

class GridStore extends ControlStore implements IGrid {

  constructor(id: string, style?: Map<string, ICSSProperty[]>) {
    super(ControlEnum.Grid, id, 'Grid', true);
    const keys = style ? Array.from(new Map(style).keys()) : [MAIN_CSS_STYLE];
    this.mergeStyles(new Map(keys.map((key: string) => [key, styles.map(style => style.clone())])));
  }

  @action clone(): IGrid {
    const clone = CreateControl(ControlEnum.Grid) as IGrid;
    this.children.forEach(child => clone.addChild(child.clone() as IControl));
    super.cloneProps(clone);
    return clone;
  }

  static create() {
    return new GridStore(uuidv4());
  }
}

export default GridStore;
