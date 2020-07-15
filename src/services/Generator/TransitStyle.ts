import ITransitStyle from 'interfaces/ITransitSyle';
import { ReactNativeGradient } from 'utils/parseGradient';

class TransitStyle implements ITransitStyle {
  className: string;
  enabled: boolean;
  isSvg: boolean;
  gradient?: ReactNativeGradient;
  scroll?: { horizontal: boolean; contentContainerStyle: { alignItems?: string; justifyContent?: string } };
  src?: string;
  style?: { resizeMode?: string; color?: string; width?: string | number; height?: string | number };

  constructor(className: string, enabled: boolean, isSvg: boolean) {
    this.className = className;
    this.enabled = enabled;
    this.isSvg = isSvg;
  }

  toString() {
    let content = '{';
    content += `className: "${this.className}", `;
    content += `enabled: ${this.enabled}, `;
    content += `isSvg: ${this.isSvg}`;
    this.scroll && (content += `, scroll: ${JSON.stringify(this.scroll)}`);
    this.style && (content += `, style: ${JSON.stringify(this.style)}`);
    this.gradient && (content += `, gradient: ${JSON.stringify(this.gradient)}`);
    this.src && (content += this.isSvg ? `, Svg: require("${this.src}")` : `, src: "${this.src}"`);
    content += '}';
    return content;
  }
}

export default TransitStyle;
