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
  STORE_VARIABLE, PROPS_VARIABLE, DIMENSIONS, ASSETS_FOLDER,
} from '../Constants';
import { ControlEnum } from 'enums/ControlEnum';
import { importFrom } from '../utils';
import {
  blockStyle, withVariable,
  ignoreStyle,
  metaRules,
  ruleValidator,
  specificRules, variableProps,
} from './ReactNativeStyleDictionary';
import IGenerateComponent from 'interfaces/IGenerateComponent';
import IControl from 'interfaces/IControl';
import IGenerateService from 'interfaces/IGenerateService';
import { DEVICE_HEIGHT, DEVICE_WIDTH } from 'models/Constants';

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
  hasDeviceWidth = false;
  hasDeviceHeight = false;
  hasColors = false;

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

        if(!this.hasDeviceHeight && item.unit === DEVICE_HEIGHT) {
          this.hasDeviceHeight = true;
        }

        if(!this.hasDeviceWidth && item.unit === DEVICE_HEIGHT) {
          this.hasDeviceWidth = true;
        }

        let rule = specificRules[item.key as 'display'] && specificRules[item.key as 'display'](item, control);
        if (!rule) {
          const modifiedValue = item.value;
          try {
            const propName = getPropertyName(item.key);

            const value = item.unit ? [DEVICE_WIDTH, DEVICE_HEIGHT].includes(item.unit as string) ?
              modifiedValue + (item.unit === DEVICE_WIDTH ? '_width' : '_height')
              : modifiedValue.toString() + item.unit :
              modifiedValue.toString();
            rule = withVariable(getStylesForProperty(propName, value)) as {};
            const invalid = ruleValidator(item, control);
            invalid && this.generator.addToTransitionErrors(invalid);
          } catch (e) {
            this.generator.addToTransitionErrors(
              'Control #' + control.id + ' style "' + item.key + '"  error: ' + e.message + '.'
            )
          }
        }
        if(rule && !this.hasColors && JSON.stringify(rule).includes('[')) {
          this.hasColors = true;
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
    const dependencies = [STYLE_SHEET];
    let dimension;
    if(this.hasDeviceHeight || this.hasDeviceWidth) {
      dependencies.push(DIMENSIONS);
      dimension = '\nconst {';
      this.hasDeviceHeight && (dimension += `height`);
      this.hasDeviceWidth && (dimension += this.hasDeviceHeight ? `, width` : `width`);
      dimension += `} = ${DIMENSIONS}.get('window');\n`;
    }

    let content = importFrom(dependencies) + ';\n';
    if(this.hasColors) {
      content += importFrom('colors', `${APP_ROOT}/${ASSETS_FOLDER}/colors.js`) + ';\n';
    }

    dimension && (content += dimension);
    content += `\nconst styles = {\n`;
    this.styles.forEach((value, key) => {
      content += `  "${key}": ${STYLE_SHEET}.create({\n`;
      Object.keys(value).forEach(k => {
        content += `    "${k}": {\n`;
        Object.keys(value[k]).forEach(j => {
          let val = value[k][j];
          val = val.toString().includes('_width') ?
            `${val.toString().split('_')[0]} * width` :
            val.toString().includes('_height') ?
              `${val.toString().split('_')[0]} * height` : val;

          let obj;
          if(value[k][j].toString().includes('{')) {
            obj = '{\n';
            const objs = [];
            Object.keys(value[k][j]).forEach(f => {
              objs.push(`  ${f}: ${JSON.stringify(value[k][j])}`)
            });
            obj += '}\n';
          }
          content +=
            `      ${j}: ${value[k][j].toString().includes('_') || value[k][j].toString().includes('colors[') ? val : JSON.stringify(val)},\n`;
        });
        content += '    },\n';
      });
      content += '  }),\n';
    });
    content += `};\nexport default styles;`;
    return content;
  }

  generateComponentString() {
    const isText = this.controls[0].type === ControlEnum.Text && (this.controls[0].title.length || this.controls[0].hasImage);
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
