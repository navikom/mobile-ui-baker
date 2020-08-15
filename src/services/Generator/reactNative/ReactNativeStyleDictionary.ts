import ICSSProperty from 'interfaces/ICSSProperty';
import IControl from 'interfaces/IControl';
import { ControlEnum } from 'enums/ControlEnum';
import { ITransition, ObjectType } from 'interfaces/ITransitSyle';
import { getPropertyName, getStylesForProperty } from 'css-to-react-native';
import { MODE_DEVELOPMENT } from 'models/Constants';
import ColorsStore from 'models/ColorsStore';

export const blockStyle = ['transition', 'background', 'backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition',
  'mask', 'maskImage', 'maskRepeat', 'transition', 'transitionProperty', 'transitionDuration', 'transitionTimingFunction',
  'transitionDelay', 'overflowX', 'overflowY', 'whiteSpace'];

export const variableProps = ['color', 'backgroundColor', 'borderColor', 'borderLeftColor', 'borderRightColor',
  'borderTopColor', 'borderBottomColor'];

const overflowRule = (overflow?: { [key: string]: any }, overflowX?: { [key: string]: any }, overflowY?: { [key: string]: any }) => {
  if ((overflow && overflow.enabled) || (overflowX && overflowX.enabled) || (overflowY && overflowY.enabled)) {
    return true;
  }
  return false;
};

export const ignoreStyle = {
  alignItems: overflowRule,
  justifyContent: overflowRule
}

export const round = (value: number) => {
  let newValue = value * 1;
  if (newValue.toString().includes('.') && newValue.toString().split('.')[1].length > 3) {
    newValue = Math.round(newValue * 1000) / 1000;
  }
  return newValue;
}

const image = {
  backgroundRepeat: {
    'no-repeat': { resizeMode: 'cover' },
    'repeat': { resizeMode: 'repeat' },
    'space': { resizeMode: 'repeat' },
    'round': { resizeMode: 'repeat' }
  },
  backgroundSize: {
    '100% 100%': { resizeMode: 'stretch' },
    '100%': { resizeMode: 'cover' },
    'contain': { resizeMode: 'repeat' },
    'cover': { resizeMode: 'cover' },
  },
  backgroundPosition: {
    'center': { resizeMode: 'center' }
  },
}

export const specificRules = {
  display: (rule: { [key: string]: any }, control: IControl) => {
    if (rule.value === 'flex') {
      return { flexDirection: 'row' }
    }
    return {};
  },
  backgroundColor: (rule: { [key: string]: any }, control: IControl) => {
    if (!control.hasSVG) {
      return { backgroundColor: ColorsStore.getColorVariable(rule.value) }
    }
    return {};
  },
  borderBottom: (rule: { [key: string]: any }, control: IControl) => {
    const [width, style, ...rest] = rule.value.split(' ');
    const object = {
      borderBottomWidth: Number(width.replace(/\D/g, '')),
      borderBottomColor: ColorsStore.getColorVariable(rest.join(' ')),
      borderStyle: style
    }
    return object;
  },
  borderTop: (rule: { [key: string]: any }, control: IControl) => {
    const [width, style, ...rest] = rule.value.split(' ');
    const object = {
      borderTopWidth: Number(width.replace(/\D/g, '')),
      borderTopColor: ColorsStore.getColorVariable(rest.join(' ')),
      borderStyle: style
    }
    return object;
  },
  borderLeft: (rule: { [key: string]: any }, control: IControl) => {
    const [width, style, ...rest] = rule.value.split(' ');
    const object = {
      borderLeftWidth: Number(width.replace(/\D/g, '')),
      borderLeftColor: ColorsStore.getColorVariable(rest.join(' ')),
      borderStyle: style
    }
    return object;
  },
  borderRight: (rule: { [key: string]: any }, control: IControl) => {
    const [width, style, ...rest] = rule.value.split(' ');
    const object = {
      borderRightWidth: Number(width.replace(/\D/g, '')),
      borderRightColor: ColorsStore.getColorVariable(rest.join(' ')),
      borderStyle: style
    }
    return object;
  },
  borderRadius: (rule: { [key: string]: any }, control: IControl) => {
    const object: { borderRadius: number; overflow?: string } = {
      borderRadius: round(Number(rule.value))
    };
    control.type === ControlEnum.Text && (object.overflow = 'hidden');
    return object;
  },
};

export const valueModifier = (rule: { [key: string]: string | number }) => {
  if (!['boxShadow', 'border', 'borderLeft', 'borderRight', 'borderTop', 'borderBottom'].includes(rule.key as string)
    && (rule.unit === 'px' || rule.value.toString().includes('px'))) {
    let value = rule.value.toString();
    if (value.includes('px')) {
      const matches = rule.value.toString().match(/\d+px/g);
      const arr = [rule.value.toString()];
      (matches || []).forEach(substr => {
        const part = arr.pop();
        const [first, ...rest] = part!.split(substr);
        const substrings = [first, rest.join(substr)];
        const val = Number(substr.replace('px', ''));
        const newSubstr = `${round(val)}px`;
        arr.push(substrings[0], newSubstr, substrings[1]);

      });
      value = arr.join('');
    } else if (rule.unit === 'px') {
      value = round(Number(rule.value)).toString();
    }
    return value;
  } else if (['border', 'borderLeft', 'borderRight', 'borderTop', 'borderBottom'].includes(rule.key as string)) {
    const matches = rule.value.toString().match(/\d+px/g);
    const val = Number(matches![0].replace('px', ''));
    const newSubstr = `${round(val)}px`;
    return (rule.value as string).replace(matches![0], newSubstr);
  }
  return rule.value;
}

export const ruleValidator = (rule: { [key: string]: string | number }, control: IControl) => {
  let msg;
  switch (rule.key) {
    case 'borderRadius':
      if (rule.unit === '%') {
        msg =
          `Control #${control.id} error {borderRadius: '${rule.value}${rule.unit}'}. Percentage doesn't support for borderRadius in React Native.`;
      }
      break;
    case 'boxShadow':
      if (rule.value.toString().includes('rem')) {
        msg =
          `Control #${control.id} error {boxShadow: '${rule.value}'}. Rem doesn't support for boxShadow in React Native.`;
      }
      break;
  }
  return msg;
}

const clearDrawerStyles = (styles: { [key: string]: any }) => {
  const keys = Object.keys(styles);
  let l = keys.length;
  while (l--) {
    const k = keys[l];
    ['position', 'width', 'height', 'top', 'left', 'bottom', 'right', 'overflow'].forEach(rule => {
      if ({}.propertyIsEnumerable.call(styles[k], rule)) {
        delete styles[k][rule];
      }
    });
    Object.assign(styles[k], { flex: 1 });
    Object.assign(styles.Main, styles[k]);
  }
  return styles;
}

export const metaRules = {
  leftDrawer: clearDrawerStyles,
  rightDrawer: clearDrawerStyles,
  tabs: (styles: { [key: string]: any }) => {
    return styles;
  },
  input: (styles: { [key: string]: any }) => {
    return styles;
  },
  textArea: (styles: { [key: string]: any }) => {
    return styles;
  },
  component: (styles: { [key: string]: any }) => {
    return styles;
  },
  keyboard: (styles: { [key: string]: any }) => {
    return styles;
  }
}

export const reactNativeImage = {
  imageMode: (backgroundRepeat?: ICSSProperty, backgroundSize?: ICSSProperty, backgroundPosition?: ICSSProperty) => {
    if (backgroundRepeat && backgroundRepeat.enabled && backgroundRepeat.value === 'no-repeat' &&
      backgroundSize && backgroundSize.enabled && backgroundSize.value === 'contain' &&
      backgroundPosition && backgroundPosition.enabled && backgroundPosition.value === 'center') {
      return { resizeMode: 'contain' };
    }
    if (backgroundRepeat && backgroundRepeat.enabled && image.backgroundRepeat[backgroundRepeat.value as 'no-repeat']) {
      return image.backgroundRepeat[backgroundRepeat.value as 'no-repeat'];
    }

    if (backgroundSize && backgroundSize.enabled && image.backgroundSize[backgroundSize.value as 'cover']) {
      return image.backgroundSize[backgroundSize.value as 'cover'];
    }

    if (backgroundPosition && backgroundPosition.enabled && image.backgroundPosition[backgroundPosition.value as 'center']) {
      return image.backgroundPosition[backgroundPosition.value as 'center'];
    }

    return { resizeMode: 'stretch' };
  },
  svgMode: (width?: ICSSProperty, height?: ICSSProperty, backgroundColor?: ICSSProperty, color?: ICSSProperty) => {
    const style: { width: string | number; height: string | number; color?: string; fill?: string } =
      {
        width: width!.value,
        height: height!.value
      };
    if (backgroundColor && backgroundColor.enabled) {
      style.color = backgroundColor.value as string;
    } else {
      style.color = '#ffffff';
    }
    if (color && color.enabled) {
      style.fill = color.value as string;
    }
    return style;
  },
  size: (width: ICSSProperty, height: ICSSProperty) => {
    const style: { width?: string | number; height?: string | number } = {};
    if (width && width.enabled) {
      style.width = width.unit && (width.unit === 'px' ? width.value : width.value + width.unit);
    }
    if (height && height.enabled) {
      style.height = height.unit && (height.unit !== 'px' ? height.value : height.value + height.unit);
    }
    return style;
  }
};

const checkModifiedProperty = (item: ObjectType) => {
  let willModify: { key: string }[] = [];
  const propName = getPropertyName(item.key);
  try {
    const rule = getStylesForProperty(propName, item.unit ? `${item.value}${item.unit}` : item.value!.toString());
    willModify = Object.keys(rule).filter(e => ['borderWidth', 'borderColor'].includes(e)).map(e => ({ key: e }));
  } catch (err) {
    process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Check modified rules', item, err.message);
  }
  return willModify;
}

const allTransitionProperties = (style: ObjectType[], duration: number, easing?: string) => {
  const willModify: { key: string }[] = [];
  const propertyNames = style.filter(e => {
    const willModifyList = checkModifiedProperty(e);
    willModify.push(...willModifyList);
    return ['width', 'height', 'top', 'left', 'right', 'bottom', 'opacity', 'color', 'marginLeft', 'marginRight',
      'marginTop', 'marginBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'backgroundColor',
      'fontSize', 'lineHeight', 'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius',
      'borderBottomRightRadius']
      .includes(e.key as string)
  });
  return propertyNames.concat(willModify).map(e => easing ? { name: e.key, duration, easing } : { name: e.key, duration });
}

const transitionItem = (style: ObjectType[], name: string, durationString: string, easing?: string) => {
  const duration = durationString.includes('ms') ?
    Number(durationString.replace('ms', '')) :
    Number(durationString.replace('s', '')) * 1000;
  if (name === 'all') {
    return allTransitionProperties(style, duration, easing);
  } else {
    return [easing ? { name, duration, easing } : { name, duration }];
  }
}

export const transitionRule = (style: ObjectType[]) => {
  const transition = style.find(e => e.key === 'transition');
  const transitionProperty = style.find(e => e.key === 'transitionProperty');
  const rulesList: ITransition[] = [];
  if (transition && transition.enabled) {
    const roles = (transition.value as string).split(',');
    let l = roles.length, i = 0;
    while (l--) {
      const role = roles[i++];
      const [name, durationString, easing] = role.split(' ');
      rulesList.push(
        ...(transitionItem(style, name, durationString, easing) as ITransition[])
      );
    }
  }
  const transitionDuration = style.find(e => e.key === 'transitionDuration');

  if (transitionProperty && transitionProperty.enabled && transitionDuration && transitionDuration.enabled) {
    const name = transitionProperty.value as string;
    const durationString = `${transitionDuration.value}${transitionDuration.unit}`;
    const transitionTiming = style.find(e => e.key === 'transitionTimingFunction');
    rulesList.push(
      ...(transitionItem(
        style,
        name,
        durationString,
        transitionTiming && transitionTiming.enabled ? transitionTiming.value as string : undefined
      ) as ITransition[])
    );
  }
  return rulesList;
}

export const withVariable = (style: ObjectType) => {
  const keys = Object.keys(style);
  let l = keys.length;
  while (l--) {
    const key = keys[l];
    if(variableProps.includes(key)) {
      style[key] = ColorsStore.getColorVariable(style[key] as string);
      break;
    }
  }
  return style;
}
