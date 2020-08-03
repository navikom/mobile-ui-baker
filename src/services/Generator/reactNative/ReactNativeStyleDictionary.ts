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

export const round = (value: number) => {
  let newValue = value * 1.2;
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
