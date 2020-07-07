import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import IGenerateComponent from 'interfaces/IGenerateComponent';
import {
  APP_ROOT,
  APP_STORE,
  BASE_COMP, BREAK,
  CHILDREN,
  COMPONENT_ID,
  COMPONENTS_FOLDER, DISABLE_STYLE, ENABLE_STYLE,
  EXPORT_DEFAULT,
  FLAT_LIST_COMP,
  FUNCTION,
  IMAGE_BACKGROUND_COMP,
  IMAGE_COMP,
  IMPORT_REACT,
  INIT_STATE, LEFT_DRAWER,
  LINEAR_GRADIENT_COMP,
  MODELS_FOLDER,
  NAV_COMPONENTS, NAVIGATE_TO,
  NAVIGATION_FOLDER,
  NAVIGATION_VARIABLE, PROPERTIES_VARIABLE,
  PROPERTY_MODEL,
  PROPS_VARIABLE,
  RETURN, RIGHT_DRAWER,
  SCREEN_ID_VARIABLE,
  SCREENS_FOLDER,
  SCREENS_LIST,
  SCROLL_VIEW_COMP,
  SRC_FOLDER,
  STORE,
  STORE_BASE,
  STORE_VARIABLE,
  STYLE_ID,
  STYLES,
  SVG_URI_COMP, TABS,
  TEXT_BASE_COMP,
  TEXT_COMP,
  TEXT_INPUT_COMP, TOGGLE_STYLE,
  TOUCHABLE_OPACITY_COMP, TRANSIT_STYLE_MODEL,
  VIEW_COMP
} from '../Constants';
import { importFrom } from '../utils';
import { Mode } from 'enums/ModeEnum';
import IStoreContent from 'interfaces/IStoreContent';
import IService from 'interfaces/IGenerateService';
import { AnimationDirectionEnum } from 'enums/AnimationEnum';

const contentString = (content: string, imports: string[]) => {
  let str = importFrom(['observer'], 'mobx-react-lite') + ';\n';
  str += imports.map(e => importFrom(e, APP_ROOT + '/' + COMPONENTS_FOLDER + '/' + e + '/' + e) + ';').join('\n');
  str += '\n';
  str += content;
  return str
}

class ZipGenerator {
  zip = new JSZip();
  source: IService;

  constructor(source: IService) {
    this.source = source;
  }

  generateRest(screenNames: { id: string; title: string }[]) {
    this.baseComponent2zip(true);
    this.baseComponent2zip(false);
    this.navigation2zip(screenNames);
    this.screens2zip(screenNames);
    this.specNavComponents2zip();
    this.app2zip();
    this.appStore2zip(screenNames);
    this.transitStyle2zip();
    this.controlProperty2Zip();
    this.storeBase2zip();
    this.source.leftDrawer.size && this.navSpec2zip(LEFT_DRAWER, this.source.leftDrawer);
    this.source.rightDrawer.size && this.navSpec2zip(RIGHT_DRAWER, this.source.rightDrawer);
    this.source.tab.size && this.navSpec2zip(TABS, this.source.tab, true);

  }

  async generateZip() {
    try {
      const blob = await this.zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${this.source.store.project.title.length ? this.source.store.project.title : 'Project'}.zip`);
    } catch (err) {
      this.source.addToTransitionErrors('Zip folder generation Error: ' + err.message);
    }
  }

  screen2zip(cmp: IGenerateComponent, title: string) {
    let content = IMPORT_REACT + ';\n';
    content += importFrom(cmp.nameSpace, `${APP_ROOT}/${COMPONENTS_FOLDER}/${cmp.nameSpace}/${cmp.nameSpace}`) + ';\n';
    content += importFrom(STORE, `${APP_ROOT}/${SCREENS_FOLDER}/${title}/${STORE}`) + ';\n';

    content += `\n${FUNCTION} ${title}({navigation, route}) {\n`;
    content += `  const store = new ${STORE}(navigation, route.params.${COMPONENT_ID});\n`;
    content += '  React.useEffect(() => {\n';
    content += `    ${RETURN} store.dispose;\n`;
    content += '  });\n';
    content += `  return <${cmp.nameSpace} ${STORE_VARIABLE}={store} ${PROPS_VARIABLE}={store.props(route.params.${COMPONENT_ID})} />;\n`;
    content += `}\nexport default ${title};`;
    this.zip.file(`${SRC_FOLDER}/${SCREENS_FOLDER}/${title}/${title}.js`, content);
    this.screenStore2zip(title);
  }

  component2zip(cmp: IGenerateComponent, folder: string, name: string) {
    let content = cmp.stylesString();

    this.zip.file(`${SRC_FOLDER}/${folder}/${cmp.nameSpace}/${STYLES}.js`, content);
    content = cmp.generateComponentString();
    this.zip.file(`${SRC_FOLDER}/${folder}/${name}/${name}.js`, content);
  }

  baseComponent2zip(isText: boolean) {
    const name = isText ? TEXT_BASE_COMP : BASE_COMP;
    let elseCause = `else {\n`;
    elseCause += `    if(${PROPS_VARIABLE}.hasAction) {\n`;
    elseCause += `      properties.onPress = () => ${STORE_VARIABLE}.onPress(${PROPS_VARIABLE});\n`;
    elseCause += `      properties.activeOpacity = .8;\n`;
    elseCause += `      Component = ${TOUCHABLE_OPACITY_COMP};\n`;
    elseCause += '    }\n';
    elseCause += '  }'

    let textElse = 'else {\n';
    textElse += `    if(${PROPS_VARIABLE}.meta === 'input' || ${PROPS_VARIABLE}.meta === 'textArea') {\n`;
    textElse += `      Component = ${TEXT_INPUT_COMP};\n`;
    textElse += `      properties.onChange = (e) => ${PROPS_VARIABLE}.setText(e.nativeEvent.text);\n`;
    textElse += `      properties.defaultValue = ${PROPS_VARIABLE}.text;\n`;
    textElse += `      properties.placeholder = ${PROPS_VARIABLE}.title;\n`;
    textElse += `      if(${PROPS_VARIABLE}.meta === 'textArea') {\n`;
    textElse += '        properties.multiline = true;\n';
    textElse += '      }\n';
    textElse += '    } else {\n';
    textElse += `      ${CHILDREN} = ${PROPS_VARIABLE}.text;\n`;
    textElse += '    }\n';
    textElse += '  }';

    elseCause = !isText ? elseCause : textElse;

    const returnGrid = `if(${CHILDREN}.length) {
    ${RETURN} (<Component {...properties}>
      {
        ${CHILDREN}.map((child, i) => 
          React.createElement(child.component, {key: child.id + i, ${STORE_VARIABLE}: ${STORE_VARIABLE}, ${PROPS_VARIABLE}: child}))
      }
    </Component>);
  }
    
  ${RETURN} (<Component {...properties} />);`;
    const returnText = `if(${CHILDREN}.length) {
    ${RETURN} (<Component {...properties}>{${CHILDREN}}</Component>);
  }
  ${RETURN} (<Component {...properties} />);
    `;

    const returnCause = isText ? returnText : returnGrid;

    let baseImage = '\n      properties.imageStyle = properties.style.slice() || {};\n';
    baseImage += `      properties.imageStyle.push({position: 'absolute'});`;

    const content = `${IMPORT_REACT};
${importFrom([isText ? TEXT_COMP : VIEW_COMP, isText ? IMAGE_COMP : IMAGE_BACKGROUND_COMP, SCROLL_VIEW_COMP, FLAT_LIST_COMP, TOUCHABLE_OPACITY_COMP, TEXT_INPUT_COMP])};
${importFrom([SVG_URI_COMP], 'react-native-svg')};
${importFrom(LINEAR_GRADIENT_COMP, 'react-native-linear-gradient')};
    
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
      if(transit.style && transit.style.width) {
        properties.width = transit.style.width;
      }
      if(transit.style && transit.style.height) {
        properties.height = transit.style.height;
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
      properties.source = {uri: transit.src};${!isText ? baseImage : ''}
    }
  } ${elseCause}
  
  ${returnCause}
}
    
${EXPORT_DEFAULT} ${name};`;
    this.zip.file(`${SRC_FOLDER}/${COMPONENTS_FOLDER}/${name}/${name}.js`, content);
  }

  navSpec2zip(title: string, map: Map<string, string[]>, isTabs?: boolean) {
    const nameSpaces: string[] = [];
    let content = IMPORT_REACT + ';\n';
    map.forEach(([controlId]) => {
      const cmp = this.source.getComponentByControlId(controlId);
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
    content += isTabs ? '  const {navigation, state} = props;\n' : '  const {navigation} = props;\n';
    content += `  const ${STORE_VARIABLE} = new ${STORE}(navigation);\n`;
    content += isTabs ?
      `  const property = ${STORE_VARIABLE}.baseProps(state.routes[state.index].params.componentId);\n` :
      `  const property = ${STORE_VARIABLE}.baseProps;\n`;
    content += componentContent;
    content += `}\nexport default ${title};`;
    this.zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${title}/${title}.js`, content);
    this.navSpecStore2zip(title, map, isTabs);
    this.navSpecInitState2zip(title, map);
  }

  navSpecInitState2zip(title: string, map: Map<string, string[]>) {
    const imports: string[] = [];
    let content = importFrom(PROPERTY_MODEL, `${APP_ROOT}/${MODELS_FOLDER}/${PROPERTY_MODEL}`) + ';\n';
    content += `const ${INIT_STATE} = [`;

    map.forEach(([specComponentId], screenId) => {
      this.source.storeContent.get(specComponentId)!.forEach(e => {
        if(e.id === specComponentId) {
          e.placeIndex = [0];
        }
        const nameSpace = this.source.components.get(e.hash)!.nameSpace;
        !imports.includes(nameSpace) && imports.push(nameSpace);
        content += `\n  new ${PROPERTY_MODEL}(${e.toString(nameSpace as unknown as React.FC)}),`;
      });
    });
    content += `\n]\nexport default ${INIT_STATE};`;
    content = contentString(content, imports);
    this.zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${title}/${INIT_STATE}.js`, content);
  }

  navSpecStore2zip(title: string, map: Map<string, string[]>, isTabs?: boolean) {
    let content = importFrom(INIT_STATE, `${APP_ROOT}/${NAVIGATION_FOLDER}/${title}/${INIT_STATE}`) + ';\n';
    content += importFrom(STORE_BASE, `${APP_ROOT}/${MODELS_FOLDER}/${STORE_BASE}`) + ';\n';
    content += importFrom(APP_STORE, `${APP_ROOT}/${MODELS_FOLDER}/${APP_STORE}`) + ';\n';
    content += `\nclass ${STORE} extends ${STORE_BASE} {\n`;
    content += `  baseComponent = {\n`;
    map.forEach(([componentId], stateId) => {
      content += `    '${stateId}': '${componentId}',\n`;
    });
    content += '  };\n';

    content += isTabs ? '  baseProps(id) {\n' : '  get baseProps() {\n';
    content += isTabs ?
      `    return this.props(this.baseComponent[id] || '${Array.from(map.values())[0][0]}');\n` :
      `    return this.props(this.baseComponent[${APP_STORE}.${SCREEN_ID_VARIABLE}] || '${Array.from(map.values())[0][0]}');\n`;
    content += '  }\n';

    content += `  constructor(${NAVIGATION_VARIABLE}) {\n`;
    content += `    super(${INIT_STATE}, ${NAVIGATION_VARIABLE});\n`;
    content += '  }\n';

    content += `}\nexport default ${STORE};`;
    this.zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${title}/${STORE}.js`, content);
  }

  storeBase2zip() {
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
    content += '        this.navigation.openDrawer();\n';
    content += '      }\n';
    content += `      if(type === '${RIGHT_DRAWER}') {\n`;
    content += '        const dispatcher = \n';
    content += '          this.navigation.dangerouslyGetParent().dangerouslyGetParent() || this.navigation.dangerouslyGetParent();\n';
    content += '        dispatcher.openDrawer();\n';
    content += '      }\n';
    content += '    } else {\n';
    content += `      this.${PROPERTIES_VARIABLE}[entry[1]] && this.${PROPERTIES_VARIABLE}[entry[1]].addStyle(entry[2]);\n`;
    content += '    }\n';
    content += '  }\n';

    content += '  disableStyle(entry) {\n';
    content += `    const type = ${NAV_COMPONENTS}[entry[1]];\n`;
    content += '    if(type) {\n';
    content += `      if(['${LEFT_DRAWER}', '${RIGHT_DRAWER}'].includes(type)) {\n`;
    content += '        this.navigation.closeDrawer();\n';
    content += '      }\n';
    content += '    } else {\n';
    content += `      this.${PROPERTIES_VARIABLE}[entry[1]] && this.${PROPERTIES_VARIABLE}[entry[1]].removeStyle(entry[2]);\n`;
    content += '    }\n';
    content += '  }\n';

    content += '  toggleStyle(entry) {\n';
    content += `    const type = ${NAV_COMPONENTS}[entry[1]];\n`;
    content += '    if(type) {\n';
    content += `      if(['${LEFT_DRAWER}', '${RIGHT_DRAWER}'].includes(type)) {\n`;
    content += '        this.navigation.toggleDrawer();\n';
    content += '      }\n';
    content += '    } else {\n';
    content += `      this.${PROPERTIES_VARIABLE}[entry[1]] && this.${PROPERTIES_VARIABLE}[entry[1]].toggleStyle(entry[2]);\n`;
    content += '    }\n';
    content += '  }\n';

    content += '  @action onPress(property) {\n';
    content += '    let l = property.action.length, i = 0;\n';
    content += '    while(l--) {\n';
    content += '      const entry = property.action[i++];\n';
    content += '      switch(entry[0]) {\n';
    content += `        case '${NAVIGATE_TO}':\n`;
    content += `          ${SCREENS_LIST}[entry[1]] && this.${NAVIGATION_VARIABLE}.navigate(${SCREENS_LIST}[entry[1]], {${COMPONENT_ID}: entry[1]});\n`;
    content += `          ${BREAK};\n`;
    content += `        case '${ENABLE_STYLE}':\n`;
    content += `          this.enableStyle(entry);\n`;
    content += `          ${BREAK};\n`;
    content += `        case '${DISABLE_STYLE}':\n`;
    content += `          this.disableStyle(entry);\n`;
    content += `          ${BREAK};\n`;
    content += `        case '${TOGGLE_STYLE}':\n`;
    content += `          this.toggleStyle(entry);\n`;
    content += `          ${BREAK};\n`;
    content += '      }\n';
    content += '    }\n';
    content += '  }\n';

    content += '  dispose() {}\n';

    content += `}\nexport default ${STORE_BASE};`;
    this.zip.file(`${SRC_FOLDER}/${MODELS_FOLDER}/${STORE_BASE}.js`, content);
  }

  prepareStack(screenNames: { id: string; title: string }[]) {
    let stacks = '';

    const direction = this.source.store.navigation[2];
    let navDirection = '';
    if(direction === AnimationDirectionEnum.TOP) {
      navDirection += `, ...TransitionPresets[Platform.OS === 'ios' ? 'ModalSlideFromBottomIOS' : 'RevealFromBottomAndroid']`;
    }

    screenNames.forEach(screenName => {
      stacks += '      <Stack.Screen\n';
      stacks += `        name="${screenName.title}"\n`;
      stacks += `        options={{headerShown: false${navDirection}}}\n`;
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
    if(this.source.leftDrawer.size || this.source.rightDrawer.size) {
      singleDrawerNavContent += `\nfunction ${this.source.leftDrawer.size > 0 && this.source.rightDrawer.size === 0 ? 'DrawerNavigation' : 'LeftDrawerNavigation'}() {\n`;
      singleDrawerNavContent += '  return (\n';
      singleDrawerNavContent += '    <Drawer.Navigator\n';
      singleDrawerNavContent += `      drawerStyle={{width: '${this.source.leftDrawer.size > 0 ? this.source.leftDrawerWidth : this.source.rightDrawerWidth}'}}\n`
      singleDrawerNavContent += this.source.leftDrawer.size ? '' : '      drawerPosition="right"\n';
      singleDrawerNavContent += `      drawerContent={(props) => <${this.source.leftDrawer.size ? LEFT_DRAWER : RIGHT_DRAWER} {...props} />}>\n`;
      singleDrawerNavContent += '      <Stack.Screen name="StackNavigation" component={StackNavigation} />\n';
      singleDrawerNavContent += '    </Drawer.Navigator>\n';
      singleDrawerNavContent += '  );\n';
      singleDrawerNavContent += '}\n\n';
      if(this.source.leftDrawer.size && this.source.rightDrawer.size) {
        singleDrawerNavContent += 'function DrawerNavigation() {\n';
        singleDrawerNavContent += '  return (\n';
        singleDrawerNavContent += '    <Drawer.Navigator\n';
        singleDrawerNavContent += `      drawerStyle={{width: '${this.source.rightDrawerWidth}'}}\n`
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
    if(this.source.tab.size) {
      const [inDrawer, outOfDrawer] = this.source.tabScreens;
      tabNavContent += 'function TabNavigation() {\n';
      tabNavContent += '  return (\n';
      tabNavContent += '    <Tab.Navigator tabBar={props => <Tabs {...props} />}>\n';
      if(inDrawer.length) {
        tabNavContent += `      <Tab.Screen name="DrawerNavigation"\n`;
        tabNavContent += `        component={DrawerNavigation}\n`;
        tabNavContent += `        initialParams={{componentId: '${inDrawer[0]}'}} />\n`;
      }
      outOfDrawer.forEach(screen => {
        const item = screenNames.find(e => e.id === screen);
        if(!item) return;
        tabNavContent += `      <Tab.Screen\n`;
        tabNavContent += `        name="${item!.title}"\n`;
        tabNavContent += `        component={${item!.title}}\n`;
        tabNavContent += `        initialParams={{componentId: '${screen}'}} />\n`;
      });
      tabNavContent += '    </Tab.Navigator>\n';
      tabNavContent += '  )\n';
      tabNavContent += '}\n';
    }
    return tabNavContent;
  }

  navigation2zip(screenNames: { id: string; title: string }[]) {

    let navigationContent = this.prepareStack(screenNames);

    navigationContent += this.prepareDrawerScreens();

    navigationContent += this.prepareTabScreens(screenNames);

    const navFunction = this.source.tab.size ? 'TabNavigation' : (this.source.leftDrawer.size || this.source.rightDrawer.size )
      ? 'DrawerNavigation' : 'StackNavigation';

    let content = IMPORT_REACT + ';\n';
    content += importFrom(['createStackNavigator', 'TransitionPresets'], '@react-navigation/stack') + ';\n';

    if(this.source.leftDrawer.size) {
      content += importFrom(['createDrawerNavigator'], '@react-navigation/drawer') + ';\n';
      content += importFrom(LEFT_DRAWER, `${APP_ROOT}/${NAVIGATION_FOLDER}/${LEFT_DRAWER}/${LEFT_DRAWER}`) + ';\n';
    }
    if(this.source.rightDrawer.size) {
      content += importFrom(RIGHT_DRAWER, `${APP_ROOT}/${NAVIGATION_FOLDER}/${RIGHT_DRAWER}/${RIGHT_DRAWER}`) + ';\n';
    }
    if(this.source.tab.size) {
      content += importFrom(['createBottomTabNavigator'], '@react-navigation/bottom-tabs') + ';\n';
      content += importFrom(TABS, `${APP_ROOT}/${NAVIGATION_FOLDER}/${TABS}/${TABS}`) + ';\n';
    }
    screenNames.forEach(screenName =>
      (content += importFrom(screenName.title, `${APP_ROOT}/${SCREENS_FOLDER}/${screenName.title}/${screenName.title}`) + ';\n'));

    content += '\nconst Stack = createStackNavigator();\n';
    if(this.source.leftDrawer.size || this.source.rightDrawer.size) {
      content += 'const Drawer = createDrawerNavigator();\n';
    }

    if(this.source.tab.size) {
      content += 'const Tab = createBottomTabNavigator();\n';
    }

    content += navigationContent;

    content += `export default ${navFunction};`;
    this.zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/AppNavigator.js`, content);
  }

  screens2zip(screenNames: { id: string; title: string }[]) {
    let content = `const ${SCREENS_LIST} = {\n`;
    screenNames.map(e => content += `  '${e.id}': '${e.title}',\n`);
    content += `};\nexport default ${SCREENS_LIST};`;
    this.zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${SCREENS_LIST}.js`, content);
  }

  specNavComponents2zip() {
    let content = `const ${NAV_COMPONENTS} = {\n`;
    if(this.source.leftDrawer.size) {
      this.source.leftDrawer.forEach((([drawerId]) => {
        content += `  '${drawerId}': '${LEFT_DRAWER}',\n`;
      }));
    }
    if(this.source.rightDrawer.size) {
      this.source.rightDrawer.forEach((([drawerId]) => {
        content += `  '${drawerId}': '${RIGHT_DRAWER}',\n`;
      }));
    }
    if(this.source.tab.size) {
      this.source.tab.forEach((([drawerId]) => {
        content += `  '${drawerId}': '${TABS}',\n`;
      }));
    }
    content += `};\nexport default ${NAV_COMPONENTS};`;
    this.zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/${NAV_COMPONENTS}.js`, content);
  }

  app2zip() {
    let content = `import 'mobx-react-lite/batchingForReactNative';\n`;
    content += IMPORT_REACT + ';\n';

    const statusBar = this.source.store.statusBarEnabled ?
      `<StatusBar barStyle="${this.source.store.mode === Mode.DARK ? 'light-content' : 'dark-content'}" backgroundColor="${this.source.store.statusBarColor}" />`
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
  dark: ${this.source.store.mode === Mode.DARK},
  colors: {
    ...DefaultTheme.colors,
    background: '${this.source.store.background.backgroundColor}',
  },
};
    
function App() {
  return (
    <NavigationContainer theme={theme}>
      ${statusBar}
      <SafeAreaView style={{flex: 1, backgroundColor: "${this.source.store.statusBarColor}"}}>
        <AppContainer />
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;`;
    this.zip.file(`${SRC_FOLDER}/App.js`, content);
  }

  appStore2zip(screenNames: { id: string; title: string }[]) {
    const screenId = screenNames[0].id;
    let content = `class ${APP_STORE} {\n`;
    content += `  ${SCREEN_ID_VARIABLE} = "${screenId}";\n\n`;
    content += `  setScreen(${SCREEN_ID_VARIABLE}) {\n`;
    content += `    this.${SCREEN_ID_VARIABLE} = ${SCREEN_ID_VARIABLE};\n`;
    content += '  }\n\n';
    content += `}\nexport default new ${APP_STORE}()`;
    this.zip.file(`${SRC_FOLDER}/${MODELS_FOLDER}/${APP_STORE}.js`, content);
  }

  transitStyle2zip() {
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
    this.zip.file(`${SRC_FOLDER}/${MODELS_FOLDER}/${TRANSIT_STYLE_MODEL}.js`, content);
  }

  controlProperty2Zip() {
    let content = importFrom(['observable', 'action', 'computed'], 'mobx') + ';\n';
    content += importFrom('TransitStyle', `${APP_ROOT}/${MODELS_FOLDER}/${TRANSIT_STYLE_MODEL}`) + ';\n';
    content += `\nclass ${PROPERTY_MODEL} {\n`;
    content += '  id;\n';
    content += '  path;\n';
    content += '  styleId;\n';
    content += '  action;\n';
    content += '  title;\n';
    content += '  transitStyles;\n';
    content += '  placeIndex;\n';
    content += '  component;\n';
    content += '  meta;\n';
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

    content += '  constructor({id, title, path, styleId, action, classes, text, transitStyles, placeIndex, meta, component}) {\n';
    content += '    this.id = id;\n';
    content += '    this.path = path;\n';
    content += '    this.styleId = styleId;\n';
    content += '    this.action = action;\n';
    content += '    this.classes = classes;\n';
    content += '    this.title = title;\n';
    content += '    this.text = text;\n';
    content += '    this.placeIndex = placeIndex;\n';
    content += '    this.meta = meta;\n';
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

    content += '  @action setText(value) {\n';
    content += '    this.text = value;\n';
    content += '  }\n';

    content += `}\nexport default ${PROPERTY_MODEL};`;
    this.zip.file(`${SRC_FOLDER}/${MODELS_FOLDER}/${PROPERTY_MODEL}.js`, content);
  }

  initState2zip(path: string, stateContent: IStoreContent[]) {
    const imports: string[] = [];
    let content = importFrom(PROPERTY_MODEL, `${APP_ROOT}/${MODELS_FOLDER}/${PROPERTY_MODEL}`) + ';\n';

    content += `\nconst ${INIT_STATE} = [`;
    content += stateContent.map(e => {
      const nameSpace = this.source.components.get(e.hash)!.nameSpace;
      !imports.includes(nameSpace) && imports.push(nameSpace);
      const string = `\n  new ${PROPERTY_MODEL}(${e.toString(nameSpace as unknown as React.FC)})`;
      return string;
    });
    content += `];\nexport default ${INIT_STATE};`;

    const contentWithImports = contentString(content, imports);
    this.zip.file(`${path}/${INIT_STATE}.js`, contentWithImports);
  }

  screenStore2zip(title: string) {
    let content = importFrom(['action'], 'mobx') + ';\n';
    content += importFrom(INIT_STATE, `${APP_ROOT}/${SCREENS_FOLDER}/${title}/${INIT_STATE}`) + ';\n';
    content += importFrom(STORE_BASE, `${APP_ROOT}/${MODELS_FOLDER}/${STORE_BASE}`) + ';\n';
    content += importFrom(APP_STORE, `${APP_ROOT}/${MODELS_FOLDER}/${APP_STORE}`) + ';\n';
    content += `\nclass ${STORE} extends ${STORE_BASE} {\n\n`;
    content += `  ${COMPONENT_ID};\n`;
    content += '  unsubscribeFocus;\n';

    content += `  constructor(${NAVIGATION_VARIABLE}, ${COMPONENT_ID}) {\n`;
    content += `    super(${INIT_STATE}, ${NAVIGATION_VARIABLE});\n`;
    content += `    this.${COMPONENT_ID} = ${COMPONENT_ID};\n`;
    content += '    this.subscribe();\n';
    content += '  }\n\n';

    content += '  subscribe() {\n';
    content += `    this.unsubscribeFocus = this.${NAVIGATION_VARIABLE}.addListener('focus', () => {\n`;
    content += `      ${APP_STORE}.setScreen(this.${COMPONENT_ID})`;
    content += '    });\n';
    content += '  }\n';

    content += '  dispose = () => {\n';
    content += '    this.unsubscribeFocus && this.unsubscribeFocus();\n';
    content += '  }\n';

    content += `}\nexport default ${STORE};`;
    this.zip.file(`${SRC_FOLDER}/${SCREENS_FOLDER}/${title}/${STORE}.js`, content);
  }
}

export default ZipGenerator;
