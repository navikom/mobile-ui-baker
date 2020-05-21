import React from 'react';
// nodejs library to set property for components
// nodejs library that concatenates classes
import classNames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

import styles from 'assets/jss/material-kit-react/components/infoStyle';

const useStyles = makeStyles(styles);


interface InfoAreaProps {
  icon?: React.FC<{className: string}>;
  title: string;
  description: string;
  iconColor: 'primary' | 'warning' | 'danger' | 'success' | 'info' | 'rose' | 'gray';
  vertical?: boolean;
}

const InfoArea: React.FC<InfoAreaProps> = (
  {
    title,
    description,
    iconColor = 'gray',
    vertical,
    ...rest
  }) => {
  const classes = useStyles();
  const iconWrapper = classNames({
    [classes.iconWrapper]: true,
    [classes[iconColor]]: true,
    [classes.iconWrapperVertical]: vertical
  });
  const iconClasses = classNames({
    [classes.icon]: true,
    [classes.iconVertical]: vertical
  });
  return (
    <div className={classes.infoArea}>
      <div className={iconWrapper}>
        {rest.icon && <rest.icon className={iconClasses} />}
      </div>
      <div className={classes.descriptionWrapper}>
        <h4 className={classes.title}>{title}</h4>
        <p className={classes.description}>{description}</p>
      </div>
    </div>
  );
};

export default InfoArea;
