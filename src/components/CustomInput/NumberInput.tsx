import React from 'react';
import { FormControl, makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Add, Remove } from '@material-ui/icons';
import useStyles from 'components/CustomInput/inputStyles';
import classNames from 'classnames';
import { blackOpacity, primaryColor } from 'assets/jss/material-dashboard-react';

const useExtraStyles = makeStyles(theme => (
  {
    wrapper: {
      display: 'flex'
    },
    button: {
      borderTop: '1px solid ' + blackOpacity(.15),
      borderBottom: '1px solid ' + blackOpacity(.15),
      padding: 5
    },
    addButton: {
      borderLeft: '1px solid ' + blackOpacity(.15),
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      '&:hover': {
        borderColor: primaryColor[1],
        borderRight: '1px solid ' + primaryColor[1],
      },
      '&:focus': {
        borderColor: primaryColor[0],
        borderRight: '1px solid ' + primaryColor[0],
      }
    },
    removeButton: {
      borderRight: '1px solid ' + blackOpacity(.15),
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
      '&:hover': {
        borderColor: primaryColor[1],
        borderLeft: '1px solid ' + primaryColor[1],
      },
      '&:focus': {
        borderColor: primaryColor[0],
        borderLeft: '1px solid ' + primaryColor[0],
      }
    },
    input: {
      border: '1px solid ' + blackOpacity(.15),
      width: theme.typography.pxToRem(50),
      textAlign: 'center'
    },
    small: {
      width: theme.typography.pxToRem(35),
    }
  }
));

interface NumberInputProps {
  label?: string;
  onChange?: (value: number) => void;
  value?: number;
  double?: boolean;
  className?: string;
  /**
   * Stretch to max width. Default: false
   */
  fullWidth?: boolean;

  /**
   * Display error state
   */
  error?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

const NumberInput: React.FC<NumberInputProps> = (
  {
    label,
    error,
    fullWidth,
    className,
    min,
    max,
    onChange,
    value,
    size,
    double,
    ...otherProps
  }) => {
  const classes = useStyles();
  const eClasses = useExtraStyles();

  const addButton = classNames(eClasses.button, eClasses.addButton);

  const removeButton = classNames(eClasses.button, eClasses.removeButton);

  const input = classNames(classes.input, eClasses.input, className, {
    [classes.fullWidth]: fullWidth,
    [classes.error]: error,
    [eClasses.small]: size && size === 'small'
  });

  const handleClick = (increase?: boolean) => () => {
    let val = Number(value);
    val = increase ? val + (double ? .1 : 1) : val - (double ? .1 : 1);
    min && (value = Math.min(val, min));
    max && (value = Math.max(val, max));
    onChange && onChange(val);
  };

  return (
    <FormControl>
      {label && <label>{label}</label>}
      <div className={eClasses.wrapper}>
        <IconButton size={size || 'medium'} disabled={otherProps.disabled} onClick={handleClick(true)}
                    className={addButton}>
          <Add />
        </IconButton>
        <input
          value={Number(value) || 0}
          onChange={(e) => onChange && onChange(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))}
          className={input}
          {...otherProps}
        />
        <IconButton size={size || 'medium'} disabled={otherProps.disabled} onClick={handleClick(false)}
                    className={removeButton}>
          <Remove />
        </IconButton>
      </div>

    </FormControl>
  )
};

export default NumberInput;
