import { blackOpacity, whiteOpacity } from "assets/jss/material-dashboard-react";

function hexToRgb(hex: string) {
  if (hex.charAt(0) === '#') {
    hex = hex.substr(1);
  }
  if ((hex.length < 2) || (hex.length > 6)) {
    return [0,0,0];
  }
  const values = hex.split('');
  let r, g, b;

  if (hex.length === 2) {
    r = parseInt(values[0].toString() + values[1].toString(), 16);
    g = r;
    b = r;
  } else if (hex.length === 3) {
    r = parseInt(values[0].toString() + values[0].toString(), 16);
    g = parseInt(values[1].toString() + values[1].toString(), 16);
    b = parseInt(values[2].toString() + values[2].toString(), 16);
  } else if (hex.length === 6) {
    r = parseInt(values[0].toString() + values[1].toString(), 16);
    g = parseInt(values[2].toString() + values[3].toString(), 16);
    b = parseInt(values[4].toString() + values[5].toString(), 16);
  } else {
    return [0,0,0];
  }
  return [r, g, b];
}

export default function setContrast(hex: string) {

  const rgb: number[] = hexToRgb(hex);

  // http://www.w3.org/TR/AERT#color-contrast
  const brightness = Math.round(((rgb[0] * 299) +
    (rgb[1] * 587) +
    (rgb[2] * 114)) / 1000);
  return (brightness > 125) ? blackOpacity(.8) : whiteOpacity(.8);
}
