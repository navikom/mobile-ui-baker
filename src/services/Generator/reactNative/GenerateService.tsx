import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import IMobileUIView from 'interfaces/IMobileUIView';
import IControl from 'interfaces/IControl';
import IGenerateComponent from 'interfaces/IGenerateComponent';
import GenerateComponent from './GenerateComponent';
import { uniqueNameDefinition } from 'utils/string';
import {
  APP_ROOT,
  BASE_COMP,
  BREAK,
  CHILDREN,
  COMPONENT_ID,
  COMPONENTS_FOLDER,
  DISABLE_STYLE,
  ENABLE_STYLE,
  EXPORT_DEFAULT,
  FLAT_LIST_COMP,
  FUNCTION,
  IMAGE_BACKGROUND_COMP,
  IMAGE_COMP,
  IMPORT_REACT,
  INIT_STATE,
  LINEAR_GRADIENT_COMP,
  MODELS_FOLDER,
  NAVIGATE_TO,
  NAVIGATION_FOLDER,
  NAVIGATION_VARIABLE,
  PROPERTIES_VARIABLE,
  PROPERTY_MODEL,
  PROPS_VARIABLE,
  RETURN,
  STORE,
  SCREENS_FOLDER,
  SCREENS_LIST,
  SCROLL_VIEW_COMP,
  SRC_FOLDER,
  STORE_VARIABLE,
  STYLE_ID,
  STYLES,
  SVG_URI_COMP,
  TEXT_BASE_COMP,
  TEXT_COMP,
  TOGGLE_STYLE,
  TOUCHABLE_OPACITY_COMP,
  TRANSIT_STYLE_MODEL,
  VIEW_COMP, LEFT_DRAWER, STORE_BASE, RIGHT_DRAWER, TABS, NAV_COMPONENTS
} from '../Constants';
import { importFrom } from '../utils';
import { Mode } from 'enums/ModeEnum';
import IStoreContent from 'interfaces/IStoreContent';
import StoreContent from '../StoreContent';
import ITransitStyle from 'interfaces/ITransitSyle';
import GradientParser, { correctGradients } from 'utils/parseGradient';
import { reactNativeImage } from './ReactNativeStyleDictionary';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';

type ObjectType = { [key: string]: string | number | boolean | undefined | null };

const contentString = (content: string, imports: string[]) => {
  let str = importFrom(['observer'], 'mobx-react-lite') + ';\n';
  str += imports.map(e => importFrom(e, APP_ROOT + '/' + COMPONENTS_FOLDER + '/' + e + '/' + e) + ';').join('\n');
  str += '\n';
  str += content;
  return str
}

class GenerateService {
  store: IMobileUIView;
  components: Map<string, IGenerateComponent> = new Map<string, IGenerateComponent>();
  tab: Map<string, string> = new Map<string, string>();
  leftDrawer: Map<string, string> = new Map<string, string>();
  rightDrawer: Map<string, string> = new Map<string, string>();
  nameSpaces: string[] = [];
  storeContent: Map<string, IStoreContent[]> = new Map<string, IStoreContent[]>();
  transitionErrors: string[] = [];

  get tabScreens() {
    const inDrawer: string[] = [];
    const outOfDrawer: string[] = [];
    this.tab.forEach(((value, screenId) => {
      if(this.leftDrawer.has(screenId) || this.rightDrawer.has(screenId)) {
        inDrawer.push(screenId);
      } else {
        outOfDrawer.push(screenId);
      }
    }));
    return [inDrawer, outOfDrawer];
  }

  constructor(store: IMobileUIView) {
    this.store = store;
  }

  getComponentByControlId(id: string) {
    const components = Array.from(this.components);
    let l = components.length;
    while (l--) {
      const cmp = components[l][1];
      if(cmp.controls.find(e => e.id === id)) {
        return cmp;
      }
    }
    return null;
  }

  transitStyle(control: IControl) {
    const styles = control.cssStylesJSON;
    const transitStyles: ITransitStyle[] = [];
    styles.forEach(style => {
      const background = (style[1] as unknown as ObjectType[]).find(e => e.key === 'background');
      const backgroundImage = (style[1] as unknown as ObjectType[]).find(e => e.key === 'backgroundImage');
      const mask = (style[1] as unknown as ObjectType[]).find(e => e.key === 'mask');
      const maskImage = (style[1] as unknown as ObjectType[]).find(e => e.key === 'maskImage');
      const overflow = (style[1] as unknown as ObjectType[]).find(e => e.key === 'overflow');
      const overflowX = (style[1] as unknown as ObjectType[]).find(e => e.key === 'overflowX');
      const overflowY = (style[1] as unknown as ObjectType[]).find(e => e.key === 'overflowY');

      const transitStyle: ITransitStyle = {
        className: style[0] as string,
        enabled: control.activeClass(style[0] as string),
        isSvg: false
      }

      if ((overflow && overflow.enabled && overflow.value !== 'hidden') ||
        (overflowY && overflowY.enabled && overflowY.value !== 'hidden')) {
        transitStyle.scroll = { horizontal: false };
      }

      if (overflowX && overflowX.enabled && overflowX.value !== 'hidden') {
        transitStyle.scroll = { horizontal: true };
      }

      if (background && background.enabled) {
        const match = (background.value as string).match(/url\((\S+)\)/i);
        if (match) {
          transitStyle.src = match[1].replace(/"|'/g, '');
          if (transitStyle.src!.includes('.svg')) {
            transitStyle.isSvg = true;
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
          transitStyle.src = match[1].replace(/"|'/g, '');
          if (transitStyle.src!.includes('.svg')) {
            transitStyle.isSvg = true;
          }
        }
      }
      if (backgroundImage && backgroundImage.enabled) {
        transitStyle.src = backgroundImage.value as string;

        if (transitStyle.src!.includes('.svg')) {
          transitStyle.isSvg = true;

        } else {
          const backgroundSize = control.cssProperty(style[0] as string, 'backgroundSize');
          const backgroundPosition = control.cssProperty(style[0] as string, 'backgroundPosition');
          const backgroundRepeat = control.cssProperty(style[0] as string, 'backgroundRepeat');
          transitStyle.style = reactNativeImage.imageMode(backgroundRepeat, backgroundSize, backgroundPosition);
        }
      }
      if (maskImage && maskImage.enabled) {
        transitStyle.src = maskImage.value as string;
        if (transitStyle.src!.includes('.svg')) {
          const backgroundColor = control.cssProperty(style[0] as string, 'backgroundColor');
          const width = control.cssProperty(style[0] as string, 'width');
          const height = control.cssProperty(style[0] as string, 'height');
          transitStyle.style = reactNativeImage.svgMode(width, height, backgroundColor);
          transitStyle.isSvg = true;
        }
      }
      (transitStyle.src || transitStyle.gradient || transitStyle.scroll) && transitStyles.push(transitStyle);

    });
    return transitStyles.length ? transitStyles : undefined;
  }

  isLeftDrawerChild(control: IControl) {
    return !!Array.from(this.leftDrawer.values()).find(id => control.path.includes(id));
  }

  isRightDrawerChild(control: IControl) {
    return !!Array.from(this.rightDrawer.values()).find(id => control.path.includes(id));
  }

  isTabChild(control: IControl) {
    return !!Array.from(this.tab.values()).find(id => control.path.includes(id));
  }

  generateRN() {
    const childrenMap: { [key: string]: IStoreContent[] } = {};
    this.store.screens.forEach((screen, i) => screen.setChecksum(0, [], i, (depth: number, index: number, control: IControl) => {
      if (!this.storeContent.has(screen.id)) {
        this.storeContent.set(screen.id, []);
      }
      const actions = control.actions.toJS().sort((a, b) => {
        if (b[0] === NAVIGATE_TO) return -1;
        return 1;
      });
      const transitStyles = this.transitStyle(control);

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
          control.cssStyles.size > 1,
          transitStyles,
          actions,
          control.title);
      const pathKey = control.path.join('/');
      if (!childrenMap[pathKey]) {
        childrenMap[pathKey] = [];
      }
      childrenMap[pathKey].push(store);

      if(control.meta === ScreenMetaEnum.COMPONENT) {
        if(this.isLeftDrawerChild(control)) {
          this.storeContent.get(this.leftDrawer.get(screen.id)!)!.push(store);
        } else if(this.isRightDrawerChild(control)) {
          this.storeContent.get(this.rightDrawer.get(screen.id)!)!.push(store);
        } else if(this.isTabChild(control)) {
          this.storeContent.get(this.tab.get(screen.id)!)!.push(store);
        } else {
          this.storeContent.get(screen.id)!.push(store);
        }

      } else if(control.meta === ScreenMetaEnum.LEFT_DRAWER) {
        this.leftDrawer.set(screen.id, control.id);
        this.storeContent.set(control.id, []);
        this.storeContent.get(control.id)!.push(store);
      }

    }));

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
    const screenNames: { id: string; title: string }[] = [];
    const zip = new JSZip();
    this.store.screens.forEach((screen: IControl) => {
      !screenHashes.includes(screen.hashChildren as string) && screenHashes.push(screen.hashChildren as string);
    });
    this.components.forEach((cmp, hash) => {
      if (screenHashes.includes(hash)) {
        cmp.controls.forEach((control) => {
          const title = this.approveNameSpace('Screen' + control.title.replace(/\s/g, ''));
          cmp.styles.delete(control.hashChildrenWithStyle as string);
          this.screen2zip(zip, cmp, title);
          this.initState2zip(zip, `${SRC_FOLDER}/${SCREENS_FOLDER}/${title}`, this.getScreenStore(control.id));
          screenNames.push({ id: control.id, title });
        });
      }
      this.component2zip(zip, cmp, COMPONENTS_FOLDER, cmp.nameSpace);
    });
    this.baseComponent2zip(zip, true);
    this.baseComponent2zip(zip, false);
    this.navigation2zip(zip, screenNames);
    this.screens2zip(zip, screenNames);
    this.specNavComponents2zip(zip);
    this.app2zip(zip);
    this.transitStyle2zip(zip);
    this.controlProperty2Zip(zip);
    this.storeBase2zip(zip);
    this.leftDrawer.size && this.navSpec2zip(zip, LEFT_DRAWER, this.leftDrawer);
    this.rightDrawer.size && this.navSpec2zip(zip, RIGHT_DRAWER, this.rightDrawer);
    this.tab.size && this.navSpec2zip(zip, TABS, this.tab);
    this.generateZip(zip);
  }

  async generateZip(zip: JSZip) {
    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${this.store.project.title.length ? this.store.project.title : 'Project'}.zip`);
    } catch (err) {
      this.addToTransitionErrors('Zip folder generation Error: ' + err.message);
    }
  }

  screen2zip(zip: JSZip, cmp: IGenerateComponent, title: string) {
    let content = IMPORT_REACT + ';\n';
    content += importFrom(cmp.nameSpace, `${APP_ROOT}/${COMPONENTS_FOLDER}/${cmp.nameSpace}/${cmp.nameSpace}`) + ';\n';
    content += importFrom(STORE, `${APP_ROOT}/${SCREENS_FOLDER}/${title}/${STORE}`) + ';\n';

    content += `\n${FUNCTION} ${title}({navigation, route}) {\n`;
    content += `  const store = new ${STORE}(navigation);\n`;
    content += `  return <${cmp.nameSpace} ${STORE_VARIABLE}={store} ${PROPS_VARIABLE}={store.props(route.params.${COMPONENT_ID})} />;\n`;
    content += `}\nexport default ${title};`;
    zip.file(`${SRC_FOLDER}/${SCREENS_FOLDER}/${title}/${title}.js`, content);
    this.screenStore2zip(zip, title);
  }

  component2zip(zip: JSZip, cmp: IGenerateComponent, folder: string, name: string) {
    let content = cmp.stylesString();

    zip.file(`${SRC_FOLDER}/${folder}/${cmp.nameSpace}/${STYLES}.js`, content);
    content = cmp.generateComponentString();
    zip.file(`${SRC_FOLDER}/${folder}/${name}/${name}.js`, content);
  }

  baseComponent2zip(zip: JSZip, isText: boolean) {
    const name = isText ? TEXT_BASE_COMP : BASE_COMP;
    let elseCause = `else {\n`;
    elseCause += `    if(${PROPS_VARIABLE}.hasAction) {\n`;
    elseCause += `      properties.onPress = () => ${STORE_VARIABLE}.onPress(${PROPS_VARIABLE});\n`;
    elseCause += `      properties.activeOpacity = .8;\n`;
    elseCause += `      Component = ${TOUCHABLE_OPACITY_COMP};\n`;
    elseCause += '    }\n';
    elseCause += '  }'

    let textElse = 'else {\n';
    textElse += `    ${CHILDREN} = ${PROPS_VARIABLE}.text;\n`;
    textElse += '  }';

    elseCause = !isText ? elseCause : textElse;

    const returnGrid = `if(${CHILDREN}) {
    ${RETURN} (<Component {...properties}>
      {
        ${CHILDREN}.map((child, i) => 
          React.createElement(child.component, {key: child.id + i, ${STORE_VARIABLE}: ${STORE_VARIABLE}, ${PROPS_VARIABLE}: child}))
      }
    </Component>);
  }
    
  ${RETURN} (<Component {...properties} />);`;
    const returnText = `if(${CHILDREN}) {
    ${RETURN} (<Component {...properties}>{${CHILDREN}}</Component>);
  }
  ${RETURN} (<Component {...properties} />);
    `;

    const returnCause = isText ? returnText : returnGrid;

    const content = `${IMPORT_REACT};
${importFrom([isText ? TEXT_COMP : VIEW_COMP, isText ? IMAGE_COMP : IMAGE_BACKGROUND_COMP, SCROLL_VIEW_COMP, FLAT_LIST_COMP, TOUCHABLE_OPACITY_COMP])};
${importFrom([SVG_URI_COMP], 'react-native-svg')};
${importFrom([LINEAR_GRADIENT_COMP], 'react-native-linear-gradient')};
    
${FUNCTION} ${name}({${STORE_VARIABLE}, ${PROPS_VARIABLE}, ${STYLES}}) {
  const style = ${STYLES}[${PROPS_VARIABLE}.${STYLE_ID}];
  let Component = ${isText ? TEXT_COMP : VIEW_COMP};
  const properties = {};
  const transit = ${PROPS_VARIABLE}.activeTransit;
  let ${CHILDREN} = ${STORE_VARIABLE}.${CHILDREN}[${PROPS_VARIABLE}.id];
  
  properties.style = ${PROPS_VARIABLE}.getStyle(style);
  
  if(transit) {
    if(transit.isSvg) {
      Component = ${SVG_URI_COMP};
      properties.uri = transit.src;
      if(transit.style && transit.style.color) {
        properties.fill = transit.style.color;
      }
    } else if(transit.gradient) {
      Component = ${LINEAR_GRADIENT_COMP};
      Object.assign(properties, transit.gradient.colorStops || {}, transit.gradient.orientation || {});
    } else if(transit.scroll) {
      Component = ${SCROLL_VIEW_COMP};
      if(transit.scroll.horizontal) {
        properties.horizontal = true;
      }
    } else {
      Component = ${isText ? IMAGE_COMP : IMAGE_BACKGROUND_COMP};
      Object.assign(${isText ? 'properties' : 'properties.style'}, transit.style || {});
      properties.source = {uri: transit.src};
    }
  } ${elseCause}
  
  ${returnCause}
}
    
${EXPORT_DEFAULT} ${name};`;
    zip.file(`${SRC_FOLDER}/${COMPONENTS_FOLDER}/${name}/${name}.js`, content);
  }

  navSpec2zip(zip: JSZip, title: string, map: Map<string, string>) {
    const screenId = Array.from(map.keys())[0];
    const nameSpaces: string[] = [];
    let content = IMPORT_REACT + ';\n';
    content += importFrom(['observer'], 'mobx-react-lite') + ';\n';
    map.forEach((controlId) => {
      const cmp = this.getComponentByControlId(controlId);
      if(cmp) {
        !nameSpaces.includes(cmp.nameSpace) && nameSpaces.push(cmp.nameSpace);
      }
    });

    nameSpaces.forEach((nameSpace) => {
      content += importFrom(nameSpace, `${APP_ROOT}/${COMPONENTS_FOLDER}/${nameSpace}/${nameSpace}`) + ';\n';
    });

    let componentContent = '';
    const componentName = nameSpaces.length > 1 ? 'Component' : nameSpaces[0];
    if(nameSpaces.length > 1) {
      componentContent += '  Component = property.component;\n\n';
    }

    componentContent += `  ${RETURN} <${componentName} ${STORE_VARIABLE}={${STORE_VARIABLE}} ${PROPS_VARIABLE}={property} />;\n`;

    content += importFrom(STORE, `${APP_ROOT}/${NAVIGATION_FOLDER}/${title}/${STORE}`) + ';\n';

    content += `\n${FUNCTION} ${title}(props) {\n`;
    content += `  const [screen, setScreen] = React.useState("${screenId}");\n`;
    content += '  const {navigation} = props;\n';
    content += `  const ${STORE_VARIABLE} = new ${STORE}(navigation);\n`;
    let content1 = '  React.useEffect(() => {\n';
    content1 += `    const unsubscribe = navigation.addListener('state', () => {\n`;
    content1 += `      setScreen("${screenId}");\n`;
    content1 += '      console.log(1111111, props);\n';
    content1 += '    });\n';
    content1 += `    ${RETURN} unsubscribe;\n`;
    content1 += '  }, [navigation]);\n';
    content += `  const property = ${STORE_VARIABLE}.baseProps(screen);\n`;
    content += componentContent;
    content += `}\nexport default ${title};`;
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${title}/${title}.js`, content);
    this.navSpecStore2zip(zip, title, map);
    this.navSpecInitState2zip(zip, title, map);
  }

  navSpecInitState2zip(zip: JSZip, title: string, map: Map<string, string>) {
    const imports: string[] = [];
    let content = importFrom(PROPERTY_MODEL, `${APP_ROOT}/${MODELS_FOLDER}/${PROPERTY_MODEL}`) + ';\n';
    content += `const ${INIT_STATE} = [`;

    map.forEach((specComponentId, screenId) => {
      this.storeContent.get(specComponentId)!.forEach(e => {
        if(e.id === specComponentId) {
          e.placeIndex = [0];
        }
        const nameSpace = this.components.get(e.hash)!.nameSpace;
        !imports.includes(nameSpace) && imports.push(nameSpace);
        content += `\n  new ${PROPERTY_MODEL}(${e.toString(nameSpace as unknown as React.FC)}),`;
      });
    });
    content += `\n]\nexport default ${INIT_STATE};`;
    content = contentString(content, imports);
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${title}/${INIT_STATE}.js`, content);
  }

  navSpecStore2zip(zip: JSZip, title: string, map: Map<string, string>) {
    let content = importFrom(['action', 'observable'], 'mobx') + ';\n';
    content += importFrom(INIT_STATE, `${APP_ROOT}/${NAVIGATION_FOLDER}/${title}/${INIT_STATE}`) + ';\n';
    content += importFrom(STORE_BASE, `${APP_ROOT}/${MODELS_FOLDER}/${STORE_BASE}`) + ';\n';
    content += `\nclass ${STORE} extends ${STORE_BASE} {\n`;
    content += `  baseComponent = {\n`;
    map.forEach((componentId, stateId) => {
      content += `    '${stateId}': '${componentId}',\n`;
    });
    content += '  };\n';

    content += `  constructor(${NAVIGATION_VARIABLE}) {\n`;
    content += `    super(${INIT_STATE}, ${NAVIGATION_VARIABLE});\n`;
    content += '  }\n';

    content += '  baseProps(stateId) {\n';
    content += `    return this.props(this.baseComponent[stateId]);\n`;
    content += '  }\n'

    content += `}\nexport default ${STORE};`;
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${title}/${STORE}.js`, content);
  }

  storeBase2zip(zip: JSZip) {
    let content = importFrom(['action'], 'mobx') + ';\n';
    content += importFrom(['DrawerActions'], '@react-navigation/native') + ';\n';
    content += importFrom(SCREENS_LIST, `${APP_ROOT}/${NAVIGATION_FOLDER}/${SCREENS_LIST}`) + ';\n';
    content += importFrom(NAV_COMPONENTS, `${APP_ROOT}/${NAVIGATION_FOLDER}/${NAV_COMPONENTS}`) + ';\n';
    content += `\nclass ${STORE_BASE} {\n`;
    content += `  ${PROPERTIES_VARIABLE} = {};\n`;
    content += `  ${CHILDREN} = {};\n`;
    content += `  ${NAVIGATION_VARIABLE};\n\n`;

    content += `  constructor(${INIT_STATE}, ${NAVIGATION_VARIABLE}) {\n`;
    content += `    this.${NAVIGATION_VARIABLE} = ${NAVIGATION_VARIABLE};\n`;
    content += `    ${INIT_STATE}.forEach(prop => {\n`;
    content += `      this.${PROPERTIES_VARIABLE}[prop.id] = prop;\n`;
    content += `      this.${CHILDREN}[prop.id] = \n`;
    content += `        ${INIT_STATE}\n`;
    content += `          .filter(e => e.path.toString() === [...prop.path, prop.id].toString())\n`;
    content += `          .sort((a, b) => {\n`;
    content += `            if(a.placeIndex[0] === b.placeIndex[0]) return a.placeIndex[1] - b.placeIndex[1];\n`;
    content += `            return a.placeIndex[0] - b.placeIndex[0];\n`;
    content += `          });\n`;
    content += '    });\n';
    content += '  }\n';

    content += '  props(id) {\n';
    content += `    return this.${PROPERTIES_VARIABLE}[id];\n`;
    content += '  }\n';

    content += '  enableStyle(entry) {\n';
    content += `    const type = ${NAV_COMPONENTS}[entry[1]];\n`;
    content += '    if(type) {\n';
    content += `      if(type === '${LEFT_DRAWER}') {\n`;
    content += '        this.navigation.openDrawer();'
    content += '      }\n';
    content += `      if(type === '${RIGHT_DRAWER}') {\n`;
    content += '        this.navigation.dispatch(DrawerActions.openDrawer());\n';
    content += '      }\n';
    content += '    } else {\n';
    content += `      this.${PROPERTIES_VARIABLE}[entry[1]] && this.${PROPERTIES_VARIABLE}[entry[1]].addStyle(entry[2]);\n`;
    content += '    }\n';
    content += '  }\n';

    content += '  @action onPress(property) {\n';
    content += '    let l = property.action.length, i = 0;\n';
    content += '    while(l--) {\n';
    content += '      const entry = property.action[i++];\n';
    content += '      switch(entry[0]) {\n';
    content += `        case '${NAVIGATE_TO}':\n`;
    content += `          ${SCREENS_LIST}[entry[1]] && this.${NAVIGATION_VARIABLE}.navigate(${SCREENS_LIST}[entry[1]])\n`;
    content += `          ${BREAK};\n`;
    content += `        case '${ENABLE_STYLE}':\n`;
    content += `          this.enableStyle(entry);\n`;
    content += `          ${BREAK};\n`;
    content += `        case '${DISABLE_STYLE}':\n`;
    content += `          this.${PROPERTIES_VARIABLE}[entry[1]] && this.${PROPERTIES_VARIABLE}[entry[1]].removeStyle(entry[2]);\n`;
    content += `          ${BREAK};\n`;
    content += `        case '${TOGGLE_STYLE}':\n`;
    content += `          this.${PROPERTIES_VARIABLE}[entry[1]] && this.${PROPERTIES_VARIABLE}[entry[1]].toggleStyle(entry[2]);\n`;
    content += `          ${BREAK};\n`;
    content += '      }\n';
    content += '    }\n';
    content += '  }\n';

    content += `}\nexport default ${STORE_BASE};`;
    zip.file(`${SRC_FOLDER}/${MODELS_FOLDER}/${STORE_BASE}.js`, content);
  }

  prepareStack(screenNames: { id: string; title: string }[]) {
    let stacks = '';

    screenNames.forEach(screenName => {
      stacks += '      <Stack.Screen\n';
      stacks += `        name="${screenName.title}"\n`;
      stacks += '        options={{headerShown: false}}\n';
      stacks += `        component={${screenName.title}}\n`;
      stacks += `        initialParams={{${COMPONENT_ID}: '${screenName.id}'}}\n`;
      stacks += '      />\n';
    });

    let stackNavigatorContent = `function StackNavigation() {\n`;
    stackNavigatorContent += `  ${RETURN} (\n`;
    stackNavigatorContent += `    <Stack.Navigator initialRouteName="${screenNames[0].title}">\n`;
    stackNavigatorContent += stacks;
    stackNavigatorContent += '    </Stack.Navigator>\n';
    stackNavigatorContent += '  );\n'
    stackNavigatorContent += '}\n';
    return stackNavigatorContent;
  }

  prepareDrawerScreens() {
    let singleDrawerNavContent = '';
    if(this.leftDrawer.size || this.rightDrawer.size) {
      singleDrawerNavContent += `\nfunction ${this.leftDrawer.size > 0 ? 'DrawerNavigation' : 'LeftDrawerNavigation'}() {\n`;
      singleDrawerNavContent += '  return (\n';
      singleDrawerNavContent += '    <Drawer.Navigator\n';
      singleDrawerNavContent += this.leftDrawer.size ? '' : '      drawerPosition="right"\n';
      singleDrawerNavContent += `      drawerContent={(props) => <${this.leftDrawer.size ? LEFT_DRAWER : RIGHT_DRAWER} {...props} />}>\n`;
      singleDrawerNavContent += '      <Stack.Screen name="StackNavigation" component={StackNavigation} />\n';
      singleDrawerNavContent += '    </Drawer.Navigator>\n';
      singleDrawerNavContent += '  );\n';
      singleDrawerNavContent += '}\n\n';
      if(this.leftDrawer.size && this.rightDrawer.size) {
        singleDrawerNavContent += 'function DrawerNavigation() {\n';
        singleDrawerNavContent += '  return (\n';
        singleDrawerNavContent += '    <Drawer.Navigator\n';
        singleDrawerNavContent += `      drawerPosition="right"\n`;
        singleDrawerNavContent += `      drawerContent={(props) => <${RIGHT_DRAWER} {...props} />}>\n`;
        singleDrawerNavContent += '      <Drawer.Screen name="LeftDrawer" component={LeftDrawerNavigation} />\n';
        singleDrawerNavContent += '    </Drawer.Navigator>\n';
        singleDrawerNavContent += '  )\n';
        singleDrawerNavContent += '}\n\n';
      }
    }
    return singleDrawerNavContent;
  }

  prepareTabScreens(screenNames: { id: string; title: string }[]) {
    let tabNavContent = '';
    if(this.tab.size) {
      const [inDrawer, outOfDrawer] = this.tabScreens;
      tabNavContent += 'function TabNavigation() {\n';
      tabNavContent += '  return (\n';
      tabNavContent += '    <Tab.Navigator>\n';
      if(inDrawer.length) {
        tabNavContent += ` <Tab.Screen name="DrawerNavigation" component={DrawerNavigation} />\n`;
      }
      outOfDrawer.forEach(screen => {
        const item = screenNames.find(e => e.id === screen);
        if(!item) return;
        tabNavContent += `  <Tab.Screen name="${item!.title}" component={${item!.title}} />`;
      })
      tabNavContent += '    </Tab.Navigator>\n';
      tabNavContent += '  )\n';
      tabNavContent += '}\n';
    }
    return tabNavContent;
  }

  navigation2zip(zip: JSZip, screenNames: { id: string; title: string }[]) {

    let navigationContent = this.prepareStack(screenNames);

    navigationContent += this.prepareDrawerScreens();

    navigationContent += this.prepareTabScreens(screenNames);

    const navFunction = this.tab.size ? 'TabNavigation' : (this.leftDrawer.size || this.rightDrawer.size )
      ? 'DrawerNavigation' : 'StackNavigation';

    let content = IMPORT_REACT + ';\n';
    content += importFrom(['createStackNavigator'], '@react-navigation/stack') + ';\n';

    if(this.leftDrawer.size) {
      content += importFrom(['createDrawerNavigator'], '@react-navigation/drawer') + ';\n';
      content += importFrom(LEFT_DRAWER, `${APP_ROOT}/${NAVIGATION_FOLDER}/${LEFT_DRAWER}/${LEFT_DRAWER}`) + ';\n';
    }
    if(this.rightDrawer.size) {
      content += importFrom(RIGHT_DRAWER, `${APP_ROOT}/${NAVIGATION_FOLDER}/${RIGHT_DRAWER}/${RIGHT_DRAWER}`) + ';\n';
    }
    if(this.tab.size) {
      content += importFrom(['createBottomTabNavigator'], '@react-navigation/bottom-tabs') + ';\n';
      content += importFrom(TABS, `${APP_ROOT}/${NAVIGATION_FOLDER}/${TABS}/${TABS}`) + ';\n';
    }
    screenNames.forEach(screenName =>
      (content += importFrom(screenName.title, `${APP_ROOT}/${SCREENS_FOLDER}/${screenName.title}/${screenName.title}`) + ';\n'));

    content += '\nconst Stack = createStackNavigator();\n';
    if(this.leftDrawer.size || this.rightDrawer.size) {
      content += 'const Drawer = createDrawerNavigator();\n';
    }

    if(this.tab.size) {
      content += 'const Tab = createBottomTabNavigator();\n';
    }

    content += navigationContent;

    content += `export default ${navFunction};`;
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/AppNavigator.js`, content);
  }

  screens2zip(zip: JSZip, screenNames: { id: string; title: string }[]) {
    let content = `const ${SCREENS_LIST} = {\n`;
    screenNames.map(e => content += `  '${e.id}': '${e.title}',\n`);
    content += `};\nexport default ${SCREENS_LIST};`;
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${SCREENS_LIST}.js`, content);
  }

  specNavComponents2zip(zip: JSZip) {
    let content = `const ${NAV_COMPONENTS} = {\n`;
    if(this.leftDrawer.size) {
      this.leftDrawer.forEach(((drawerId) => {
        content += `  '${drawerId}': '${LEFT_DRAWER}',\n`;
      }));
    }
    if(this.rightDrawer.size) {
      this.rightDrawer.forEach(((drawerId) => {
        content += `  '${drawerId}': '${RIGHT_DRAWER}',\n`;
      }));
    }
    if(this.tab.size) {
      this.tab.forEach(((drawerId) => {
        content += `  '${drawerId}': '${TABS}',\n`;
      }));
    }
    content += `};\nexport default ${NAV_COMPONENTS};`;
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${NAV_COMPONENTS}.js`, content);
  }

  app2zip(zip: JSZip) {
    let content = `import 'mobx-react-lite/batchingForReactNative';\n`;
    content += IMPORT_REACT + ';\n';

    const statusBar = this.store.statusBarEnabled ?
      `<StatusBar barStyle="${this.store.mode === Mode.DARK ? 'light-content' : 'dark-content'}" backgroundColor="${this.store.statusBarColor}" />`
      : '<StatusBar hidden />';

    content +=
      `import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {SafeAreaView, StatusBar} from 'react-native';
import AppContainer from '${APP_ROOT}/navigation/AppNavigator';

const Fonts = {
  h1: 35,
  h2: 30,
  h3: 20,
  h4: 17,
  h5: 15,
  small: 10,
};

const theme = {
  ...DefaultTheme,
  fonts: {
    ...Fonts,
  },
  dark: ${this.store.mode === Mode.DARK},
  colors: {
    ...DefaultTheme.colors,
    background: '${this.store.background.backgroundColor}',
  },
};
    
function App() {
  return (
    <NavigationContainer theme={theme}>
      ${statusBar}
      <SafeAreaView style={{flex: 1, backgroundColor: "${this.store.statusBarColor}"}}>
        <AppContainer />
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;`;
    zip.file(`${SRC_FOLDER}/App.js`, content);
  }

  transitStyle2zip(zip: JSZip) {
    let content = importFrom(['observable'], 'mobx') + ';\n';
    content += `\nclass ${TRANSIT_STYLE_MODEL} {\n`;
    content += '  className;\n';
    content += '  isSvg;\n';
    content += '  src;\n';
    content += '  style;\n';
    content += '  gradient;\n';
    content += '  scroll;\n';
    content += '  @observable enabled;\n\n';

    content += '  constructor({className, isSvg, src, style, gradient, scroll, enabled}) {\n';
    content += '    this.className = className;\n';
    content += '    this.isSvg = isSvg;\n';
    content += '    this.src = src;\n';
    content += '    this.style = style;\n';
    content += '    this.gradient = gradient;\n';
    content += '    this.scroll = scroll;\n';
    content += '    this.enabled = enabled;\n';
    content += '  }\n';

    content += `}\nexport default ${TRANSIT_STYLE_MODEL};`;
    zip.file(`${SRC_FOLDER}/${MODELS_FOLDER}/${TRANSIT_STYLE_MODEL}.js`, content);
  }

  controlProperty2Zip(zip: JSZip) {
    let content = importFrom(['observable', 'action', 'computed'], 'mobx') + ';\n';
    content += importFrom('TransitStyle', `${APP_ROOT}/${MODELS_FOLDER}/${TRANSIT_STYLE_MODEL}`) + ';\n';
    content += `\nclass ${PROPERTY_MODEL} {\n`;
    content += '  id;\n';
    content += '  path;\n';
    content += '  styleId;\n';
    content += '  action;\n';
    content += '  transitStyles;\n';
    content += '  placeIndex;\n';
    content += '  component;\n';
    content += '  @observable classes;\n';
    content += '  @observable text;\n';

    content += '  @computed get hasAction() {\n';
    content += `    ${RETURN} this.action && this.action.length > 0;\n`;
    content += '  }\n';

    content += '  @computed get activeClass() {\n';
    content += `    ${RETURN} this.classes[this.classes.length - 1];\n`;
    content += '  }\n';

    content += '  @computed get activeTransit() {\n';
    content += `    ${RETURN} (this.transitStyles || []).find(e => e.className === this.activeClass);\n`;
    content += '  }\n';

    content += '  getStyle(style) {\n';
    content += `    ${RETURN} computed(() => style ? this.classes.map(entry => style[entry]) : {flex: 1} ).get();\n`;
    content += '  }\n';

    content += '  constructor({id, path, styleId, action, classes, text, transitStyles, placeIndex, component}) {\n';
    content += '    this.id = id;\n';
    content += '    this.path = path;\n';
    content += '    this.styleId = styleId;\n';
    content += '    this.action = action;\n';
    content += '    this.classes = classes;\n';
    content += '    this.text = text;\n';
    content += '    this.placeIndex = placeIndex;\n';
    content += '    transitStyles && (this.transitStyles = transitStyles.map(e => new TransitStyle(e)));\n';
    content += '    this.component = component;\n';
    content += '  }\n';

    content += '  @action addStyle(style) {\n';
    content += '    !this.classes.includes(style) && this.classes.push(style);\n';
    content += '  }\n';

    content += '  @action removeStyle(style) {\n';
    content += '    this.classes.includes(style) && this.classes.splice(this.classes.indexOf(style), 1);\n';
    content += '  }\n';

    content += '  @action toggleStyle(style) {\n';
    content += '    if(this.classes.includes(style)) {\n';
    content += '      this.removeStyle(style);\n';
    content += '    } else {\n';
    content += '      this.addStyle(style);\n';
    content += '    }\n';
    content += '  }\n';

    content += `}\nexport default ${PROPERTY_MODEL};`;
    zip.file(`${SRC_FOLDER}/${MODELS_FOLDER}/${PROPERTY_MODEL}.js`, content);
  }

  initState2zip(zip: JSZip, path: string, stateContent: IStoreContent[]) {
    const imports: string[] = [];
    let content = importFrom(PROPERTY_MODEL, `${APP_ROOT}/${MODELS_FOLDER}/${PROPERTY_MODEL}`) + ';\n';

    content += `\nconst ${INIT_STATE} = [`;
    content += stateContent.map(e => {
      const nameSpace = this.components.get(e.hash)!.nameSpace;
      !imports.includes(nameSpace) && imports.push(nameSpace);
      const string = `\n  new ${PROPERTY_MODEL}(${e.toString(nameSpace as unknown as React.FC)})`;
      return string;
    });
    content += `];\nexport default ${INIT_STATE};`;

    const contentWithImports = contentString(content, imports);
    zip.file(`${path}/${INIT_STATE}.js`, contentWithImports);
  }

  screenStore2zip(zip: JSZip, title: string) {
    let content = importFrom(['action'], 'mobx') + ';\n';
    content += importFrom(INIT_STATE, `${APP_ROOT}/${SCREENS_FOLDER}/${title}/${INIT_STATE}`) + ';\n';
    content += importFrom(STORE_BASE, `${APP_ROOT}/${MODELS_FOLDER}/${STORE_BASE}`) + ';\n';
    content += `\nclass ${STORE} extends ${STORE_BASE} {\n\n`;

    content += `  constructor(${NAVIGATION_VARIABLE}) {\n`;
    content += `    super(${INIT_STATE}, ${NAVIGATION_VARIABLE});\n`;
    content += '  }\n\n';

    content += `}\nexport default ${STORE};`;
    zip.file(`${SRC_FOLDER}/${SCREENS_FOLDER}/${title}/${STORE}.js`, content);
  }

  addToTransitionErrors(error: string) {
    this.transitionErrors.push(error);
  }

  clearTransitionErrors() {
    this.transitionErrors = [];
  }
}

export default GenerateService;
