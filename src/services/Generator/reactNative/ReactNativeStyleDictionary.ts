import ICSSProperty from 'interfaces/ICSSProperty';
import IControl from 'interfaces/IControl';
import { ControlEnum } from 'enums/ControlEnum';


export const blockStyle = ['transition', 'background', 'backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition',
  'mask', 'maskImage', 'maskRepeat', 'transition', 'transitionProperty', 'transitionDuration', 'transitionTimingFunction',
  'transitionDelay', 'overflowX', 'overflowY', 'whiteSpace'];

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
      return { backgroundColor: rule.value }
    }
    return {};
  },
  borderBottom: (rule: { [key: string]: any }, control: IControl) => {
    const values = rule.value.split(' ');
    const object = {
      borderBottomWidth: Number(values[0].replace(/\D/g, '')),
      borderBottomColor: values[2],
      borderStyle: values[1]
    }
    return object;
  },
  borderTop: (rule: { [key: string]: any }, control: IControl) => {
    const values = rule.value.split(' ');
    const object = {
      borderTopWidth: Number(values[0].replace(/\D/g, '')),
      borderTopColor: values[2],
      borderStyle: values[1]
    }
    return object;
  },
  borderLeft: (rule: { [key: string]: any }, control: IControl) => {
    const values = rule.value.split(' ');
    const object = {
      borderLeftWidth: Number(values[0].replace(/\D/g, '')),
      borderLeftColor: values[2],
      borderStyle: values[1]
    }
    return object;
  },
  borderRight: (rule: { [key: string]: any }, control: IControl) => {
    const values = rule.value.split(' ');
    const object = {
      borderRightWidth: Number(values[0].replace(/\D/g, '')),
      borderRightColor: values[2],
      borderStyle: values[1]
    }
    return object;
  },
  borderRadius: (rule: { [key: string]: any }, control: IControl) => {
    const object: { borderRadius: number; overflow?: string } = {
      borderRadius: rule.value
    };
    control.type === ControlEnum.Text && (object.overflow = 'hidden');
    return object;
  },
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
  svgMode: (width?: ICSSProperty, height?: ICSSProperty, backgroundColor?: ICSSProperty) => {
    const style: { width: string | number; height: string | number; color?: string } =
      { width: width!.value, height: height!.value };
    if (backgroundColor && backgroundColor.enabled) {
      style.color = backgroundColor.value as string;
    }
    return style;
  },
  size: (width: ICSSProperty, height: ICSSProperty) => {
    const style: { width?: string | number; height?: string | number } = {};
    if (width && width.enabled) {
      style.width = width.unit && width.unit !== 'px' ? width.value + width.unit : width.value;
    }
    if (height && height.enabled) {
      style.height = height.unit && height.unit !== 'px' ? height.value + height.unit : height.value;
    }
    return style;
  }
};
