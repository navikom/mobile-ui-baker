import { getPropertyName, getStylesForProperty } from 'css-to-react-native';
import { findStem } from 'utils/string';
import {
  APP_ROOT,
  COMPONENTS_FOLDER,
  EXPORT_DEFAULT,
  FUNCTION, BASE_COMP,
  IMPORT_REACT,
  IMPORT_STYLES,
  RETURN,
  STYLE_SHEET,
  STYLES,
  TEXT_BASE_COMP,
  STORE_VARIABLE, PROPS_VARIABLE,
} from '../Constants';
import { ControlEnum } from 'enums/ControlEnum';
import { importFrom } from '../utils';
import {
  blockStyle,
  ignoreStyle,
  metaRules,
  ruleValidator,
  specificRules,
  valueModifier
} from './ReactNativeStyleDictionary';
import IGenerateComponent from 'interfaces/IGenerateComponent';
import IControl from 'interfaces/IControl';
import IGenerateService from 'interfaces/IGenerateService';

type ObjectType = { [key: string]: string | number | boolean | undefined | null };

class GenerateComponent implements IGenerateComponent {
  generator: IGenerateService;
  controls: IControl[] = [];
  componentString = '';
  styles: Map<string, { [key: string]: any }> = new Map<string, { [key: string]: any }>();
  controlsMap: Map<string, IControl> = new Map<string, IControl>();
  depth: number;
  hash: string;
  nameSpace: string;

  constructor(generator: IGenerateService, depth: number, hash: string) {
    this.generator = generator;
    this.depth = depth;
    this.hash = hash;
    this.nameSpace = 'Component' + depth;
  }

  rnStylesJSON(control: IControl) {
    const array = control.cssStylesJSON;
    const styles: { [key: string]: any } = {};
    array.forEach(entry => {
      const k = entry[0] as string;
      styles[k] = control.type === ControlEnum.Text && !control.hasImage ? { fontSize: 17 } : {};
      const overflow = (entry[1] as unknown as ObjectType[]).find(e => e.key === 'overflow');
      const overflowX = (entry[1] as unknown as ObjectType[]).find(e => e.key === 'overflowX');
      const overflowY = (entry[1] as unknown as ObjectType[]).find(e => e.key === 'overflowY');
      (entry[1] as unknown as { [key: string]: string | number }[]).forEach(item => {
        if (blockStyle.includes(item.key as string)) {
          return;
        }
        if (ignoreStyle[item.key as 'alignItems'] && ignoreStyle[item.key as 'alignItems'](overflow, overflowX, overflowY)) {
          return;
        }

        let rule = specificRules[item.key as 'display'] && specificRules[item.key as 'display'](item, control);
        if (!rule) {
          const modifiedValue = valueModifier(item);
          try {
            const propName = getPropertyName(item.key);

            const value = item.unit ? modifiedValue.toString() + item.unit : modifiedValue.toString();
            rule = getStylesForProperty(propName, value);
            const invalid = ruleValidator(item, control);
            invalid && this.generator.addToTransitionErrors(invalid);
          } catch (e) {
            this.generator.addToTransitionErrors(
              'Control #' + control.id + ' style "' + item.key + '"  error: ' + e.message + '.'
            )
          }
        }
        rule && Object.assign(styles[k], rule);
      });
    });

    return metaRules[control.meta](styles);
  }

  addControl(control: IControl) {
    this.controls.push(control);
    const hashStyle = control.hashChildrenWithStyle as string;
    if (!this.styles.has(hashStyle)) {
      this.styles.set(hashStyle, this.rnStylesJSON(control));
    }
    this.controlsMap.set(control.id, control);
  }

  generateNameSpace(cb: (name: string) => string) {
    const stem = findStem(
      this.controls.map(c => c.title.replace(/\s/g, '')).filter(s => s && s.length > 2)
    );
    this.nameSpace =
      cb(stem && stem.length > 2 ? 'Component' + stem.charAt(0).toUpperCase() + stem.slice(1) : this.nameSpace);
  }

  stylesString() {
    let content = importFrom([STYLE_SHEET]) + ';\n';
    content += `\nconst styles = {\n`;
    this.styles.forEach((value, key) => {
      content += `  "${key}": ${STYLE_SHEET}.create(` + JSON.stringify(value, null, 2) + '),\n';
    });
    content += `};\nexport default styles;`;
    return content;
  }

  generateComponentString() {
    const isText = this.controls[0].type === ControlEnum.Text;
    const comp = isText ? TEXT_BASE_COMP : BASE_COMP;
    const isObservable = this.controls.find(c => c.cssStyles.size > 1);
    const classes = isObservable ? `const classes = ${PROPS_VARIABLE}.classes.toJS();` : '';

    const content = `${IMPORT_REACT};
${importFrom(comp, APP_ROOT + '/' + COMPONENTS_FOLDER + '/' + comp + '/' + comp)};
${IMPORT_STYLES} '${APP_ROOT}/${COMPONENTS_FOLDER}/${this.nameSpace}/${STYLES}';
    
${FUNCTION} ${this.nameSpace}({${STORE_VARIABLE}, ${PROPS_VARIABLE}}) {
  ${classes}
  ${RETURN} (<${comp} ${STORE_VARIABLE}={${STORE_VARIABLE}} ${PROPS_VARIABLE}={${PROPS_VARIABLE}} ${STYLES}={${STYLES}} />);
}
    
${EXPORT_DEFAULT} ${this.nameSpace};`;

    return content;
  }

  toString() {
    return `{
      hash: ${this.hash},
      depth: ${this.depth},
      nameSpace: ${this.nameSpace},
      controls: ${this.controls},
      styles: ${this.styles.size}
    }`;
  }
}

export default GenerateComponent;
