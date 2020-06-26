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
  BASE_COMP, BREAK,
  CHILDREN,
  COMPONENT_ID,
  COMPONENTS_FOLDER, DISABLE_STYLE, ENABLE_STYLE,
  EXPORT_DEFAULT,
  FLAT_LIST_COMP,
  FUNCTION,
  IMAGE_BACKGROUND_COMP,
  IMAGE_COMP,
  IMPORT_REACT, INIT_STATE,
  LINEAR_GRADIENT_COMP, MODELS_FOLDER, NAVIGATE_TO,
  NAVIGATION_FOLDER, NAVIGATION_VARIABLE,
  PROPERTIES_VARIABLE, PROPERTY_MODEL, PROPS_VARIABLE,
  RETURN, SCREEN_STORE,
  SCREENS_FOLDER, SCREENS_LIST,
  SCROLL_VIEW_COMP,
  SRC_FOLDER, STORE_VARIABLE,
  STYLE_ID,
  STYLES,
  SVG_URI_COMP,
  TEXT_BASE_COMP,
  TEXT_COMP, TOGGLE_STYLE,
  TOUCHABLE_OPACITY_COMP,
  TRANSIT_STYLE_MODEL,
  VIEW_COMP
} from '../Constants';
import { importFrom } from '../utils';
import { Mode } from 'enums/ModeEnum';
import IScreenStoreContent from 'interfaces/IScreenStoreContent';
import ScreenStoreContent from '../ScreenStoreContent';
import ITransitStyle from 'interfaces/ITransitSyle';
import GradientParser, { correctGradients } from 'utils/parseGradient';
import { reactNativeImage } from './ReactNativeStyleDictionary';

type ObjectType = { [key: string]: string | number | boolean | undefined | null };

class GenerateService {
  store: IMobileUIView;
  components: Map<string, IGenerateComponent> = new Map<string, IGenerateComponent>();
  navigation: IControl[] = [];
  tab: IControl[] = [];
  leftDrawer: IControl[] = [];
  rightDrawer: IControl[] = [];
  nameSpaces: string[] = [];
  screenStoreContent: Map<string, IScreenStoreContent[]> = new Map<string, IScreenStoreContent[]>();
  transitionErrors: string[] = [];

  constructor(store: IMobileUIView) {
    this.store = store;
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

  generateRN() {
    const childrenMap: { [key: string]: IScreenStoreContent[] } = {};
    this.store.screens.forEach((screen, i) => screen.setChecksum(0, [], i, (depth: number, index: number, control: IControl) => {
      if (!this.screenStoreContent.has(screen.id)) {
        this.screenStoreContent.set(screen.id, []);
      }
      const actions = control.actions.toJS().sort((a, b) => {
        if (b[0] === NAVIGATE_TO) return -1;
        return 1;
      });
      const transitStyles = this.transitStyle(control);
      const store =
        new ScreenStoreContent(
          control.id as string,
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

      this.screenStoreContent.get(screen.id)!.push(store);
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

  sortScreensStoreChildren(map: { [key: string]: IScreenStoreContent[] }) {
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
    return this.screenStoreContent.get(screenId) as IScreenStoreContent[];
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
          this.screenInitState2zip(zip, `${SRC_FOLDER}/${SCREENS_FOLDER}/${title}`, this.getScreenStore(control.id));
          screenNames.push({ id: control.id, title });
        });
      }
      this.component2zip(zip, cmp, COMPONENTS_FOLDER, cmp.nameSpace);
    });
    this.baseComponent2zip(zip, true);
    this.baseComponent2zip(zip, false);
    this.navigation2zip(zip, screenNames);
    this.screens2zip(zip, screenNames);
    this.app2zip(zip);
    this.transitStyle2zip(zip);
    this.controlProperty2Zip(zip);
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
    content += importFrom(SCREEN_STORE, `${APP_ROOT}/${SCREENS_FOLDER}/${title}/${SCREEN_STORE}`) + ';\n';

    content += `\n${FUNCTION} ${title}({navigation, route}) {\n`;
    content += `  const store = new ${SCREEN_STORE}(navigation);\n`;
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

  navigation2zip(zip: JSZip, screenNames: { id: string; title: string }[]) {
    let content = IMPORT_REACT + ';\n';
    content += importFrom(['createStackNavigator'], '@react-navigation/stack') + ';\n';
    screenNames.forEach(screenName =>
      (content += importFrom(screenName.title, `${APP_ROOT}/${SCREENS_FOLDER}/${screenName.title}/${screenName.title}`) + ';\n'));

    content += '\nconst Stack = createStackNavigator();\n';

    content += FUNCTION + ' AppContainer() {\n';
    content += '  return (\n';
    content += `    <Stack.Navigator initialRouteName="${screenNames[0].title}">\n`;
    screenNames.forEach(screenName => {
      content += `      <Stack.Screen
        name="${screenName.title}"
        options={{headerShown: false}}
        component={${screenName.title}} 
        initialParams={{ ${COMPONENT_ID}: '${screenName.id}' }}
      />\n`;
    });
    content += `    </Stack.Navigator>\n`;
    content += '  )\n';
    content += '}\nexport default AppContainer;';
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/AppNavigator.js`, content);
  }

  screens2zip(zip: JSZip, screenNames: { id: string; title: string }[]) {
    let content = `const ${SCREENS_LIST} = {\n`;
    screenNames.map(e => content += `  '${e.id}': '${e.title}',\n`);
    content += `};\nexport default ${SCREENS_LIST};`;
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${SCREENS_LIST}.js`, content);
  }

  app2zip(zip: JSZip) {
    let content = `import 'mobx-react-lite/batchingForReactNative';\n`;
    content += IMPORT_REACT + ';\n';

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
      <StatusBar barStyle="${this.store.mode === Mode.DARK ? 'light-content' : 'dark-content'}" backgroundColor="${this.store.statusBarColor}" />
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

  screenInitState2zip(zip: JSZip, path: string, stateContent: IScreenStoreContent[]) {
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

    let contentWithImports = importFrom(['observer'], 'mobx-react-lite') + ';\n';
    contentWithImports += imports.map(e => importFrom(e, APP_ROOT + '/' + COMPONENTS_FOLDER + '/' + e + '/' + e) + ';').join('\n');
    contentWithImports += '\n';
    contentWithImports += content;
    zip.file(`${path}/${INIT_STATE}.js`, contentWithImports);
  }

  screenStore2zip(zip: JSZip, title: string) {
    let content = importFrom(['action'], 'mobx') + ';\n';
    content += importFrom(INIT_STATE, `${APP_ROOT}/${SCREENS_FOLDER}/${title}/${INIT_STATE}`) + ';\n';
    content += importFrom(SCREENS_LIST, `${APP_ROOT}/${NAVIGATION_FOLDER}/${SCREENS_LIST}`) + ';\n';
    content += `\nclass ${SCREEN_STORE} {\n`;
    content += `  ${PROPERTIES_VARIABLE} = {};\n`;
    content += `  ${CHILDREN} = {};\n`;
    content += `  ${NAVIGATION_VARIABLE};\n\n`;

    content += `  constructor(${NAVIGATION_VARIABLE}) {\n`;
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

    content += '  @action onPress(property) {\n';
    content += '    let l = property.action.length, i = 0;\n';
    content += '    while(l--) {\n';
    content += '      const entry = property.action[i++];\n';
    content += '      switch(entry[0]) {\n';
    content += `        case '${NAVIGATE_TO}':\n`;
    content += `          ${SCREENS_LIST}[entry[1]] && this.${NAVIGATION_VARIABLE}.navigate(${SCREENS_LIST}[entry[1]])\n`;
    content += `          ${BREAK};\n`;
    content += `        case '${ENABLE_STYLE}':\n`;
    content += `          this.${PROPERTIES_VARIABLE}[entry[1]] && this.${PROPERTIES_VARIABLE}[entry[1]].addStyle(entry[2]);\n`;
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

    content += `}\nexport default ${SCREEN_STORE};`;
    zip.file(`${SRC_FOLDER}/${SCREENS_FOLDER}/${title}/${SCREEN_STORE}.js`, content);
  }

  addToTransitionErrors(error: string) {
    this.transitionErrors.push(error);
  }

  clearTransitionErrors() {
    this.transitionErrors = [];
  }
}

export default GenerateService;
