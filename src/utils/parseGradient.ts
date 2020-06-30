// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
interface IPoint {
  x: number;
  y: number;
}

interface IOrientation {
  start?: IPoint;
  end?: IPoint;
  useAngle?: boolean;
  angle?: number;
  angleCenter?: IPoint;
}

interface ColorStop {
  type: string;
  value: string | string[];
  length: { type: string; value: string };
}

export interface ReactNativeGradient {
  orientation?: IOrientation;
  colorStops?: { locations?: number[]; colors: string[] };
}

export const correctGradients = [
  'linear-gradient(to right bottom, #FF0000 0%, #00FF00 20px, rgb(0, 0, 255) 100%)',
  'linear-gradient(to right bottom, rgba(255, 0, 0, .1) 0%, rgba(0, 255, 0, 0.9) 20px)',
  'radial-gradient(rgb(102, 126, 234), rgb(118, 75, 162))',
  'linear-gradient(#FF0000 0%, #00FF00 20px, rgb(0, 0, 255) 100%)',
  'linear-gradient(45deg, red, blue)',
  'linear-gradient(135deg, orange, orange 60%, cyan)',
];

const orientations = {
  'bottom': { start: { x: .5, y: 0 }, end: { x: .5, y: 1 } },
  'top': { start: { x: .5, y: 1 }, end: { x: .5, y: 0 } },
  'right': { start: { x: 0, y: .5 }, end: { x: 1, y: .5 } },
  'left': { start: { x: 1, y: .5 }, end: { x: 0, y: .5 } },
  'right bottom': { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  'left top': { start: { x: 1, y: 1 }, end: { x: 0, y: 0 } },
  'left bottom': { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  'right top': { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } },
}

const GradientParser: any = {};

GradientParser.parse = () => {

  const tokens: any = {
    linearGradient: /^(-(webkit|o|ms|moz)-)?(linear-gradient)/i,
    repeatingLinearGradient: /^(-(webkit|o|ms|moz)-)?(repeating-linear-gradient)/i,
    radialGradient: /^(-(webkit|o|ms|moz)-)?(radial-gradient)/i,
    repeatingRadialGradient: /^(-(webkit|o|ms|moz)-)?(repeating-radial-gradient)/i,
    sideOrCorner: /^to (left (top|bottom)|right (top|bottom)|left|right|top|bottom)/i,
    extentKeywords: /^(closest-side|closest-corner|farthest-side|farthest-corner|contain|cover)/,
    positionKeywords: /^(left|center|right|top|bottom)/i,
    pixelValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))px/,
    percentageValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))%/,
    emValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))em/,
    angleValue: /^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))deg/,
    startCall: /^\(/,
    endCall: /^\)/,
    comma: /^,/,
    hexColor: /^#([0-9a-fA-F]+)/,
    literalColor: /^([a-zA-Z]+)/,
    rgbColor: /^rgb/i,
    rgbaColor: /^rgba/i,
    number: /^(([0-9]*\.[0-9]+)|([0-9]+\.?))/
  };

  let input = '';

  function error(msg: string) {
    const err: any = new Error(input + ': ' + msg);
    err.source = input;
    throw err;
  }

  function consume(size: number) {
    input = input.substr(size);
  }

  function scan(regexp: RegExp) {
    const blankCaptures = /^[\n\r\t\s]+/.exec(input);
    if (blankCaptures) {
      consume(blankCaptures[0].length);
    }

    const captures = regexp.exec(input);
    if (captures) {
      consume(captures[0].length);
    }

    return captures;
  }

  function matchCall(pattern: RegExp, callback: Function) {
    const captures = scan(pattern);

    if (captures) {
      if (!scan(tokens.startCall)) {
        error('Missing (');
      }

      const result = callback(captures);

      if (!scan(tokens.endCall)) {
        error('Missing )');
      }

      return result;
    }
  }

  function matchListing(matcher: Function) {
    let captures = matcher();
    const result = [];

    if (captures) {
      result.push(captures);
      while (scan(tokens.comma)) {
        captures = matcher();
        if (captures) {
          result.push(captures);
        } else {
          error('One extra comma');
        }
      }
    }

    return result;
  }

  function match(type: string, pattern: RegExp, captureIndex: number) {
    const captures = scan(pattern);
    if (captures) {
      return {
        type: type,
        value: captures[captureIndex]
      };
    }
  }

  function matchHexColor() {
    return match('hex', tokens.hexColor, 1);
  }

  function matchNumber() {
    return scan(tokens.number)![1];
  }

  function matchRGBAColor() {
    return matchCall(tokens.rgbaColor, function () {
      return {
        type: 'rgba',
        value: matchListing(matchNumber)
      };
    });
  }

  function matchRGBColor() {
    return matchCall(tokens.rgbColor, function () {
      return {
        type: 'rgb',
        value: matchListing(matchNumber)
      };
    });
  }

  function matchLiteralColor() {
    return match('literal', tokens.literalColor, 0);
  }

  function matchColor() {
    return matchHexColor() ||
      matchRGBAColor() ||
      matchRGBColor() ||
      matchLiteralColor();
  }

  function matchPositionKeyword() {
    return match('position-keyword', tokens.positionKeywords, 1);
  }

  function matchLength() {
    return match('px', tokens.pixelValue, 1) ||
      match('em', tokens.emValue, 1);
  }

  function matchDistance() {
    return match('%', tokens.percentageValue, 1) ||
      matchPositionKeyword() ||
      matchLength();
  }

  function matchColorStop() {
    const color = matchColor();

    if (!color) {
      error('Expected color definition');
    }

    color.length = matchDistance();
    return color;
  }

  function matchGradient(gradientType: string, pattern: RegExp, orientationMatcher: Function) {
    return matchCall(pattern, function () {

      const orientation = orientationMatcher();
      if (orientation) {
        if (!scan(tokens.comma)) {
          error('Missing comma before color stops');
        }
      }

      return {
        type: gradientType,
        orientation: orientation,
        colorStops: matchListing(matchColorStop)
      };
    });
  }

  function matchSideOrCorner() {
    return match('directional', tokens.sideOrCorner, 1);
  }

  function matchAngle() {
    return match('angular', tokens.angleValue, 1);
  }

  function matchLinearOrientation() {
    return matchSideOrCorner() ||
      matchAngle();
  }

  function matchExtentKeyword() {
    return match('extent-keyword', tokens.extentKeywords, 1);
  }

  function matchCircle() {
    const circle: any = match('shape', /^(circle)/i, 0);

    if (circle) {
      circle.style = matchLength() || matchExtentKeyword();
    }

    return circle;
  }

  function matchEllipse() {
    const ellipse: any = match('shape', /^(ellipse)/i, 0);

    if (ellipse) {
      ellipse.style = matchDistance() || matchExtentKeyword();
    }

    return ellipse;
  }

  function matchCoordinates() {
    return {
      x: matchDistance(),
      y: matchDistance()
    };
  }

  function matchPositioning() {
    const location = matchCoordinates();

    if (location.x || location.y) {
      return {
        type: 'position',
        value: location
      };
    }
  }

  function matchAtPosition() {
    if (match('position', /^at/, 0)) {
      const positioning = matchPositioning();

      if (!positioning) {
        error('Missing positioning value');
      }

      return positioning;
    }
  }

  function matchRadialOrientation() {
    let radialType: any = matchCircle() ||
      matchEllipse();

    if (radialType) {
      radialType.at = matchAtPosition();
    } else {
      const extent = matchExtentKeyword();
      if (extent) {
        radialType = extent;
        const positionAt = matchAtPosition();
        if (positionAt) {
          radialType.at = positionAt;
        }
      } else {
        const defaultPosition = matchPositioning();
        if (defaultPosition) {
          radialType = {
            type: 'default-radial',
            at: defaultPosition
          };
        }
      }
    }

    return radialType;
  }

  function matchListRadialOrientations() {
    let radialOrientations,
      radialOrientation = matchRadialOrientation(),
      lookaheadCache;

    if (radialOrientation) {
      radialOrientations = [];
      radialOrientations.push(radialOrientation);

      lookaheadCache = input;
      if (scan(tokens.comma)) {
        radialOrientation = matchRadialOrientation();
        if (radialOrientation) {
          radialOrientations.push(radialOrientation);
        } else {
          input = lookaheadCache;
        }
      }
    }

    return radialOrientations;
  }

  function matchDefinition() {
    return matchGradient(
      'linear-gradient',
      tokens.linearGradient,
      matchLinearOrientation) ||

      matchGradient(
        'repeating-linear-gradient',
        tokens.repeatingLinearGradient,
        matchLinearOrientation) ||

      matchGradient(
        'radial-gradient',
        tokens.radialGradient,
        matchListRadialOrientations) ||

      matchGradient(
        'repeating-radial-gradient',
        tokens.repeatingRadialGradient,
        matchListRadialOrientations);
  }

  function matchListDefinitions() {
    return matchListing(matchDefinition);
  }

  function getAST() {
    const ast = matchListDefinitions();

    if (input.length > 0) {
      error('Invalid input not EOF');
    }

    return ast;
  }

  function parse(code: string) {
    input = code.toString();
    return getAST();
  }

  return function reactNative(code: string) {
    const result = parse(code) as { orientation: { [key: string]: any }; colorStops: { [key: string]: any } }[];
    const gradient: ReactNativeGradient = {};
    if (result && result.length) {
      if (result[0].orientation) {
        if (result[0].orientation.type === 'directional') {
          gradient.orientation = orientations[result[0].orientation.value as 'top'];
        } else if (result[0].orientation.type === 'angular') {
          gradient.orientation = { useAngle: true, angle: result[0].orientation.value, angleCenter: { x: 0.5, y: 0.5 } }
        }
      }
      const locations: number[] = [];
      const colors: string[] = [];
      result[0].colorStops.forEach((e: ColorStop, i: number) => {
        if (e.length !== undefined && e.length.type === '%') {
          locations.push(Number(e.length.value) * .01);
        }
        if (e.type === 'rgba') {
          colors.push(`rgba(${(e.value as string[]).join(', ')})`);
        } else if (e.type === 'rgb') {
          colors.push(`rgb(${(e.value as string[]).join(', ')})`);
        } else if (e.type === 'hex') {
          colors.push('#' + e.value);
        } else {
          colors.push(e.value as string);
        }
      });
      gradient.colorStops = { colors };
      locations.length && (gradient.colorStops.locations = locations);
      return gradient;
    }
  }
};

export default GradientParser;
