import ITransitStyle, { ITransition } from 'interfaces/ITransitSyle';
import { ReactNativeGradient } from 'utils/parseGradient';
import ColorsStore from '../../models/ColorsStore';

class TransitStyle implements ITransitStyle {
  className: string;
  enabled: boolean;
  isSvg: boolean;
  gradient?: ReactNativeGradient;
  scroll?: { horizontal: boolean; contentContainerStyle: { alignItems?: string; justifyContent?: string } };
  src?: string;
  style?: { resizeMode?: string; color?: string; fill?: string; width?: string | number; height?: string | number };
  transition?: ITransition[];

  constructor(className: string, enabled: boolean, isSvg: boolean) {
    this.className = className;
    this.enabled = enabled;
    this.isSvg = isSvg;
  }

  toString() {
    let style = '';
    if(this.style) {
      const styles: string[] = [];
      style = ', style: {';
      Object.keys(this.style).forEach(key => {
        const value = this.style![key as 'color'] as string;
        styles.push(
          `"${key}": ${['color', 'fill'].includes(key) ?
            ColorsStore.getColorVariable(value) :
            value.toString().includes('_') ? `${value.split('_').join('*')}` :
              JSON.stringify(value)}`
        );
      });
      style += styles.join(', ');
      style += '}';
    }
    let content = '{';
    content += `className: "${this.className}", `;
    content += `enabled: ${this.enabled}, `;
    content += `isSvg: ${this.isSvg}`;
    this.scroll && (content += `, scroll: ${JSON.stringify(this.scroll)}`);
    style.length && (content += style);
    this.gradient && (content += `, gradient: ${JSON.stringify(this.gradient)}`);
    this.src && (content += this.isSvg ? `, Svg: require("${this.src}")` : `, src: "${this.src}"`);
    this.transition && (content += `, transition: ${JSON.stringify(this.transition)}`);
    content += '}';
    return content;
  }
}

export default TransitStyle;
