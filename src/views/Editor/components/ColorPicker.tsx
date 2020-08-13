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

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  backdrop: {
    backgroundColor: 'transparent'
  },
  sketch: {
    boxShadow: 'none'
  },
  title: {
    padding: '10px 30px',
    color: blackOpacity(.5),
    transition: 'color 200ms linear',
    fontWeight: 'bold',
    cursor: 'move'
  },
  paper: {
    boxShadow: 'none',
    backgroundColor: blackOpacity(0),
    transition: 'background-color 200ms linear',
    '&:hover': {
      backgroundColor: blackOpacity(.1),
      '& $title': {
        color: whiteColor,
        transition: 'color 200ms linear',
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
    padding: '0 30px 30px 30px'
  }
}));

interface ColorPickerProps {
  color: string;
  openPicker?: boolean;
  label?: React.ReactNode;
  onChange?: (value: string) => void;
  noInput?: boolean;
  handleClose?: () => void;
  dictionary: EditorDictionary;
}

const colorFromRGBA = (color: RGBColor) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

const PaperComponent: React.FC<PaperProps> = (props) => {
  const classes = useStyles();
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
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
    handleClose,
    openPicker = false,
    dictionary
  }
) => {
  const [open, setOpen] = React.useState(openPicker);
  const [currentColor, setCurrentColor] = React.useState(color);
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

  const onPickerChange = React.useCallback((color: ColorResult) => {
    onChange!(color.rgb && color.rgb.a !== undefined && color.rgb.a < 1 ? colorFromRGBA(color.rgb) : color.hex);
    setCurrentColor(color.hex);
  }, [onChange, setCurrentColor]);

  return (
    <div className={classes.root}>
      {
        !noInput && <ColorInput color={currentColor} onChange={onChange} label={label} onColorClick={onSwitch} />
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
          {dictionary.defValue(EditorDictionary.keys.change)}{' '}
          {dictionary.defValue(EditorDictionary.keys.color)}
        </DialogTitle>
        <DialogContent classes={{root: classes.content}}>
          <SketchPicker
            color={currentColor}
            onChange={onPickerChange}
            presetColors={ColorsStore.colors}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ColorPicker;
