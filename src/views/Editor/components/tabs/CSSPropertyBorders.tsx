import React from 'react';
import ColorPicker from '../ColorPicker';

interface CSSPropertyBordersProps {
  value: string;
  setValue: (value: string | number) => void;
}

const CSSPropertyBorders: React.FC<CSSPropertyBordersProps> = (
  { value, setValue }
) => {

  const [borderWidth, borderStyle, ...borderColor] = value.split(' ');
  const width = Number(borderWidth.replace('px', ''));
  return <ColorPicker
    borderWidth={width}
    borderStyle={borderStyle}
    color={borderColor.join(' ')}
    onChange={setValue}
    noInput
  />
}

export default CSSPropertyBorders;
