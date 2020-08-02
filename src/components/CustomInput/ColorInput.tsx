import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import { blackOpacity } from '../../assets/jss/material-dashboard-react';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    padding: 0
  },
  input: {
    padding: 0,
    position: 'absolute',
    top: '50%',
    left: 5,
    transform: 'translate(0, -51%)',
    height: 35,
    width: 35,
    border: 'none',
    opacity: 0
  },
  colorWrapper: {
    borderRadius: 3,
    height: 27,
    width: 28,
    display: 'flex',
    padding: 2,
    border: '1px solid ' + blackOpacity(.15),
    opacity: 1
  },
  colorBox: {
    width: '100%',
    height: '100%',
  }
}));

interface ColorInputProps {
  color: string;
  label?: React.ReactNode;
  onChange?: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = (
  {
    color,
    onChange,
    label,
    ...rest
  }) => {
  const classes = useStyles();
  const colorBox = classNames({
    [classes.input]: true,
    [classes.colorWrapper]: true
  });
  const input = classNames({
    [classes.input]: true,
  })

  return (
    <div className={classes.root}>
      <TextField
        {...rest}
        variant="outlined"
        inputProps={{
          style: { marginLeft: 40, width: 70 }
        }}
        value={color}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange && onChange(e.target.value)
        }
      />

      <div className={colorBox}>
        <div className={classes.colorBox} style={{ backgroundColor: color }} />
      </div>
      <input type="color" className={input} value={color} onChange={(e) =>
        onChange && onChange(e.currentTarget.value)} />

    </div>
  );
};

export default withStyles({
  root: {
    '& .MuiInputBase-root': {
      padding: 0
    }
  }
})(ColorInput);

