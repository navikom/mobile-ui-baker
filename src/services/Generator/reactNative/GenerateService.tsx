import { action, observable, runInAction, when } from 'mobx';

import IMobileUIView from 'interfaces/IMobileUIView';
import IControl from 'interfaces/IControl';
import IGenerateComponent from 'interfaces/IGenerateComponent';
import GenerateComponent from './GenerateComponent';
import { uniqueNameDefinition } from 'utils/string';
import {
  APP_ROOT,
  ASSETS_FOLDER,
  COMPONENTS_FOLDER,
  NAVIGATE_TO,
  SCREENS_FOLDER,
  SRC_FOLDER,
  SVG_FOLDER,
} from '../Constants';
import IStoreContent from 'interfaces/IStoreContent';
import StoreContent from '../StoreContent';
import ITransitStyle from 'interfaces/ITransitSyle';
import GradientParser, { correctGradients } from 'utils/parseGradient';
import { reactNativeImage } from './ReactNativeStyleDictionary';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';
import ZipGenerator from './ZipGenerator';
import ICSSProperty from 'interfaces/ICSSProperty';
import IGenerateService from 'interfaces/IGenerateService';
import { TextMetaEnum } from 'enums/TextMetaEnum';
import TransitStyle from '../TransitStyle';
import { ControlEnum } from '../../../enums/ControlEnum';

type ObjectType = { [key: string]: string | number | boolean | undefined | null };

class GenerateService implements IGenerateService {
  store: IMobileUIView;
  components: Map<string, IGenerateComponent> = new Map<string, IGenerateComponent>();
  tab: Map<string, string[]> = new Map<string, string[]>();
  leftDrawer: Map<string, string[]> = new Map<string, string[]>();
  rightDrawer: Map<string, string[]> = new Map<string, string[]>();
  nameSpaces: string[] = [];
  storeContent: Map<string, IStoreContent[]> = new Map<string, IStoreContent[]>();
  transitionErrors: string[] = [];
  screenNames: { id: string; title: string }[] = [];
  zipGenerator: ZipGenerator;
  @observable generated = false;
  @observable finished = false;
  @observable fetchItems: string[] = [];

  get leftDrawerWidth() {
    return Array.from(this.leftDrawer.values())[0][1];
  }

  get rightDrawerWidth() {
    return Array.from(this.rightDrawer.values())[0][1];
  }

  get tabScreens() {
    const inDrawer: string[] = [];
    const outOfDrawer: string[] = [];
    this.tab.forEach(((value, screenId) => {
      if (this.leftDrawer.has(screenId) || this.rightDrawer.has(screenId)) {
        inDrawer.push(screenId);
      } else {
        outOfDrawer.push(screenId);
      }
    }));
    return [inDrawer, outOfDrawer];
  }

  get bareScreens() {
    const keys = [
      ...Array.from(this.leftDrawer.keys()),
      ...Array.from(this.rightDrawer.keys()),
      ...Array.from(this.tab.keys())];
    return this.screenNames.filter(screen => !keys.includes(screen.id));
  }

  constructor(store: IMobileUIView) {
    this.store = store;
    this.zipGenerator = new ZipGenerator(this);
    when(() => this.generated, () => {
      when(() => this.fetchItems.length === 0, () => this.generateFinish());
    });
  }

  getComponentByControlId(id: string) {
    const components = Array.from(this.components);
    let l = components.length;
    while (l--) {
      const cmp = components[l][1];
      if (cmp.controls.find(e => e.id === id)) {
        return cmp;
      }
    }
    return null;
  }

  transitStyle(control: IControl) {
    const styles = control.cssStylesJSON;
    const transitStyles: ITransitStyle[] = [];
    let widthValue = 0;
    let unit;
    let l = styles.length, i = 0;
    while (l--) {
      const style = styles[i++];
      const background = (style[1] as unknown as ObjectType[]).find(e => e.key === 'background');
      const backgroundImage = (style[1] as unknown as ObjectType[]).find(e => e.key === 'backgroundImage');
      const mask = (style[1] as unknown as ObjectType[]).find(e => e.key === 'mask');
      const maskImage = (style[1] as unknown as ObjectType[]).find(e => e.key === 'maskImage');
      const overflow = (style[1] as unknown as ObjectType[]).find(e => e.key === 'overflow');
      const overflowX = (style[1] as unknown as ObjectType[]).find(e => e.key === 'overflowX');
      const overflowY = (style[1] as unknown as ObjectType[]).find(e => e.key === 'overflowY');
      const alignItems = (style[1] as unknown as ObjectType[]).find(e => e.key === 'alignItems');
      const justifyContent = (style[1] as unknown as ObjectType[]).find(e => e.key === 'justifyContent');
      const width = control.cssProperty(style[0] as string, 'width');
      const height = control.cssProperty(style[0] as string, 'height');

      const transitStyle = new TransitStyle(style[0] as string, control.activeClass(style[0] as string), false);

      if ((overflow && overflow.enabled && overflow.value !== 'hidden') ||
        (overflowY && overflowY.enabled && overflowY.value !== 'hidden')) {
        transitStyle.scroll = { horizontal: false, contentContainerStyle: {} };
        if (alignItems && alignItems.enabled) {
          transitStyle.scroll.contentContainerStyle.alignItems = alignItems.value as string;
        }
        if (justifyContent && justifyContent.enabled) {
          transitStyle.scroll.contentContainerStyle.justifyContent = justifyContent.value as string;
        }
      }

      if (overflowX && overflowX.enabled && overflowX.value !== 'hidden') {
        transitStyle.scroll = { horizontal: true, contentContainerStyle: {} };
        if (alignItems && alignItems.enabled) {
          transitStyle.scroll.contentContainerStyle.alignItems = alignItems.value as string;
        }
        if (justifyContent && justifyContent.enabled) {
          transitStyle.scroll.contentContainerStyle.justifyContent = justifyContent.value as string;
        }
      }

      if (background && background.enabled) {
        const match = (background.value as string).match(/url\((\S+)\)/i);
        if (match) {
          const src = match[1].replace(/"|'/g, '');
          if (src!.includes('.svg')) {
            this.addToFetch(src, transitStyle);
            transitStyle.isSvg = true;
          } else {
            transitStyle.src = src;
          }
        } else {
          try {
            transitStyle.gradient = GradientParser.parse()(background.value);
          } catch (err) {
            this.addToTransitionErrors(
              'Control #' + control.id + ' Gradient parse error, correct gradient expressions: \n' + correctGradients.join('\n'));
          }
        }
      }
      if (mask && mask.enabled) {
        const match = (mask.value as string).match(/url\((\S+)\)/i);
        if (match) {
          const src = match[1].replace(/"|'/g, '');
          if (src!.includes('.svg')) {
            this.addToFetch(src, transitStyle);
            transitStyle.isSvg = true;
          } else {
            transitStyle.src = src;
          }
        }
      }
      if (backgroundImage && backgroundImage.enabled) {
        const src = backgroundImage.value as string;
        if (src!.includes('.svg')) {
          this.addToFetch(src, transitStyle);
          transitStyle.isSvg = true;
          transitStyle.style = reactNativeImage.size(width as ICSSProperty, height as ICSSProperty);

        } else {
          transitStyle.src = src;
          const backgroundSize = control.cssProperty(style[0] as string, 'backgroundSize');
          const backgroundPosition = control.cssProperty(style[0] as string, 'backgroundPosition');
          const backgroundRepeat = control.cssProperty(style[0] as string, 'backgroundRepeat');
          transitStyle.style = reactNativeImage.imageMode(backgroundRepeat, backgroundSize, backgroundPosition);
        }
      }
      if (maskImage && maskImage.enabled) {
        const src = maskImage.value as string;
        if (src!.includes('.svg')) {
          this.addToFetch(src, transitStyle);
          const backgroundColor = control.cssProperty(style[0] as string, 'backgroundColor');
          transitStyle.style = reactNativeImage.svgMode(width, height, backgroundColor);
          transitStyle.isSvg = true;
        }
      }
      if (width) {
        if (width.value > widthValue) {
          widthValue = width.value as number;
          unit = width.unit;
        }
      }
      (transitStyle.src || transitStyle.gradient || transitStyle.scroll) && transitStyles.push(transitStyle);
    }

    return [transitStyles.length ? transitStyles : undefined, unit === '%' ? widthValue + '%' : widthValue];
  }

  @action addToFetch(src: string, transitStyle: ITransitStyle) {
    this.fetchItems.push(src);
    let name = src!.split('/').pop()!
      .replace('.svg', '');
    name = name.replace(/-|\.|:/g, '_');
    transitStyle.src = `${APP_ROOT}/${ASSETS_FOLDER}/${SVG_FOLDER}/${name}`;
    this.fetchSource(src, name as string);
  }

  async fetchSource(src: string, name: string) {
    try {
      const response = await fetch(src);
      const text = await response.text();
      const svgWithNoStroke = text.replace(/stroke="(.*?)"/g, '');
      this.zipGenerator.svg2zip(name as string, svgWithNoStroke);
      this.deleteFetchItem(src);
    } catch (e) {
      this.deleteFetchItem(src);
      this.addToTransitionErrors('Svg source "' + src + '" fetch error: ' + e.message);
    }
  }

  @action deleteFetchItem(src: string) {
    this.fetchItems.splice(this.fetchItems.indexOf(src), 1);
  }

  isLeftDrawerChild(control: IControl) {
    return !!Array.from(this.leftDrawer.values()).find(ids => control.path.includes(ids[0]));
  }

  isRightDrawerChild(control: IControl) {
    return !!Array.from(this.rightDrawer.values()).find(ids => control.path.includes(ids[0]));
  }

  isTabChild(control: IControl) {
    return !!Array.from(this.tab.values()).find(ids => control.path.includes(ids[0]));
  }

  setChecksums(): { [key: string]: IStoreContent[] } {
    const childrenMap: { [key: string]: IStoreContent[] } = {};
    let l = this.store.screens.length, i = 0;
    while (l--) {
      const screen = this.store.screens[i];
      screen.setChecksum(0, [], i, async (depth: number, index: number, control: IControl) => {
        if (!this.storeContent.has(screen.id)) {
          this.storeContent.set(screen.id, []);
        }
        const actions = control.actions.toJS().sort((a, b) => {
          if (b[0] === NAVIGATE_TO) return -1;
          return 1;
        });
        const [transitStyles, width] = this.transitStyle(control);
        let textChildren = 0;
        control.children.forEach((e, i) => {
          if (e.type === ControlEnum.Text && !e.hasImage) {
            textChildren++;
          }
        });

        const store =
          new StoreContent(
            control.id as string,
            screen.id as string,
            control.path as string[],
            control.classes,
            control.hashChildrenWithStyle as string,
            [index],
            control.title,
            control.hashChildren as string,
            control.children.length > 1 && textChildren === control.children.length,
            control.cssStyles.size > 1,
            control.meta,
            transitStyles as ITransitStyle[],
            actions,
            control.title);
        const pathKey = control.path.join('/');
        if (!childrenMap[pathKey]) {
          childrenMap[pathKey] = [];
        }
        childrenMap[pathKey].push(store);

        if ([ScreenMetaEnum.COMPONENT, TextMetaEnum.INPUT, TextMetaEnum.TEXT_AREA].includes(control.meta)) {
          if (this.isLeftDrawerChild(control)) {
            this.storeContent.get(this.leftDrawer.get(screen.id)![0])!.push(store);
          } else if (this.isRightDrawerChild(control)) {
            this.storeContent.get(this.rightDrawer.get(screen.id)![0])!.push(store);
          } else if (this.isTabChild(control)) {
            this.storeContent.get(this.tab.get(screen.id)![0])!.push(store);
          } else {
            this.storeContent.get(screen.id)!.push(store);
          }

        } else if (control.meta === ScreenMetaEnum.LEFT_DRAWER) {
          this.leftDrawer.set(screen.id, [control.id, width as string]);
          this.storeContent.set(control.id, []);
          this.storeContent.get(control.id)!.push(store);
        } else if (control.meta === ScreenMetaEnum.RIGHT_DRAWER) {
          this.rightDrawer.set(screen.id, [control.id, width as string]);
          this.storeContent.set(control.id, []);
          this.storeContent.get(control.id)!.push(store);
        } else if (control.meta === ScreenMetaEnum.TABS) {
          this.tab.set(screen.id, [control.id, width as string]);
          this.storeContent.set(control.id, []);
          this.storeContent.get(control.id)!.push(store);
        }
      });
      i++;
    }
    return childrenMap;
  }

  generateRN() {
    const childrenMap = this.setChecksums();

    let traverse: (controls: IControl[]) => void;
    (traverse = (controls: IControl[]) => {

      controls.forEach(child => {
        const hash = child.hashChildren as string;
        if (!this.components.has(hash)) {
          this.components.set(hash, new GenerateComponent(this, this.components.size, hash));
        }
        this.components.get(hash)!.addControl(child);

        traverse(child.children);
      });

    })(this.store.screens);

    this.sortScreensStoreChildren(childrenMap);
    this.defineNames();
    this.components2zip();
    return this;
  }

  sortScreensStoreChildren(map: { [key: string]: IStoreContent[] }) {
    Object.keys(map).forEach(key => {
      const list = map[key];
      let l = list.length, i = 0, index = 0, prevHash = '';
      while (l--) {
        const item = list[i];
        if (prevHash === item.hash) {
          const prevItem = list[i - 1];
          if (!prevItem.placeIndex[1]) {
            prevItem.placeIndex.push(0);
          }
          item.placeIndex = [prevItem.placeIndex[0], prevItem.placeIndex[1] + 1];
          index = item.placeIndex[0] + 1;
        } else {
          item.placeIndex = [index];
          index++;
        }
        prevHash = item.hash;
        i++;
      }
    });
  }

  getScreenStore(screenId: string) {
    return this.storeContent.get(screenId) as IStoreContent[];
  }

  approveNameSpace = (nameSpace: string) => {
    const index = this.nameSpaces.indexOf(nameSpace);

    if (index > -1) {
      nameSpace = uniqueNameDefinition(this.nameSpaces, nameSpace, 1);
    }
    this.nameSpaces.push(nameSpace);

    return nameSpace;
  }

  defineNames() {
    this.components.forEach((cmp) => {
      cmp.generateNameSpace(this.approveNameSpace);
    });
  }

  components2zip() {
    const screenHashes: string[] = [];
    this.store.screens.forEach((screen: IControl) => {
      !screenHashes.includes(screen.hashChildren as string) && screenHashes.push(screen.hashChildren as string);
    });
    this.components.forEach((cmp, hash) => {
      if (screenHashes.includes(hash)) {
        cmp.controls.forEach((control) => {
          const title = this.approveNameSpace('Screen' + control.title.replace(/\s/g, ''));
          cmp.styles.delete(control.hashChildrenWithStyle as string);
          this.zipGenerator.screen2zip(cmp, title);
          this.zipGenerator.initState2zip(`${SRC_FOLDER}/${SCREENS_FOLDER}/${title}`, this.getScreenStore(control.id));
          this.screenNames.push({ id: control.id, title });
        });
      }
      this.zipGenerator.component2zip(cmp, COMPONENTS_FOLDER, cmp.nameSpace);
    });
    this.zipGenerator.generateRest();

    runInAction(() => {
      this.generated = true;
    })
  }

  @action setFinished() {
    this.finished = true;
  }

  generateFinish() {
    if (this.transitionErrors.length) {
      this.store.setContentGeneratorDialog!(this.transitionErrors);
    } else {
      this.generateZip();
    }
  }

  generateZip() {
    this.zipGenerator.generateZip();
    this.clearTransitionErrors();
  }

  addToTransitionErrors(error: string) {
    this.transitionErrors.push(error);
  }

  clearTransitionErrors() {
    this.transitionErrors = [];
  }
}

export default GenerateService;
