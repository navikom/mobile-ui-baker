import { FetchMock } from 'jest-fetch-mock';
import CreateControl from 'models/Control/ControlStores';
import { ControlEnum } from 'enums/ControlEnum';
import { MAIN_CSS_STYLE } from 'models/Control/ControlStore';
import { correctGradients } from 'utils/parseGradient';
import GenerateComponent from './GenerateComponent';
import EditorViewStore from 'views/Editor/store/EditorViewStore';
import GenerateService from './GenerateService';
import ITransitStyle from 'interfaces/ITransitSyle';
import ICSSProperty from 'interfaces/ICSSProperty';
import { round } from './ReactNativeStyleDictionary';

const fetchMock = fetch as FetchMock;

const getStyle = (styles: ICSSProperty[], key: string) => styles.find(style => style.key === key);

describe('GenerateComponent', () => {

  beforeEach(() => {
    fetchMock.resetMocks();
  })

  it('transit image from background to react native', () => {
    const viewStore = new EditorViewStore('');
    const generator = new GenerateService(viewStore);
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![5].switchEnabled();
    mainStyle![5].setValue('no-repeat url("../../media/examples/lizard.png")');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0]!.src).toBe('../../media/examples/lizard.png');
  });

  it('transit image from background-image to react native', () => {
    const viewStore = new EditorViewStore('');
    const generator = new GenerateService(viewStore);
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![7].switchEnabled();
    mainStyle![7].setValue('../../media/examples/lizard.png');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].src).toBe('../../media/examples/lizard.png');

    mainStyle![8].switchEnabled();
    mainStyle![8].setValue('100% 100%');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('stretch');
    mainStyle![8].setValue('100%');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('cover');
    mainStyle![8].setValue('cover');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('cover');
    mainStyle![8].setValue('contain');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('repeat');

    mainStyle![9].switchEnabled();
    mainStyle![9].setValue('repeat');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('repeat');
    mainStyle![9].setValue('space');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('repeat');
    mainStyle![9].setValue('round');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('repeat');
    mainStyle![9].setValue('no-repeat');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('cover');

    mainStyle![10].switchEnabled();
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.resizeMode).toBe('contain');
  });

  it('transit svg from image to react native', () => {
    const viewStore = new EditorViewStore('');
    const generator = new GenerateService(viewStore);
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![7].switchEnabled();
    mainStyle![7].setValue('../../media/examples/lizard.svg');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].isSvg).toBeTruthy();
  });

  it('transit svg from mask to react native', () => {
    fetchMock.mockResponseOnce('');
    const viewStore = new EditorViewStore('');
    const generator = new GenerateService(viewStore);
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![11].switchEnabled();
    mainStyle![11].setValue('no-repeat url("../../media/examples/lizard.svg")');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].isSvg).toBeTruthy();
  });

  it('transit svg from mask-image to react native', () => {
    const viewStore = new EditorViewStore('');
    const generator = new GenerateService(viewStore);
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![12].switchEnabled();
    mainStyle![12].setValue('../../media/examples/lizard.svg');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].isSvg).toBeTruthy();

    mainStyle![6].switchEnabled();
    mainStyle![6].setValue('red');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].style!.color).toBe('red');
  });

  it('transit gradient to react native', () => {
    const viewStore = new EditorViewStore('');
    const generator = new GenerateService(viewStore);
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![5].switchEnabled();
    generator.transitStyle(grid);

    const results = [
      {
        orientation: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        colorStops: {
          colors: ['#FF0000', '#00FF00', 'rgb(0, 0, 255)'],
          locations: [0, 1]
        }
      },
      {
        orientation: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        colorStops: {
          colors: ['rgba(255, 0, 0, .1)', 'rgba(0, 255, 0, 0.9)'],
          locations: [0]
        }
      },
      {
        colorStops: {
          colors: ['rgb(102, 126, 234)', 'rgb(118, 75, 162)']
        }
      },
      {
        colorStops: {
          colors: ['#FF0000', '#00FF00', 'rgb(0, 0, 255)'],
          locations: [0, 1]
        }
      },
      {
        orientation: { useAngle: true, angle: '45', angleCenter: { x: 0.5, y: 0.5 } },
        colorStops: { colors: ['red', 'blue'] }
      },
      {
        orientation: { useAngle: true, angle: '135', angleCenter: { x: 0.5, y: 0.5 } },
        colorStops: { colors: ['orange', 'orange', 'cyan'], locations: [0.6] }
      }
    ];

    correctGradients.forEach((style, i) => {
      mainStyle![5].setValue(style);
      expect(JSON.stringify((generator.transitStyle(grid)[0] as ITransitStyle[])[0].gradient) === JSON.stringify(results[i])).toBeTruthy();
    })

    mainStyle![5].setValue('linear-gradient(to right, red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%)');
    expect(generator.transitStyle(grid).length).toBe(2);
    expect(generator.transitionErrors.length).toBe(1);
    expect(generator.transitionErrors[0].includes('Gradient parse error, correct gradient expressions:')).toBeTruthy();
  });

  it('transit scroll from overflow to react native', () => {
    const viewStore = new EditorViewStore('');
    const generator = new GenerateService(viewStore);
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![54].setValue('scroll'); // overflow
    expect(generator.transitStyle(grid).length).toBe(2);
    mainStyle![54].switchEnabled();
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].scroll!.horizontal).toBeFalsy();

    mainStyle![55].switchEnabled(); // overflowX
    mainStyle![55].setValue('scroll');
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].scroll!.horizontal).toBeTruthy();

    mainStyle![56].switchEnabled(); // overflowY
    mainStyle![56].setValue('scroll');
    // doesn't change until overflowX enabled
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].scroll!.horizontal).toBeTruthy();

    mainStyle![55].switchEnabled();
    expect((generator.transitStyle(grid)[0] as ITransitStyle[])[0].scroll!.horizontal).toBeFalsy();
  });

  it('grid style to react native', () => {
    const viewStore = new EditorViewStore('');
    const service = new GenerateService(viewStore);
    const generator = new GenerateComponent(service, 1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    grid.setChecksum(0, [], 0, () => {
    });
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![0].switchEnabled();
    mainStyle![0].setValue('absolute');

    mainStyle![1].switchEnabled();
    mainStyle![1].setValue(10);
    mainStyle![1].setUnit('%');

    mainStyle![7].switchEnabled();
    mainStyle![7].setValue('red');

    mainStyle![16].switchEnabled();
    mainStyle![16].setValue(100);
    mainStyle![16].setUnit('%');

    mainStyle![17].switchEnabled();
    mainStyle![17].setValue(10);
    mainStyle![17].setUnit('rem');

    mainStyle![18].switchEnabled();
    mainStyle![18].setValue(100);

    mainStyle![21].switchEnabled(); // padding
    mainStyle![21].setValue('10px 5px 7px 0');

    mainStyle![28].switchEnabled(); // marginTop
    mainStyle![28].setValue(10);

    mainStyle![32].switchEnabled(); // transform
    mainStyle![32].setValue('translate(-50%,20%)');

    getStyle(mainStyle as ICSSProperty[], 'boxShadow')!.switchEnabled();

    getStyle(mainStyle as ICSSProperty[], 'display')!.switchEnabled();

    const flexWrap = getStyle(mainStyle as ICSSProperty[], 'flexWrap');
    flexWrap!.switchEnabled();
    flexWrap!.setValue('wrap');

    getStyle(mainStyle as ICSSProperty[], 'overflow')!.switchEnabled();

    getStyle(mainStyle as ICSSProperty[], 'whiteSpace')!.switchEnabled();

    generator.addControl(grid);

    expect(
      JSON.stringify(generator.styles.get('96e913cc')) ===
      JSON.stringify({
        Main: {
          position: 'absolute',
          top: '10%',
          height: '100%',
          minWidth: '10rem',
          minHeight: round(100),
          paddingTop: round(10),
          paddingRight: round(5),
          paddingBottom: round(7),
          paddingLeft: 0,
          marginTop: round(10),
          shadowOffset: { width: 2, height: 4 },
          shadowRadius: 20,
          shadowColor: 'rgba(0,0,0,0.4)',
          shadowOpacity: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          overflow: 'visible'
        }
      })
    ).toBeTruthy();
    expect(service.transitionErrors.length).toBe(1);
  });

  it('grid style correct transform to react native', () => {
    const viewStore = new EditorViewStore('');
    const service = new GenerateService(viewStore);
    const generator = new GenerateComponent(service, 1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    grid.setChecksum(0, [], 0, () => {
    });
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![32].switchEnabled(); // transform
    mainStyle![32].setValue('translate(-50px,0)');

    generator.addControl(grid);

    expect(
      JSON.stringify(generator.styles.get('96e913cc')) ===
      JSON.stringify({
        Main: {
          transform: [{ translateY: 0 }, { translateX: -round(50) }]
        }
      })
    ).toBeTruthy();
  });

  it('grid background and mask to react native', () => {
    const viewStore = new EditorViewStore('');
    const service = new GenerateService(viewStore);
    const generator = new GenerateComponent(service, 1, 'abc');
    const grid = CreateControl(ControlEnum.Text);
    grid.setChecksum(0, [], 0, () => {
    });
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);

    mainStyle![5].switchEnabled();
    mainStyle![7].switchEnabled();
    mainStyle![8].switchEnabled();
    mainStyle![9].switchEnabled();
    mainStyle![10].switchEnabled();
    mainStyle![11].switchEnabled();
    mainStyle![12].switchEnabled();
    mainStyle![13].switchEnabled();

    generator.addControl(grid);
    expect(JSON.stringify(generator.styles.get('21eabfa8')) === JSON.stringify({ Main: {} })).toBeTruthy();
  });

  it('text background and mask to react native', () => {
    const viewStore = new EditorViewStore('');
    const service = new GenerateService(viewStore);
    const generator = new GenerateComponent(service, 1, 'abc');
    const text = CreateControl(ControlEnum.Text);
    text.setChecksum(0, [], 0, () => {
    });
    const mainStyle = text.cssStyles.get(MAIN_CSS_STYLE);

    mainStyle![5].switchEnabled();
    mainStyle![7].switchEnabled();
    mainStyle![8].switchEnabled();
    mainStyle![9].switchEnabled();
    mainStyle![10].switchEnabled();
    mainStyle![11].switchEnabled();
    mainStyle![12].switchEnabled();
    mainStyle![13].switchEnabled();

    generator.addControl(text);
    expect(JSON.stringify(generator.styles.get('21eabfa8')) === JSON.stringify({ Main: {} })).toBeTruthy();

  });

  it('text style to react native', () => {
    const viewStore = new EditorViewStore('');
    const service = new GenerateService(viewStore);
    const generator = new GenerateComponent(service, 1, 'abc');
    const text = CreateControl(ControlEnum.Text);
    const mainStyle = text.cssStyles.get(MAIN_CSS_STYLE);

    text.setChecksum(0, [], 0, () => {
    });

    mainStyle![0].switchEnabled();
    mainStyle![0].setValue('absolute');

    mainStyle![1].switchEnabled();
    mainStyle![1].setValue(10);
    mainStyle![1].setUnit('%');

    mainStyle![7].switchEnabled();
    mainStyle![7].setValue('red');

    mainStyle![16].switchEnabled();
    mainStyle![16].setValue(100);
    mainStyle![16].setUnit('%');

    mainStyle![17].switchEnabled();
    mainStyle![17].setValue(10);
    mainStyle![17].setUnit('rem');

    mainStyle![18].switchEnabled();
    mainStyle![18].setValue(100);

    mainStyle![21].switchEnabled(); // padding
    mainStyle![21].setValue('10px 5px 7px 0');

    mainStyle![28].switchEnabled(); // marginTop
    mainStyle![28].setValue(10);

    mainStyle![32].switchEnabled(); // transform
    mainStyle![32].setValue('translate(-50%,20%)');

    getStyle(mainStyle as ICSSProperty[], 'boxShadow')!.switchEnabled();

    const color = getStyle(mainStyle as ICSSProperty[], 'color');
    color!.switchEnabled(); // color
    color!.setValue('#fff');

    getStyle(mainStyle as ICSSProperty[], 'textAlign')!.switchEnabled();
    getStyle(mainStyle as ICSSProperty[], 'fontFamily')!.switchEnabled();
    const fontStyle = getStyle(mainStyle as ICSSProperty[], 'fontStyle');
    fontStyle!.switchEnabled();
    fontStyle!.setValue('oblique');

    const textDecoration = getStyle(mainStyle as ICSSProperty[], 'textDecoration');
    textDecoration!.switchEnabled();
    textDecoration!.setValue('line-through');

    getStyle(mainStyle as ICSSProperty[], 'lineHeight')!.switchEnabled();

    getStyle(mainStyle as ICSSProperty[], 'textOverflow')!.switchEnabled();

    generator.addControl(text);

    expect(
      JSON.stringify(generator.styles.get('21eabfa8')) ===
      JSON.stringify({
        Main: {
          position: 'absolute',
          top: '10%',
          height: '100%',
          minWidth: '10rem',
          minHeight: round(100),
          paddingTop: round(10),
          paddingRight: round(5),
          paddingBottom: round(7),
          paddingLeft: 0,
          lineHeight: round(10),
          marginTop: round(10),
          shadowOffset: { width: 2, height: 4 },
          shadowRadius: 20,
          shadowColor: 'rgba(0,0,0,0.4)',
          shadowOpacity: 1,
          color: '#fff',
          textAlign: 'center',
          fontFamily: 'Verdana',
          fontStyle: 'oblique',
          textDecorationLine: 'line-through',
          textDecorationColor: 'black',
          textDecorationStyle: 'solid',
          textOverflow: 'ellipsis'
        }
      })
    ).toBeTruthy();
    expect(service.transitionErrors.length).toBe(1);

    expect(generator.stylesString().trim().replace(/\t|\s/g, '') === `import {StyleSheet} from 'react-native';
    
    const styles = {
      "21eabfa8": StyleSheet.create({
       "Main": {
          "position": "absolute",
          "top": "10%",
          "height": "100%",
          "minWidth": "10rem",
          "minHeight": ${round(100)},
          "paddingTop": ${round(10)},
          "paddingRight": ${round(5)},
          "paddingBottom": ${round(7)},
          "paddingLeft": 0,
          "lineHeight": ${round(10)},
          "marginTop": ${round(10)},
          "shadowOffset": { "width": 2, "height": 4 },
          "shadowRadius": 20,
          "shadowColor": "rgba(0,0,0,0.4)",
          "shadowOpacity": 1,
          "color": "#fff",
          "textAlign": "center",
          "fontFamily": "Verdana",
          "fontStyle": "oblique",
          "textDecorationLine": "line-through",
          "textDecorationColor": "black",
          "textDecorationStyle": "solid",
          "textOverflow": "ellipsis"
       }
    }),
    };
    export default styles;`.trim().replace(/\t|\s/g, '')).toBeTruthy();
  });

  it('grid to RN view component', () => {
    const viewStore = new EditorViewStore('');
    const service = new GenerateService(viewStore);
    const generator = new GenerateComponent(service, 1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    grid.setChecksum(0, [], 0, () => {
    });
    generator.addControl(grid);

    expect(generator.generateComponentString().trim().replace(/\t|\s/g, '') === `import React from 'react';
    import BaseComponent from '@app/components/facetsui/BaseComponent/BaseComponent';
    import styles from '@app/components/facetsui/Component1/styles';
        
    function Component1({store, props}) {
      
      return (<BaseComponent store={store} props={props} styles={styles} />);
    }
        
    export default Component1;`.trim().replace(/\t|\s/g, '')).toBeTruthy();
  });

  it('text to RN text component', () => {
    const viewStore = new EditorViewStore('');
    const service = new GenerateService(viewStore);
    const generator = new GenerateComponent(service, 1, 'abc');
    const text = CreateControl(ControlEnum.Text);
    text.setChecksum(0, [], 0, () => {
    });
    generator.addControl(text);
    expect(generator.generateComponentString().trim().replace(/\t|\s/g, '') === `import React from 'react';
    import TextBaseComponent from '@app/components/facetsui/TextBaseComponent/TextBaseComponent';
    import styles from '@app/components/facetsui/Component1/styles';
        
    function Component1({store, props}) {
      
      return (<TextBaseComponent store={store} props={props} styles={styles} />);
    }
        
    export default Component1;`.trim().replace(/\t|\s/g, '')).toBeTruthy();
  });
});
