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
    addButtonSmall: {
      borderBottomLeftRadius: 2,
      borderTopLeftRadius: 2,
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
    removeButtonSmall: {
      borderBottomRightRadius: 2,
      borderTopRightRadius: 2,
    },
    input: {
      border: '1px solid ' + blackOpacity(.15),
      width: theme.typography.pxToRem(50),
      textAlign: 'center'
    },
    small: {
      width: theme.typography.pxToRem(35),
      fontSize: 12,
      padding: '2px'
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
  const [valid, setValidity] = React.useState(true);
  const classes = useStyles();
  const eClasses = useExtraStyles();

  const addButton = classNames(eClasses.button, {
    [eClasses.addButton]: true,
    [eClasses.addButtonSmall]: size && size === 'small'
  });

  const removeButton = classNames(eClasses.button, {
    [eClasses.removeButton]: true,
    [eClasses.removeButtonSmall]: size && size === 'small'
  });

  React.useEffect(() => {
    setValidity(!isNaN(Number(value)) && value !== undefined && value.toString().length > 0);
  }, [setValidity, value]);

  const input = classNames(classes.input, eClasses.input, className, {
    [classes.fullWidth]: fullWidth,
    [classes.error]: error || !valid,
    [eClasses.small]: size && size === 'small'
  });

  const handleClick = (increase?: boolean) => () => {
    let val = Number(value);
    const hasPoint = val.toString().includes('.');
    val = increase ? val + (double || hasPoint ? .1 : 1) : val - (double || hasPoint ? .1 : 1);
    if(double || hasPoint) {
      val = Math.round((val + Number.EPSILON) * 100) / 100;
    }
    min !== undefined && (val = Math.max(val, min));
    max !== undefined && (val = Math.min(val, max));
    onChange && onChange(val);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.target.value as unknown as number);
  }
  return (
    <FormControl>
      {label && <label>{label}</label>}
      <div className={eClasses.wrapper}>
        <IconButton size={size || 'medium'} disabled={otherProps.disabled} onClick={handleClick(true)}
                    className={addButton}>
          <Add fontSize={(size as 'small') || 'default'}/>
        </IconButton>
        <input
          value={value}
          onChange={onInputChange}
          className={input}
          {...otherProps}
        />
        <IconButton size={size || 'medium'} disabled={otherProps.disabled} onClick={handleClick(false)}
                    className={removeButton}>
          <Remove fontSize={(size as 'small') || 'default'} />
        </IconButton>
      </div>

    </FormControl>
  )
};

export default NumberInput;
