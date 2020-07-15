import { ReactNativeGradient } from '../utils/parseGradient';

interface ITransitStyle {
  className: string;
  isSvg: boolean;
  enabled: boolean;
  src?: string;
  style?: { resizeMode?: string; color?: string; width?: string | number; height?: string | number };
  gradient?: ReactNativeGradient;
  scroll?: { horizontal: boolean; contentContainerStyle: { alignItems?: string; justifyContent?: string } };
}

export default ITransitStyle;
