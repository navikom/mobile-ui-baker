import { ReactNativeGradient } from '../utils/parseGradient';

export interface ITransition {
  name: string;
  duration: number;
  easing?: string;
}

export type ObjectType = { [key: string]: string | number | boolean | undefined | null };

interface ITransitStyle {
  className: string;
  isSvg: boolean;
  enabled: boolean;
  src?: string;
  style?: { resizeMode?: string; color?: string; width?: string | number; height?: string | number };
  gradient?: ReactNativeGradient;
  scroll?: { horizontal: boolean; contentContainerStyle: { alignItems?: string; justifyContent?: string } };
  transition?: ITransition[];
}

export default ITransitStyle;
