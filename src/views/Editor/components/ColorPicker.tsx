import React from 'react';
import { ColorResult, RGBColor, SketchPicker } from 'react-color';
import Draggable from 'react-draggable';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ColorInput from 'components/CustomInput/ColorInput';
import { Dialog, PaperProps } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import ColorsStore from 'models/ColorsStore';
import { blackOpacity, whiteColor } from 'assets/jss/material-dashboard-react';
import EditorDictionary from '../store/EditorDictionary';
import NumberInput from 'components/CustomInput/NumberInput';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { Settings } from 'models/Settings';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  backdrop: {
    backgroundColor: 'transparent'
  },
  sketch: {
    boxShadow: 'none !important'
  },
  title: {
    height: 10,
    transition: 'background-color 200ms linear',
    fontWeight: 'bold',
    backgroundColor: whiteColor,
    cursor: 'move'
  },
  paper: {
    opacity: .9,
    transition: 'opacity 200ms linear',
    '&:hover': {
      opacity: 1,
      '& $title': {
        backgroundColor: blackOpacity(.05),
        transition: 'background-color 200ms linear',
      }
    }
  },
  box: {
    width: 15,
    height: 15,
    borderRadius: 2,
    border: '1px solid ' + blackOpacity(.5),
    cursor: 'pointer',
    margin: '1px 3px'
  },
  content: {
    padding: '0 30px 30px 30px',
    overflow: 'auto',
    maxHeight: window.innerHeight * .8
  },
  bordersBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid rgb(238, 238, 238)'
  },
  borderInput: {
    cursor: 'pointer',
    width: 25,
    height: 25,
    borderRadius: 4
  },
  borderItems: {
    width: 220,
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid rgb(238, 238, 238)'
  },
  wrapper: {
    margin: '3px',
  },
  borderItem: {
    cursor: 'pointer',
    width: 15,
    height: 15,
    borderRadius: 3
  }
}));

interface ColorPickerProps {
  color: string;
  openPicker?: boolean;
  label?: React.ReactNode;
  onChange?: (value: string) => void;
  noInput?: boolean;
  handleClose?: () => void;
  dictionary?: EditorDictionary;
  noBorderInput?: boolean;
  borderWidth?: number;
  borderStyle?: string;
}

const colorFromRGBA = (color: RGBColor) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

const PaperComponent: React.FC<PaperProps> = (props) => {
  const classes = useStyles();
  const onDrag = React.useCallback((e, data) => {
    Settings.onDrag(data.x, data.y);
  }, []);
  return (
    <Draggable
      defaultPosition={{x: Settings.x, y: Settings.y}}
      onStop={onDrag}
      handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} className={classes.paper} />
    </Draggable>
  );
}

const ColorPicker: React.FC<ColorPickerProps> = (
  {
    color,
    onChange,
    label,
    noInput,
    noBorderInput,
    handleClose,
    openPicker = false,
    dictionary,
    borderWidth,
    borderStyle,
  }
) => {
  const [open, setOpen] = React.useState(openPicker);
  const [currentColor, setCurrentColor] = React.useState(color);
  const [currentWidth, setCurrentWidth] = React.useState(borderWidth);
  const [currentStyle, setCurrentStyle] = React.useState(borderStyle);
  const classes = useStyles();

  const onSwitch = React.useCallback(() => {
    handleClose && handleClose();
    setOpen(!open);
  }, [setOpen, open, handleClose]);

  const onClose = React.useCallback(() => {
    setOpen(false)
    handleClose && handleClose();
  }, [handleClose, setOpen]);

  React.useEffect(() => {
    setOpen(openPicker);
  }, [setOpen, openPicker]);

  React.useEffect(() => {
    setCurrentColor(color);
  }, [color, setCurrentColor]);

  React.useEffect(() => {
    setCurrentWidth(borderWidth);
  }, [borderWidth, setCurrentWidth]);

  React.useEffect(() => {
    setCurrentStyle(borderStyle);
  }, [borderStyle, setCurrentStyle]);

  const onPickerChange = React.useCallback((color: ColorResult) => {
    const val = color.rgb && color.rgb.a !== undefined && color.rgb.a < 1 ? colorFromRGBA(color.rgb) : color.hex

    onChange!(borderWidth !== undefined ? `${currentWidth}px ${currentStyle} ${val}` : val);
    setCurrentColor(color.hex);
  }, [onChange, setCurrentColor, currentWidth, currentStyle, borderWidth]);

  const onWidthChange = React.useCallback((value: number) => {
    onChange!(`${value}px ${currentStyle} ${currentColor}`);
    setCurrentWidth(value);
  }, [setCurrentWidth, currentStyle, currentColor, onChange]);

  const onStyleChange = React.useCallback((value: string) => {
    onChange!(`${currentWidth}px ${value} ${currentColor}`);
    setCurrentStyle(value);
  }, [setCurrentStyle, currentWidth, currentColor, onChange]);

  const onBorderClick = React.useCallback((value: string) => {
    onChange && onChange(value);
    const [width, style, ...rest] = value.split(' ');
    const color = rest.join(' ');
    setCurrentColor(color);
    setCurrentWidth(Number(width.replace('px', '')));
    setCurrentStyle(style);
  }, [onChange, setCurrentColor, setCurrentWidth, setCurrentStyle]);

  const isWhite = ['white', '#ffffff', '#FFFFFF', 'rgba(255, 255, 255, 1)'].includes(currentColor);

  return (
    <div className={classes.root}>
      {
        !noInput && <ColorInput color={currentColor} onChange={onChange} label={label} onColorClick={onSwitch} />
      }
      {
        borderWidth !== undefined && !noBorderInput && (
          <div
            onClick={onSwitch}
            className={classes.borderInput}
            style={{backgroundColor: isWhite ? '#ccc' : '#ffffff', border: `${currentWidth}px ${currentStyle} ${currentColor}`}}/>
        )
      }
      <Dialog
        BackdropProps={{
          classes: {
            root: classes.backdrop
          }
        }}
        open={open}
        onClose={onClose}
        PaperComponent={PaperComponent as React.FC<PaperProps>}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle id="draggable-dialog-title" disableTypography classes={{root: classes.title}}>
          {' '}
        </DialogTitle>
        <DialogContent classes={{root: classes.content}}>
          <SketchPicker
            className={classes.sketch}
            color={currentColor}
            onChange={onPickerChange}
            presetColors={ColorsStore.colors}
          />
          {
            borderWidth !== undefined && (
              <Grid container className={classes.bordersBox} justify="space-between" alignItems="center">
                <NumberInput value={borderWidth} size="small" onChange={onWidthChange}/>
                <CustomSelect
                  options={['solid', 'dotted', 'dashed']}
                  onChange={onStyleChange}
                  value={borderStyle}
                  small/>
              </Grid>
            )
          }
          {
            borderWidth !== undefined && (
              <div className={classes.borderItems}>
                <Grid container>
                  {
                    ColorsStore.borders.map(item => (
                      <Grid item xs={1} sm={1} md={1} className={classes.wrapper} key={item.border}>
                        <Tooltip title={item.title}>
                          <div
                            className={classes.borderItem}
                            style={{border: item.border}}
                            onClick={() => onBorderClick(item.border)}/>
                        </Tooltip>
                      </Grid>
                    ))
                  }
                </Grid>
              </div>
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ColorPicker;
