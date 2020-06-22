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
  CHILDREN_LIST, COMPONENT_ID,
  COMPONENTS_FOLDER, FUNCTION,
  IMPORT_REACT,
  NAVIGATION_FOLDER,
  SCREENS_FOLDER,
  SRC_FOLDER, STYLE_ID, STYLES
} from './Constants';
import { importFrom } from './utils';
import { Mode } from 'enums/ModeEnum';

class GenerateService {
  store: IMobileUIView;
  components: Map<string, IGenerateComponent> = new Map<string, IGenerateComponent>();
  navigation: IControl[] = [];
  tab: IControl[] = [];
  leftDrawer: IControl[] = [];
  rightDrawer: IControl[] = [];
  nameSpaces: string[] = [];

  constructor(store: IMobileUIView) {
    this.store = store;
  }

  generateRN() {
    this.store.screens.forEach(screen => screen.setChecksum(0, [], (depth: number, control: IControl) => {
      console.log(control.title, depth);
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
    this.navigation2zip(zip, screenNames);
    this.app2zip(zip);
    this.generateZip(zip);
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
