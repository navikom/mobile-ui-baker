import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import IMobileUIView from 'interfaces/IMobileUIView';
import IControl from 'interfaces/IControl';
import IGenerateComponent from 'interfaces/IGenerateComponent';
import GenerateComponent from './GenerateComponent';
import { uniqueNameDefinition } from 'utils/string';
import {
  ACTIVE_STYLES,
  APP_ROOT,
  BASE_COMP,
  CHILDREN,
  CHILDREN_LIST,
  COMPONENT_ID,
  COMPONENTS_FOLDER,
  EXPORT_DEFAULT,
  FLAT_LIST_COMP,
  FUNCTION,
  IMAGE_BACKGROUND_COMP,
  IMAGE_COMP,
  IMPORT_REACT,
  LINEAR_GRADIENT_COMP,
  NAVIGATION_FOLDER,
  ON_PRESS,
  RETURN,
  SCREENS_FOLDER,
  SCROLL_VIEW_COMP,
  SRC_FOLDER,
  STYLE_ID,
  STYLES,
  SVG_URI_COMP,
  TEXT_BASE_COMP,
  TEXT_COMP,
  TOUCHABLE_OPACITY_COMP,
  TRANSIT_STYLE,
  VIEW_COMP
} from './Constants';
import { importFrom } from './utils';
import { Mode } from 'enums/ModeEnum';
import IScreenStoreContent from '../../interfaces/IScreenStoreContent';
import ScreenStoreContent from './ScreenStoreContent';
import { ControlEnum } from '../../enums/ControlEnum';

class GenerateService {
  store: IMobileUIView;
  components: Map<string, IGenerateComponent> = new Map<string, IGenerateComponent>();
  navigation: IControl[] = [];
  tab: IControl[] = [];
  leftDrawer: IControl[] = [];
  rightDrawer: IControl[] = [];
  nameSpaces: string[] = [];
  screenStoreContent: Map<string, Map<string, IScreenStoreContent>> = new Map<string, Map<string, IScreenStoreContent>>();

  constructor(store: IMobileUIView) {
    this.store = store;
  }

  generateRN() {
    this.store.screens.forEach(screen => screen.setChecksum(0, [], (depth: number, control: IControl) => {
      if(!this.screenStoreContent.has(screen.id)) {
        this.screenStoreContent.set(screen.id, new Map());
      }
      const actions = control.actions.toJS();
      const img = control.hasImage;
      let store;
      if(img) {
        store =
          new ScreenStoreContent(control.id as string, control.path as string[], control.classes, control.sources);
      } else if(actions && actions.length) {
        store =
          new ScreenStoreContent(control.id as string, control.path as string[], control.classes, undefined, actions);
      } else if(control.type === ControlEnum.Text) {
        store =
          new ScreenStoreContent(control.id as string, control.path as string[], control.classes, undefined, undefined, control.title);
      }
      console.log(control.title, depth, actions, img);
      store && this.screenStoreContent.get(screen.id)!.set(control.id, store);
      (actions.length || img) && console.log('==============', img ? 'image' : 'actions', control.path);
    }));

    let traverse: (controls: IControl[]) => void;
    (traverse = (controls: IControl[]) => {

      controls.forEach(child => {
        const hash = child.hashChildren as string;
        if (!this.components.has(hash)) {
          this.components.set(hash, new GenerateComponent(this.components.size, hash));
        }
        this.components.get(hash)!.addControl(child);

        traverse(child.children);
      });

    })(this.store.screens);

    this.defineNames();
    this.components2zip();
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
    this.store.screens.forEach((screen: IControl) =>
      !screenHashes.includes(screen.hashChildren as string) && screenHashes.push(screen.hashChildren as string));
    this.components.forEach((cmp, hash) => {
      if (screenHashes.includes(hash)) {
        cmp.controls.forEach((control) => {
          const title = this.approveNameSpace('Screen' + control.title.replace(/\s/g, ''));
          this.screen2zip(zip, cmp, title);
          screenNames.push({id: control.id, title});
        });
      }
      this.component2zip(zip, cmp, COMPONENTS_FOLDER, cmp.nameSpace);
    });
    this.baseComponent2zip(zip, true);
    this.baseComponent2zip(zip, false);
    this.navigation2zip(zip, screenNames);
    this.app2zip(zip);
    // this.generateZip(zip);
  }

  async generateZip(zip: JSZip) {
    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${this.store.project.title.length ? this.store.project.title : 'Project'}.zip`);
    } catch (err) {
      console.log(err.message);
    }
  }

  screen2zip(zip: JSZip, cmp: IGenerateComponent, title: string) {
    let content = IMPORT_REACT + ';\n';
    content += importFrom(cmp.nameSpace, `${APP_ROOT}/${COMPONENTS_FOLDER}/${cmp.nameSpace}/${cmp.nameSpace}`) + ';\n';

    content += `\n${FUNCTION} ${title}({navigation, route}) {\n`;
    content += `  return <${cmp.nameSpace} componentId={route.params.${COMPONENT_ID}} ${ACTIVE_STYLES}={["Main"]} />;\n`;
    content += `}\nexport default ${title};`;
    zip.file(`${SRC_FOLDER}/${SCREENS_FOLDER}/${title}/${title}.js`, content);
  }

  component2zip(zip: JSZip, cmp: IGenerateComponent, folder: string, name: string) {
    let content = cmp.generateChildren(hash => {
      return this.components.has(hash) ? this.components.get(hash)!.nameSpace : 'Unknown';
    });

    zip.file(`${SRC_FOLDER}/${folder}/${cmp.nameSpace}/${CHILDREN_LIST}.js`, content);

    content = cmp.stylesString();

    zip.file(`${SRC_FOLDER}/${folder}/${cmp.nameSpace}/${STYLES}.js`, content);
    content = cmp.generateComponentString();
    zip.file(`${SRC_FOLDER}/${folder}/${name}/${name}.js`, content);
  }

  baseComponent2zip(zip: JSZip, isText: boolean) {
    const name = isText ? TEXT_BASE_COMP : BASE_COMP;
    let onPress = `else {\n`;
    onPress += `    if(onPress) {\n`;
    onPress += `      props.onPress = () => { console.log(${COMPONENT_ID})};\n`;
    onPress += `      Component = ${TOUCHABLE_OPACITY_COMP};\n`;
    onPress += '    }\n';
    onPress += '  }'

    onPress = !isText ? onPress : '';
    const content = `${IMPORT_REACT};
${importFrom([isText ? TEXT_COMP : VIEW_COMP, isText ? IMAGE_COMP : IMAGE_BACKGROUND_COMP, SCROLL_VIEW_COMP, FLAT_LIST_COMP, TOUCHABLE_OPACITY_COMP])};
${importFrom([SVG_URI_COMP], 'react-native-svg')};
${importFrom([LINEAR_GRADIENT_COMP], 'react-native-linear-gradient')};
    
${FUNCTION} ${name}({${COMPONENT_ID}, ${STYLE_ID}, ${STYLES}, ${TRANSIT_STYLE}, ${ACTIVE_STYLES}, ${ON_PRESS}, ${CHILDREN}}) {
  const style = ${STYLES}[${STYLE_ID}];
  let Component = ${isText ? TEXT_COMP : VIEW_COMP};
  const props = {};
  const activeStyleKey = ${ACTIVE_STYLES}[${ACTIVE_STYLES}.length - 1];
  const transit = (${TRANSIT_STYLE} || []).find(e => e.className === activeStyleKey);
  
  props.style = style ? ${ACTIVE_STYLES}.map(entry => style[entry]) : {flex: 1};
  
  if(transit) {
    if(transit.isSvg) {
      Component = ${SVG_URI_COMP};
      props.uri = transit.src;
      if(transit.style && transit.style.color) {
        props.fill = transit.style.color;
      }
    } else if(transit.gradient) {
      Component = ${LINEAR_GRADIENT_COMP};
      Object.assign(props, transit.gradient.colorStops || {}, transit.gradient.orientation || {});
    } else if(transit.scroll) {
      Component = ${SCROLL_VIEW_COMP};
      if(transit.scroll.horizontal) {
        props.horizontal = true;
      }
    } else {
      Component = ${isText ? IMAGE_COMP : IMAGE_BACKGROUND_COMP};
      Object.assign(${isText ? 'props' : 'props.style'}, transit.style || {});
      props.source = {uri: transit.src};
    }
  } ${onPress}
  
  if(${CHILDREN}) {
    ${RETURN} (<Component {...props}>{${CHILDREN}}</Component>);
  }
  
  ${RETURN} (<Component {...props} />);
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
        initialParams={{ ${COMPONENT_ID}: "${screenName.id}" }}
      />\n`;
    });
    content += `    </Stack.Navigator>\n`;
    content += '  )\n';
    content += '}\nexport default AppContainer;';
    zip.file(`${SRC_FOLDER}/${NAVIGATION_FOLDER}/AppNavigator.js`, content);
  }

  app2zip(zip: JSZip) {
    let content = IMPORT_REACT + ';\n';

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
}

export default GenerateService;
