import IStoreContent from 'interfaces/IStoreContent';
import ITransitStyle from 'interfaces/ITransitSyle';
import { TextMetaEnum } from 'enums/TextMetaEnum';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';
import { ControlEnum } from 'enums/ControlEnum';
import { BASE_COMP, TEXT_BASE_COMP } from './Constants';

class StoreContent implements IStoreContent {
  type: ControlEnum;
  path: string[];
  id: string;
  screenId: string;
  styleId: string;
  classes: string[];
  placeIndex: number[];
  action?: string[][];
  isObservable: boolean;
  title: string;
  text?: string;
  isTextChildren: boolean;
  transitStyles?: ITransitStyle[];
  children: IStoreContent[] = [];
  hash: string;
  meta: ScreenMetaEnum | TextMetaEnum;

  get hasAction() {
    return this.action !== undefined && this.action.length > 0;
  }

  get toJSON() {
    return {
      id: this.id,
      screenId: this.screenId,
      title: this.title,
      path: this.path,
      classes: this.classes,
      styleId: this.styleId,
      isAllChildrenAreText: this.isTextChildren,
      transitStyles: this.transitStyles,
      action: this.action,
      text: this.text,
      placeIndex: this.placeIndex,
    }
  }

  constructor(
    type: ControlEnum,
    id: string,
    screenId: string,
    path: string[],
    classes: string[],
    styleId: string,
    placeIndex: number[],
    title: string,
    hash: string,
    isTextChildren: boolean,
    isObservable: boolean,
    meta: ScreenMetaEnum | TextMetaEnum,
    transitStyles?: ITransitStyle[],
    action?: string[][],
    text?: string
  ) {
    this.type = type;
    this.id = id;
    this.screenId = screenId;
    this.path = path;
    action && action.length > 0 && (this.action = action);
    this.text = text;
    this.classes = classes;
    this.styleId = styleId;
    this.isTextChildren = isTextChildren;
    this.placeIndex = placeIndex;
    this.hash = hash;
    this.isObservable = isObservable;
    this.meta = meta;
    this.title = title;
    this.transitStyles = transitStyles;
  }

  add(child: IStoreContent) {
    this.children.push(child);
  }

  toString(nameSpace: string): string {

    let component = this.type === ControlEnum.Grid ? BASE_COMP : TEXT_BASE_COMP;
    component = this.isObservable ? `observer(${component})` : component;
    const title = this.title.replace(/(\r\n|\n|\r)/gm, ' ');
    let content = '{\n';
    content += `    id: "${this.id}",\n`;
    content += `    title: "${title}",\n`;
    content += `    path: ${JSON.stringify(this.path)},\n`;
    content += `    classes: ${JSON.stringify(this.classes)},\n`;
    content += `    styleId: "${this.styleId}",\n`;
    content += `    isTextChildren: ${this.isTextChildren},\n`;
    content += `    transitStyles: ${this.transitStyles ? '[' + this.transitStyles.map(e => e.toString()) + ']' : undefined},\n`;
    content += `    action: ${JSON.stringify(this.action)},\n`;
    content += `    text: "${title}",\n`;
    content += `    meta: "${this.meta}",\n`;
    content += `    placeIndex: ${JSON.stringify(this.placeIndex)},\n`;
    content += `    component: ${component},\n`;
    content += `    styles: style${nameSpace}\n`
    content += '  }';
    return content;
  }

}

export default StoreContent;
