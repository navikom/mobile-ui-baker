import ICSSProperty from 'interfaces/ICSSProperty';
import IControl from 'interfaces/IControl';


export const blockStyle = ['transition', 'background', 'backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition',
  'mask', 'maskImage', 'maskRepeat', 'transition', 'transitionProperty', 'transitionDuration', 'transitionTimingFunction',
  'transitionDelay'];

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
      return { width: '100%', flexDirection: 'row' }
    }
    return {};
  },
  backgroundColor: (rule: { [key: string]: any }, control: IControl) => {
    if (!control.hasSVG) {
      return { backgroundColor: rule.value }
    }
    return {};
  }
}

const clearDrawerStyles = (styles: {[key: string]: any}) => {
  const keys = Object.keys(styles);
  let l = keys.length;
  while (l--) {
    const k = keys[l];
    ['position', 'width', 'height', 'top', 'left', 'bottom', 'right', 'overflow'].forEach(rule => {
      if({}.propertyIsEnumerable.call(styles[k], rule)) {
        delete styles[k][rule];
      }
    });
    Object.assign(styles[k], {flex: 1});
    Object.assign(styles.Main, styles[k]);
  }
  return styles;
}

export const metaRules = {
  leftDrawer: clearDrawerStyles,
  rightDrawer: clearDrawerStyles,
  tabs: (styles: { [key: string]: any }) => {
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
};
