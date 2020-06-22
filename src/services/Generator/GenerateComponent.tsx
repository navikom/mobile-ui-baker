import { getPropertyName, getStylesForProperty } from 'css-to-react-native';
import { findStem } from 'utils/string';
import {
  ACTIVE_STYLES,
  APP_ROOT,
  CHILDREN_LIST,
  COMPONENT_ID,
  EXPORT_DEFAULT,
  FLAT_LIST_COMP,
  FUNCTION,
  IMAGE_BACKGROUND_COMP,
  IMAGE_COMP,
  IMPORT_CHILDREN,
  IMPORT_REACT,
  IMPORT_STYLES,
  IS_IMAGE,
  IS_SVG,
  LINEAR_GRADIENT_COMP,
  RETURN,
  SCROLL_VIEW_COMP,
  STYLE_ID,
  STYLE_SHEET,
  STYLES,
  SVG_URI_COMP,
  TEXT_COMP,
  TRANSIT_STYLE,
  VIEW_COMP
} from './Constants';
import { ControlEnum } from 'enums/ControlEnum';
import { importFrom } from './utils';
import GradientParser, { correctGradients } from 'utils/parseGradient';
import { blockStyle, reactNativeImage, specificRules } from './ReactNativeStyleDictionary';
import IGenerateComponent from 'interfaces/IGenerateComponent';
import IControl from 'interfaces/IControl';
import ITransitStyle from 'interfaces/ITransitSyle';

type ObjectType = { [key: string]: string | number | boolean | undefined | null };

class GenerateComponent implements IGenerateComponent {
  transitionErrors: string[] = [];
  controls: IControl[] = [];
  componentString = '';
  styles: Map<string, { [key: string]: any }> = new Map<string, { [key: string]: any }>();
  controlsMap: Map<string, IControl> = new Map<string, IControl>();
  depth: number;
  hash: string;
  nameSpace: string;

  constructor(depth: number, hash: string) {
    this.depth = depth;
    this.hash = hash;
    this.nameSpace = 'Component' + depth;
  }

  addToTransitionErrors(error: string) {
    this.transitionErrors.push(error);
  }

  clearTransitionErrors() {
    this.transitionErrors = [];
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
    return transitStyles;
  }

  rnStylesJSON(control: IControl) {
    const array = control.cssStylesJSON;
    const styles: {[key: string]: any} = {};
    array.forEach(entry => {
      const k = entry[0] as string;
      styles[k] = control.type === ControlEnum.Text && !control.hasImage ? {fontSize: 17} : {};
      (entry[1] as unknown as {[key: string]: string | number}[]).forEach(item => {
        if(blockStyle.includes(item.key as string)) {
          return;
        }
        let rule = specificRules[item.key as 'display'] && specificRules[item.key as 'display'](item, control);

        if(!rule) {
          try {
            const propName = getPropertyName(item.key);

            const value = item.unit ? item.value.toString() + item.unit : item.value;
            rule = getStylesForProperty(propName, value);
          } catch (e) {
            this.addToTransitionErrors(
              'Control #' + control.id + ' Error: ' + e.message
            )
          }

        }
        rule && Object.assign(styles[k], rule);
      });
    });
    return styles;
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
      this.controls.map(c => c.title.replace(/\s/g, '')).filter(s => s.length > 2)
    );
    this.nameSpace =
      cb(stem.length > 2 ? 'Component' + stem.charAt(0).toUpperCase() + stem.slice(1) : this.nameSpace);
  }

  generateChildren(getNameSpace: (hash: string) => string) {
    let l = this.controls.length, i = 0;
    const children: { [key: string]: string[] } = {};
    const components: string[] = [];
    while (l--) {
      const control = this.controls[i++];
      if (control.children.length || (control.type === ControlEnum.Text && control.title.length)) {

        if (control.type === ControlEnum.Grid) {
          children[control.id] = [];
          control.children.forEach((child => {
            const transitStyle = this.transitStyle(child);
            const nameSpace = getNameSpace(child.hashChildren as string);
            const props = [`${COMPONENT_ID}="${child.id}"`, `${STYLE_ID}="${child.hashChildrenWithStyle}"`,
              `${ACTIVE_STYLES}={${JSON.stringify(child.classes)}}`];
            transitStyle.length && props.push(`${TRANSIT_STYLE}={${JSON.stringify(transitStyle)}}`);
            children[control.id].push(
              `<${nameSpace} ${props.join(' ')} />`
            );
            !components.includes(nameSpace) && components.push(nameSpace);
          }))
        } else {
          !control.hasImage && (children[control.id] = [`"${control.title}"`]);
        }
      }
    }
    return this.childrenString(children, components);
  }

  stylesString() {
    let content = importFrom([STYLE_SHEET]) + ';\n';
    content += `\nconst styles = {\n`;
    this.styles.forEach((value, key) => {
      content += `  "${key}": ${STYLE_SHEET}.create(` + JSON.stringify(value, null, 4) + '),\n';
    });
    content += `};\nexport default styles`;
    return content;
  }

  childrenString(children: { [key: string]: string[] }, dependencies: string[]) {
    let content = `import React from 'react';\n`;
    dependencies.forEach(dependency => (content += `import ${dependency} from '${APP_ROOT}/components/${dependency}/${dependency}';\n`));
    content += `\nconst childrenList = {\n`;
    Object.keys(children).forEach(key => {
      content += `  "${key}": [\n`;
      content += '    ' + children[key].join(', ') + '\n';
      content += `  ],\n`;
    });
    content += `}\nexport default childrenList`;
    return content;
  }

  generateComponentString() {

    const isText = this.controls[0].type === ControlEnum.Text;

    const content = `${IMPORT_REACT};
${importFrom([isText ? TEXT_COMP : VIEW_COMP, isText ? IMAGE_COMP : IMAGE_BACKGROUND_COMP, SCROLL_VIEW_COMP, FLAT_LIST_COMP])};
${importFrom([SVG_URI_COMP], 'react-native-svg')};
${importFrom([LINEAR_GRADIENT_COMP], 'react-native-linear-gradient')};
${IMPORT_STYLES} '${APP_ROOT}/components/${this.nameSpace}/${STYLES}';
${IMPORT_CHILDREN} '${APP_ROOT}/components/${this.nameSpace}/${CHILDREN_LIST}';
    
${FUNCTION} ${this.nameSpace}({${COMPONENT_ID}, ${STYLE_ID}, ${TRANSIT_STYLE}, ${ACTIVE_STYLES}}) {
  const style = ${STYLES}[${STYLE_ID}];
  let Component = ${isText ? TEXT_COMP : VIEW_COMP};
  const props = {};
  const activeStyleKey = ${ACTIVE_STYLES}[${ACTIVE_STYLES}.length - 1];
  const transit = (${TRANSIT_STYLE} || []).find(e => e.className === activeStyleKey);
  const children = ${CHILDREN_LIST}[${COMPONENT_ID}];
  
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
  }
  
  if(children) {
    ${RETURN} (<Component {...props}>{children}</Component>);
  }
  
  ${RETURN} (<Component {...props} />);
}
    
${EXPORT_DEFAULT} ${this.nameSpace};`;

    return content;
  }

  generateTextComponentString() {
    return `${IMPORT_REACT};
${importFrom([TEXT_COMP, IMAGE_COMP])}
${IMPORT_STYLES} './${STYLES}';
${IMPORT_CHILDREN} './${CHILDREN_LIST}';
    
${FUNCTION} ${this.nameSpace}({${COMPONENT_ID}, ${STYLE_ID}, ${IS_IMAGE}, ${IS_SVG}}) {
  const style = ${STYLES}[${STYLE_ID}];
  const children = ${CHILDREN_LIST}[${COMPONENT_ID}];
  const component = ${IS_IMAGE} ? ${IMAGE_COMP} : ${TEXT_COMP};
      
  ${RETURN} (<component style={style}>{children}</component>);
}
    
${EXPORT_DEFAULT} ${this.nameSpace};`;
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
