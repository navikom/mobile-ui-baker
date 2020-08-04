import { action, computed, IObservableArray, observable, runInAction } from 'mobx';
import { FigmaTypeEnum, IFigmaNode } from './IFigmaNode';
import IControl from 'interfaces/IControl';
import TextStore from 'models/Control/TextStore';
import GridStore from 'models/Control/GridStore';
import { CSS_SET_VALUE, CSS_SWITCH_ENABLED } from 'models/Control/CSSProperty';
import React from 'react';
import { MAIN_CSS_STYLE } from 'models/Control/ControlStore';
import { ACTION_NAVIGATE_TO, MODE_DEVELOPMENT } from 'models/Constants';
import { IFigmaConverter } from './IFigmaConverter';
import IMobileUIView from 'interfaces/IMobileUIView';
import IProject from 'interfaces/IProject';
import ItemStyleFit from './ItemStyleFit';
import { ErrorHandler } from 'utils/ErrorHandler';
import ZipGenerator from './ZipGenerator';
import FigmaSource from './FigmaSource';
import EditorDictionary from 'views/Editor/store/EditorDictionary';
import ScreenStore from '../../../models/Control/ScreenStore';

type ColorType = { r: number; g: number; b: number; a: number };

const colorFromRGBA = (color: ColorType, opacity = 1) =>
  `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${opacity * color.a})`;

const applyProperty = (control: IControl, prop: keyof React.CSSProperties, value: string | number, unit?: string) => {
  control.applyPropertyMethod(MAIN_CSS_STYLE, CSS_SWITCH_ENABLED, prop, true);
  control.applyPropertyMethod(MAIN_CSS_STYLE, CSS_SET_VALUE, prop, value);
  if (unit) {
    control.cssProperty(MAIN_CSS_STYLE, prop)!.setUnit(unit);
  }
}

class ConvertService implements IFigmaConverter {
  static URL = 'https://api.figma.com/v1';
  static FILES = 'files';
  static IMAGES = 'images';
  store: IMobileUIView;
  accessKey: string;
  fileKey: string;
  errors: string[] = [];
  images: { [key: string]: string } = {};
  screens: IControl[] = [];
  isSvgFetching = false;
  isAssetFetching = false;
  controlsWithSvg: IControl[] = [];
  controlsWithImages: IControl[] = [];
  name = '';
  zipGenerator: ZipGenerator;
  tryings: {[key: string]: number} = {};
  @observable generated = false;
  @observable finished = false;
  @observable fetchItems: string[] = [];
  @observable assetsList: FigmaSource[] = [];
  @observable loadFullNumber = 0;
  @observable svgQueue: IFigmaNode[] = [];

  @computed get progress(): number {
    if (!this.loadFullNumber) {
      return 0;
    }
    let sources;
    if(this.store.fetchAssetsEnabled) {
      sources = [...this.assetsList, ...this.svgQueue];
    } else {
      sources = this.svgQueue;
    }

    const l = this.loadFullNumber - sources.length;
    return Math.round(l / this.loadFullNumber * 100);
  }

  get screensList() {
    return this.screens.map(e => e.toJSON) as IControl[];
  }

  constructor(store: IMobileUIView, accessKey: string, fileKey: string) {
    this.store = store;
    this.accessKey = accessKey;
    this.fileKey = fileKey;
    this.zipGenerator = new ZipGenerator();
  }

  @action setFullNumber() {
    this.loadFullNumber = this.svgQueue.length * 2;
  }

  @action addAssetsItems(isSVG: boolean, paths: string[]) {
    let l = paths.length;
    while (l--) {
      this.assetsList.push(new FigmaSource(this, isSVG, paths[l]));
    }
  }

  @action getFromAssetsList() {
    return this.assetsList.shift();
  }

  convert() {
    this.fetchFile();
    return this;
  }

  traverseChildren(children: IFigmaNode[]) {
    const components: IFigmaNode[] = [];
    const check = (c: IFigmaNode) => {
      if (c.type === FigmaTypeEnum.FRAME) {
        components.push(c);
      } else if (c.children) {
        c.children.forEach(check);
      }
    }
    children.forEach(check);
    return components;
  }

  fontStyle(control: IControl, item: IFigmaNode) {
    (Object.keys(item.style!) as (keyof React.CSSProperties)[])
      .forEach(key => {
        const property = control.cssProperty(MAIN_CSS_STYLE, key);
        if (property && (property.valueType !== 'select' || property.options?.includes(item.style![key]!.toString()))) {
          applyProperty(control, key, item.style![key]!.toString());
        }
        if (key === ('lineHeightPx' as 'fontSize')) {
          applyProperty(control, 'lineHeight', item.style!['lineHeightPx' as 'fontSize'] as string);
        }
        if (key === ('textAlignHorizontal' as 'fontSize')) {
          applyProperty(control, 'textAlign', (item.style!['textAlignHorizontal' as 'fontSize'] as string).toLowerCase());
        }
        if (key === ('textCase' as 'fontSize')) {
          if (item.style!['textCase' as 'fontSize'] === 'UPPER') {
            control.changeTitle(item.characters!.toUpperCase(), true);
          }
        }
      });
  }

  isSVG(item: IFigmaNode) {
    if (item.fills.length && item.fills[0].type === 'IMAGE') {
      return false;
    }

    const vectorTypes = [FigmaTypeEnum.VECTOR, FigmaTypeEnum.BOOLEAN_OPERATION,
      FigmaTypeEnum.LINE, FigmaTypeEnum.STAR, FigmaTypeEnum.ELLIPSE, FigmaTypeEnum.REGULAR_POLYGON];
    if (vectorTypes.includes(item.type)) {
      return true;
    }

    return item.children && item.children.length &&
      item.children
        .map(c => [...vectorTypes, FigmaTypeEnum.RECTANGLE].includes(c.type) && !(c.fills && c.fills.length && c.fills[0].imageRef))
        .filter(e => e)
        .length === item.children.length;
  }

  componentProperties(control: IControl, item: IFigmaNode, fill?: ColorType, stroke?: ColorType, fillOpacity?: number, fillVisible?: boolean) {
    if (item.backgroundColor && item.backgroundColor.a > 0) {
      applyProperty(control, 'backgroundColor', colorFromRGBA(item.backgroundColor));
    }

    if (fill && (fillVisible === undefined || fillVisible) && fill.a > 0) {
      applyProperty(control, 'backgroundColor', colorFromRGBA(fill, fillOpacity));
    }

    if (stroke) {
      applyProperty(control, 'border', `${item.strokeWeight}px solid ${colorFromRGBA(stroke)}`);
    }

    if (item.cornerRadius) {
      applyProperty(control, 'borderRadius', item.cornerRadius);
    }

    if (item.fills.length && item.fills[0].imageRef) {
      applyProperty(control, 'backgroundImage', item.fills[0].imageRef);
      applyProperty(control, 'backgroundSize', '100% 100%');
      applyProperty(control, 'backgroundRepeat', 'no-repeat');
      this.controlsWithImages.push(control);
    }
    if (item.locked) {
      control.lockedChildren = true;
    }

    if (item.type === FigmaTypeEnum.ELLIPSE) {
      applyProperty(control, 'borderRadius', item.absoluteBoundingBox.width);
    }

    if (item.effects && item.effects.length > 0) {
      if (item.effects[0].type === 'DROP_SHADOW' && item.effects[0].visible) {
        const e = item.effects[0];
        applyProperty(control,
          'boxShadow',
          `${e.offset.x}px ${e.offset.y}px ${e.radius}px ${colorFromRGBA(e.color)}`
        );
      }
    }
  }

  retrieveColor(item: IFigmaNode) {
    let opacity: number | undefined = item.opacity;
    let fill: ColorType = { r: 0, g: 0, b: 0, a: 0 };
    let stroke;
    let fillOpacity;
    let fillVisible = true;
    if (item.fills.length) {
      fillVisible = item.fills[0].visible;
      if (item.fills[0].gradientStops) {
        (Object.keys(fill) as (keyof ColorType)[]).forEach(key => {
          fill[key] = (item.fills[0].gradientStops![0].color![key] + item.fills[0].gradientStops![1].color![key]) / 2;
        })

      } else if (item.fills[0].color) {
        fill = item.fills[0].color as ColorType;
        fillOpacity = item.fills[0].opacity;
      }
    }
    if (item.strokes && item.strokes.length) {
      stroke = item.strokes[0].color as ColorType;
    }

    opacity = opacity !== undefined ? Math.round(opacity * 100) / 100 : undefined;
    return { opacity, stroke, fill, fillVisible, fillOpacity };
  }

  retrieveStyle(control: IControl, item: IFigmaNode, type: FigmaTypeEnum) {
    const { width, height } = item.absoluteBoundingBox;

    const { opacity, fillVisible, fillOpacity } = this.retrieveColor(item);
    let { stroke, fill } = this.retrieveColor(item);
    opacity !== undefined && applyProperty(control, 'opacity', opacity);

    applyProperty(control, 'position', 'absolute');

    if (type === FigmaTypeEnum.VECTOR) {
      if (item.children && item.children.length) {
        const childFill = this.retrieveColor(item.children[0]);
        fill = childFill.fill;
        stroke = childFill.stroke;
      }
      const col = colorFromRGBA(stroke || fill, fillOpacity);
      applyProperty(control, 'backgroundColor', col);
      applyProperty(control, 'maskRepeat', 'round');
      applyProperty(control, 'width', width);
      applyProperty(control, 'height', height);
    } else if (type === FigmaTypeEnum.TEXT) {
      this.fontStyle(control, item);
      fill && applyProperty(control, 'color', colorFromRGBA(fill));
    } else {
      this.componentProperties(control, item, fill, stroke, fillOpacity, fillVisible);
    }
  }

  retrieveControls(children: IFigmaNode[], parentStyleFit: ItemStyleFit): IObservableArray<IControl> {
    let l = children.length, i = 0;
    const controls = [];
    while (l--) {
      const item = children[i++];
      if (item.visible !== undefined && !item.visible) {
        continue;
      }
      let control: IControl;
      let stylesFit;
      if (this.isSVG(item)) {
        control = new TextStore(item.id);
        control.changeTitle(item.name, true);
        this.retrieveStyle(control, item, FigmaTypeEnum.VECTOR);
        this.controlsWithSvg.push(control);
        this.svgQueue.push(item);
        this.fetchSVG();
      } else if (item.type === FigmaTypeEnum.TEXT) {
        control = new TextStore(item.id);
        control.changeTitle(item.characters!, true);
        this.retrieveStyle(control, item, FigmaTypeEnum.TEXT);
      } else {
        if (item.children) {
          control = new GridStore(item.id);
          this.retrieveStyle(control, item, FigmaTypeEnum.COMPONENT);
          stylesFit = new ItemStyleFit(item);
          this.retrieveControls(item.children, stylesFit).forEach(entry => control.addChild(entry));
          control.changeTitle(item.name, true);
        } else {
          control = new TextStore(item.id);
          this.retrieveStyle(control, item, FigmaTypeEnum.COMPONENT);
          if (item.type !== FigmaTypeEnum.RECTANGLE) {
            control.changeTitle(item.name, true);
          } else {
            control.changeTitle('', true);
          }
        }
      }

      if (item.transitionNodeID) {
        if (control.children.length) {
          control.setAction(0, [ACTION_NAVIGATE_TO, item.transitionNodeID]);
        } else {
          const button = GridStore.create();
          button.changeTitle('Button', true);
          button.setAction(0, [ACTION_NAVIGATE_TO, item.transitionNodeID]);
          button.addChild(control);
          control = button;
        }
      }

      const styles = parentStyleFit.getRelativeBox(item);
      styles.forEach(style => applyProperty(control, style.key as 'font', style.value, style.unit));
      const position = control.cssProperty(MAIN_CSS_STYLE, 'position');
      if (stylesFit && stylesFit.isChildrenAbsolute && (!position!.enabled || position!.value !== 'absolute')) {
        applyProperty(control, 'position', 'relative');
      }
      if (stylesFit && parentStyleFit.source.isScreen && stylesFit.isScrollHorizontal) {
        const { width } = item.absoluteBoundingBox;
        const { container, wrapper } = this.wrapContentAxisX(width);
        wrapper.addChild(control);
        controls.push(container);
      } else {
        controls.push(control);
      }

    }
    return controls as unknown as IObservableArray<IControl>;
  }

  retrieveScreens(children: IFigmaNode[]) {
    let l = children.length, i = 0;
    while (l--) {
      const item = children[i++];
      item.isScreen = true;
      const { height } = item.absoluteBoundingBox;
      const screen = new ScreenStore(item.id);
      if (item.backgroundColor && item.backgroundColor.a > 0) {
        screen.setStatusBarExtended(true, true);
        screen.setBackground(colorFromRGBA(item.backgroundColor));
      }

      screen.changeTitle(item.name, true);
      const c = this.retrieveControls(item.children, new ItemStyleFit(item)) as IObservableArray<IControl>;
      const last = c[c.length - 1];
      if (item.children.length && item.children[item.children.length - 1].absoluteBoundingBox.height === height) {
        applyProperty(last, 'zIndex', -1);
      }
      if (height > 700) {
        const { container, wrapper } = this.wrapContentAxisY(height);

        wrapper.children = c;
        screen.addChild(container);
      } else {
        screen.children = c;
      }
      this.screens.push(screen);
    }
    this.setFullNumber();
  }

  getScrollComponents() {
    const container = GridStore.create();
    applyProperty(container, 'position', 'relative');
    container.changeTitle('Container', true);
    const wrapper = GridStore.create();
    wrapper.changeTitle('ScrollWrapper', true);
    applyProperty(wrapper, 'position', 'relative');
    container.addChild(wrapper);
    return { container, wrapper };
  }

  wrapContentAxisY(height: number) {
    const { container, wrapper } = this.getScrollComponents();
    applyProperty(container, 'height', 100, '%');
    applyProperty(container, 'overflowX', 'hidden');
    applyProperty(container, 'overflowY', 'scroll');
    applyProperty(wrapper, 'height', height);
    return { container, wrapper };
  }

  wrapContentAxisX(width: number) {
    const { container, wrapper } = this.getScrollComponents();
    applyProperty(container, 'width', 100, '%');
    applyProperty(container, 'overflowX', 'scroll');
    applyProperty(container, 'overflowY', 'hidden');
    applyProperty(wrapper, 'width', width);
    return { container, wrapper };
  }

  async fetchFile() {
    try {
      const response = await fetch(`${ConvertService.URL}/${ConvertService.FILES}/${this.fileKey}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-figma-token': this.accessKey,
        },
      });
      const json = await response.json();
      if (json.err) {
        throw new ErrorHandler(json.err);
      }
      this.name = json.name;
      const children = this.traverseChildren(json.document.children);
      this.retrieveScreens(children);
      await this.fetchImages();
      this.fetchAssets();
    } catch (err) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('File error', err);
      this.store.setError!(this.store.dictionary!.defValue(EditorDictionary.keys.downloadFromFigmaError, err.message));
      this.store.setTimeOut!(() => this.store.setError!(null), 5000);
      this.store.closeConverter!();
    }
  }

  async fetchImages() {
    try {
      const response = await fetch(`${ConvertService.URL}/${ConvertService.FILES}/${this.fileKey}/images`, {
        headers: {
          'Content-Type': 'application/json',
          'x-figma-token': this.accessKey,
        },
      });
      const json = await response.json();
      if (!json.error) {
        Object.assign(this.images, json.meta.images);
        runInAction(() => {
          this.loadFullNumber = this.loadFullNumber + Object.keys(json.meta.images).length;
        });
        this.addAssetsItems(false, Object.values(json.meta.images));
      }
    } catch (err) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Images error', err.message);
      this.store.setError!(this.store.dictionary!.defValue(EditorDictionary.keys.downloadFromFigmaError, err.message));
      this.store.setTimeOut!(() => this.store.setError!(null), 5000);
    }
  }

  addAssets() {
    this.controlsWithSvg.forEach(control => {
      applyProperty(control, 'maskImage', this.images[control.id]);
    });
    this.controlsWithImages.forEach(control => {
      const property = control.cssProperty(MAIN_CSS_STYLE, 'backgroundImage');
      if (!(property!.value as string).includes('https://s3-alpha-sig.figma.com')) {
        applyProperty(control, 'backgroundImage', this.images[property!.value]);
      }
    });

    if (this.errors.length) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Errors', this.errors)
    }
    this.store.project.update({ title: this.name } as IProject);
    if(!this.store.fetchAssetsEnabled) {
      this.setFinished();
    }
  }

  async fetchSVG() {
    if (this.isSvgFetching) {
      return;
    }
    this.isSvgFetching = true;
    const item = this.svgQueue.shift();
    if (!item) {
      this.addAssets();
      return;
    }
    try {
      const url = new URL(`${ConvertService.URL}/${ConvertService.IMAGES}/${this.fileKey}`);
      url.searchParams.append('ids', item.id);
      url.searchParams.append('format', 'svg');
      const response = await fetch(url as unknown as string, {
        headers: {
          'Content-Type': 'application/json',
          'x-figma-token': this.accessKey,
        },
      });
      const json = await response.json();
      Object.assign(this.images, json.images);
      this.addAssetsItems(true, Object.values(json.images));
    } catch (err) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('SVG error', err.message);
      this.store.setError!(this.store.dictionary!.defValue(EditorDictionary.keys.downloadFromFigma, err.message));
      this.store.setTimeOut!(() => this.store.setError!(null), 5000);
    }
    this.isSvgFetching = false;
    this.fetchSVG();
  }

  async fetchAssets() {
    if(!this.store.fetchAssetsEnabled) {
      return;
    }
    if (!this.assetsList.length) {
      this.finishLoadAssets();
      return;
    }
    if (this.isAssetFetching) {
      return;
    }
    this.isAssetFetching = true;
    const item = this.getFromAssetsList();
    try {
      await item!.load();
    } catch (err) {
      this.isTryingReached(item!);
    }
    this.isAssetFetching = false;
    this.fetchAssets();
  }

  isTryingReached(item: FigmaSource) {
    if(this.tryings[item.path] === undefined) {
      this.tryings[item.path] = 3;
    }
    if(this.tryings[item.path] > 0) {
      this.addAssetsItems(item!.isSvg, [item!.path]);
      this.tryings[item.path]--;
    } else {
      this.addToErrors(`Unable to fetch file (url expires in 10 days): (${item!.path})`);
    }
  }

  @action finishLoadAssets() {
    this.setFinished();
    if (this.errors.length) {
      this.store.setContentConverterDialog!(this.errors);
    }
    this.zipGenerator.generateZip(this.name);
    this.clearErrors();
  }

  @action setFinished() {
    this.finished = true;
  }

  addToErrors(error: string) {
    this.errors.push(error);
  }

  clearErrors() {
    this.errors = [];
  }
}

export default ConvertService;
