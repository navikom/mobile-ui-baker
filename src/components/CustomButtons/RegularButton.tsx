import React from 'react';
// nodejs library to set property for components
// nodejs library that concatenates classes
import classNames from 'classnames';

// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

// core components

import buttonStyle from 'assets/jss/material-kit-react/components/buttonStyle';

const makeComponentStyles = makeStyles(() => ({
  ...buttonStyle
}));

type ColorType = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose' | 'white' | 'facebook' | 'twitter' | 'google' | 'github' | 'transparent';
type SizeType = 'sm' | 'lg';

interface RegularButtonProps {
  color?: ColorType;
  size?: SizeType;
  simple?: boolean;
  round?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  block?: boolean;
  link?: boolean;
  justIcon?: boolean;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  style?: React.CSSProperties;
}

const RegularButton: React.FC<RegularButtonProps> =
  React.forwardRef(
    (
      {
        color = 'primary' as ColorType,
        round,
        children,
        fullWidth,
        disabled,
        simple,
        size = 'lg' as SizeType,
        block,
        link,
        justIcon,
        className = 'none',
        ...rest
      },
      ref
    ) => {

  const classes = makeComponentStyles();

  const btnClasses = classNames({
    [classes.button]: true,
    [classes[size]]: size,
    [classes[color]]: color,
    [classes.round]: round,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className
  });
  return (
    <Button {...rest} ref={ref as React.RefObject<HTMLButtonElement>} className={btnClasses}>
      {children}
    </Button>
  );
});

export default RegularButton;
