import CreateControl from 'models/Control/ControlStores';
import { ControlEnum } from 'enums/ControlEnum';
import { MAIN_CSS_STYLE } from 'models/Control/ControlStore';
import { correctGradients } from 'utils/parseGradient';
import GenerateComponent from './GenerateComponent';

describe('GenerateComponent', () => {
  it('transit image from background to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![5].switchEnabled();
    mainStyle![5].setValue('no-repeat url("../../media/examples/lizard.png")');
    expect(generator.transitStyle(grid)[0].src).toBe('../../media/examples/lizard.png');
  });

  it('transit image from background-image to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![7].switchEnabled();
    mainStyle![7].setValue('../../media/examples/lizard.png');
    expect(generator.transitStyle(grid)[0].src).toBe('../../media/examples/lizard.png');

    mainStyle![8].switchEnabled();
    mainStyle![8].setValue('100% 100%');
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('stretch');
    mainStyle![8].setValue('100%');
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('cover');
    mainStyle![8].setValue('cover');
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('cover');
    mainStyle![8].setValue('contain');
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('repeat');

    mainStyle![9].switchEnabled();
    mainStyle![9].setValue('repeat');
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('repeat');
    mainStyle![9].setValue('space');
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('repeat');
    mainStyle![9].setValue('round');
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('repeat');
    mainStyle![9].setValue('no-repeat');
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('cover');

    mainStyle![10].switchEnabled();
    expect(generator.transitStyle(grid)[0].style!.resizeMode).toBe('center');
  });

  it('transit svg from image to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![7].switchEnabled();
    mainStyle![7].setValue('../../media/examples/lizard.svg');
    expect(generator.transitStyle(grid)[0].isSvg).toBeTruthy();
  });

  it('transit svg from mask to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![11].switchEnabled();
    mainStyle![11].setValue('no-repeat url("../../media/examples/lizard.svg")');
    expect(generator.transitStyle(grid)[0].isSvg).toBeTruthy();
  });

  it('transit svg from mask-image to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![12].switchEnabled();
    mainStyle![12].setValue('../../media/examples/lizard.svg');
    expect(generator.transitStyle(grid)[0].isSvg).toBeTruthy();

    mainStyle![6].switchEnabled();
    mainStyle![6].setValue('red');
    expect(generator.transitStyle(grid)[0].style!.color).toBe('red');
  });

  it('transit gradient to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![5].switchEnabled();
    generator.transitStyle(grid);

    const results = [
      {
        orientation: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        colorStops: {
          locations: [0, 1],
          colors: ['#FF0000', '#00FF00', 'rgb(0, 0, 255)']
        }
      },
      {
        orientation: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        colorStops: {
          locations: [0],
          colors: ['rgba(255, 0, 0, .1)', 'rgba(0, 255, 0, 0.9)']
        }
      },
      {
        colorStops: {
          locations: [],
          colors: ['rgb(102, 126, 234)', 'rgb(118, 75, 162)']
        }
      },
      {
        colorStops: {
          locations: [0, 1],
          colors: ['#FF0000', '#00FF00', 'rgb(0, 0, 255)']
        }
      },
      {
        orientation: { useAngle: true, angle: '45', angleCenter: { x: 0.5, y: 0.5 } },
        colorStops: { locations: [], colors: ['red', 'blue'] }
      },
      {
        orientation: { useAngle: true, angle: '135', angleCenter: { x: 0.5, y: 0.5 } },
        colorStops: { locations: [0.6], colors: ['orange', 'orange', 'cyan'] }
      }
    ];

    correctGradients.forEach((style, i) => {
      mainStyle![5].setValue(style);
      expect(JSON.stringify(generator.transitStyle(grid)[0].gradient) === JSON.stringify(results[i])).toBeTruthy();
    })

    mainStyle![5].setValue('linear-gradient(to right, red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%)');
    expect(generator.transitStyle(grid).length).toBe(0);
    expect(generator.transitionErrors.length).toBe(1);
    expect(generator.transitionErrors[0].includes('Gradient parse error, correct gradient expressions:')).toBeTruthy();
  });

  it('transit scroll from overflow to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);

    mainStyle![54].setValue('auto'); // overflow
    expect(generator.transitStyle(grid).length).toBe(0);
    mainStyle![54].switchEnabled();
    expect(generator.transitStyle(grid)[0].scroll!.horizontal).toBeFalsy();

    mainStyle![55].switchEnabled(); // overflowX
    mainStyle![55].setValue('auto');
    expect(generator.transitStyle(grid)[0].scroll!.horizontal).toBeTruthy();

    mainStyle![56].switchEnabled(); // overflowY
    mainStyle![56].setValue('auto');
    // doesn't change until overflowX enabled
    expect(generator.transitStyle(grid)[0].scroll!.horizontal).toBeTruthy();

    mainStyle![55].switchEnabled();
    expect(generator.transitStyle(grid)[0].scroll!.horizontal).toBeFalsy();
  });

  it('grid style to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    grid.setChecksum(0, [], () => {
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

    mainStyle![21].switchEnabled();
    mainStyle![21].setValue('10px 5px 7px 0');

    mainStyle![27].switchEnabled();
    mainStyle![27].setValue(10);

    mainStyle![31].switchEnabled(); // transform
    mainStyle![31].setValue('translate(-50%,20%)');

    mainStyle![48].switchEnabled(); // boxShadow

    mainStyle![49].switchEnabled(); // display

    mainStyle![53].switchEnabled(); // flexWrap
    mainStyle![53].setValue('wrap');

    mainStyle![54].switchEnabled(); // overflow

    mainStyle![57].switchEnabled(); // white-space

    generator.addControl(grid);
    expect(
      JSON.stringify(generator.styles.get('96e913cc')) ===
      JSON.stringify({
        Main: {
          position: 'absolute',
          top: '10%',
          height: '100%',
          minWidth: '10rem',
          minHeight: 100,
          paddingTop: 10,
          paddingRight: 5,
          paddingBottom: 7,
          paddingLeft: 0,
          marginTop: 10,
          width: '100%',
          flexWrap: 'wrap',
          whiteSpace: 'normal'
        }
      })
    ).toBeTruthy();
    expect(generator.transitionErrors.length).toBe(2);
  });

  it('grid style correct transform to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    grid.setChecksum(0, [], () => {
    });
    const mainStyle = grid.cssStyles.get(MAIN_CSS_STYLE);
    mainStyle![31].switchEnabled();
    mainStyle![31].setValue('translate(-50px,0)');

    generator.addControl(grid);

    expect(
      JSON.stringify(generator.styles.get('96e913cc')) ===
      JSON.stringify({
        Main: {
          transform: [{ translateY: 0 }, { translateX: -50 }]
        }
      })
    ).toBeTruthy();
  });

  it('grid background and mask to react native', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Text);
    grid.setChecksum(0, [], () => {
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
    const generator = new GenerateComponent(1, 'abc');
    const text = CreateControl(ControlEnum.Text);
    text.setChecksum(0, [], () => {
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
    const generator = new GenerateComponent(1, 'abc');
    const text = CreateControl(ControlEnum.Text);
    const mainStyle = text.cssStyles.get(MAIN_CSS_STYLE);

    text.setChecksum(0, [], () => {
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

    mainStyle![21].switchEnabled();
    mainStyle![21].setValue('10px 5px 7px 0');

    mainStyle![27].switchEnabled();
    mainStyle![27].setValue(10);

    mainStyle![31].switchEnabled(); // transform
    mainStyle![31].setValue('translate(-50%,20%)');

    mainStyle![48].switchEnabled(); // boxShadow

    mainStyle![49].switchEnabled(); // color
    mainStyle![49].setValue('#fff');

    mainStyle![50].switchEnabled(); // textAlign
    mainStyle![51].switchEnabled(); // fontFamily
    mainStyle![52].switchEnabled(); // fontStyle
    mainStyle![52].setValue('oblique');

    mainStyle![55].switchEnabled(); // fontDecoration
    mainStyle![55].setValue('line-through');

    mainStyle![56].switchEnabled(); // lineHeight

    mainStyle![57].switchEnabled(); // textOverflow

    generator.addControl(text);
    expect(
      JSON.stringify(generator.styles.get('21eabfa8')) ===
      JSON.stringify({
        Main: {
          position: 'absolute',
          top: '10%',
          height: '100%',
          minWidth: '10rem',
          minHeight: 100,
          paddingTop: 10,
          paddingRight: 5,
          paddingBottom: 7,
          paddingLeft: 0,
          marginTop: 10,
          color: '#fff',
          textAlign: 'center',
          fontFamily: 'Verdana',
          fontStyle: 'oblique',
          textDecorationLine: 'line-through',
          textDecorationColor: 'black',
          textDecorationStyle: 'solid',
          lineHeight: 'normal',
          textOverflow: 'ellipsis'
        }
      })
    ).toBeTruthy();
    expect(generator.transitionErrors.length).toBe(2);

    expect(generator.stylesString().trim().replace(/\t|\s/g, '') === `import {StyleSheet} from 'react-native';
    
    const styles = {
      "21eabfa8": StyleSheet.create({
       "Main": {
          "position": "absolute",
          "top": "10%",
          "height": "100%",
          "minWidth": "10rem",
          "minHeight": 100,
          "paddingTop": 10,
          "paddingRight": 5,
          "paddingBottom": 7,
          "paddingLeft": 0,
          "marginTop": 10,
          "color": "#fff",
          "textAlign": "center",
          "fontFamily": "Verdana",
          "fontStyle": "oblique",
          "textDecorationLine": "line-through",
          "textDecorationColor": "black",
          "textDecorationStyle": "solid",
          "lineHeight": "normal",
          "textOverflow": "ellipsis"
       }
    }),
    };
    export default styles`.trim().replace(/\t|\s/g, '')).toBeTruthy();
  });

  it('grid to RN view component', () => {
    const generator = new GenerateComponent(1, 'abc');
    const grid = CreateControl(ControlEnum.Grid);
    grid.setChecksum(0, [], () => {
    });
    generator.addControl(grid);
    expect(generator.generateComponentString().trim().replace(/\t|\s/g, '') === `import React from 'react';
    import {View, Image, ScrollView, FlatList} from 'react-native';
    import {SvgUri} from 'react-native-svg';
    import styles from '@app/components/Component1/styles';
    import childrenList from '@app/components/Component1/childrenList';
        
    function Component1({componentId, styleId, transitStyle, activeStyles}) {
      const style = styles[styleId];
      const children = childrenList[componentId];
      let component = View;
      const props = {};
      
      if(style) {
        props.style = activeStyles.map(entry => style[entry]);
      }
      
      if(transitStyle && transitStyle.enabled) {
        if(transitStyle.isSvg) {
          component = SvgUri;
          props.uri = transitStyle.src;
          if(transitStyle.style && transitStyle.style.color) {
            props.fill = transitStyle.style.color;
          }
        } else if(transitStyle.gradient) {
          
          component = LinearGradient;
          Object.assign(props, transitStyle.gradient.colorStops || {}, transitStyle.gradient.orientation || {});
          
        } else if(transitStyle.scroll) {
          component = ScrollView;
          if(transitStyle.scroll.horizontal) {
            props.horizontal = true;
          }
        } else {
          component = ImageBackground;
          Object.assign(props.style, transitStyle.style || {});
          props.source = {uri: transitStyle.src};
        }
      }
      
      if(children) {
        return (<component {...props}>{children}</component>);
      }
      
      return (<component {...props} />);
    }
        
    export default Component1;`.trim().replace(/\t|\s/g, '')).toBeTruthy();
  });

  it('text to RN text component', () => {
    const generator = new GenerateComponent(1, 'abc');
    const text = CreateControl(ControlEnum.Text);
    text.setChecksum(0, [], () => {
    });
    generator.addControl(text);
    expect(generator.generateComponentString().trim().replace(/\t|\s/g, '') === `import React from 'react';
    import {Text, Image, ScrollView, FlatList} from 'react-native';
    import {SvgUri} from 'react-native-svg';
    import styles from '@app/components/Component1/styles';
    import childrenList from '@app/components/Component1/childrenList';
        
    function Component1({componentId, styleId, transitStyle, activeStyles}) {
      const style = styles[styleId];
      const children = childrenList[componentId];
      let component = Text;
      const props = {};
      
      if(style) {
        props.style = activeStyles.map(entry => style[entry]);
      }
      
      if(transitStyle && transitStyle.enabled) {
        if(transitStyle.isSvg) {
          component = SvgUri;
          props.uri = transitStyle.src;
          if(transitStyle.style && transitStyle.style.color) {
            props.fill = transitStyle.style.color;
          }
        } else if(transitStyle.gradient) {
          component = LinearGradient;
          Object.assign(props, transitStyle.gradient.colorStops || {}, transitStyle.gradient.orientation || {});
        } else if(transitStyle.scroll) {
          component = ScrollView;
          if(transitStyle.scroll.horizontal) {
            props.horizontal = true;
          }
        } else {
          component = Image;
          Object.assign(props, transitStyle.style || {});
          props.source = {uri: transitStyle.src};
        }
      }
      
      if(children) {
        return (<component {...props}>{children}</component>);
      }
      
      return (<component {...props} />);
    }
        
    export default Component1;

`.trim().replace(/\t|\s/g, '')).toBeTruthy();
  });
});
