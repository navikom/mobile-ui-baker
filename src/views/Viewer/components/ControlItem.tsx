import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { ControlEnum } from 'enums/ControlEnum';
import { ControlProps } from 'interfaces/IControlProps';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';
import { DeviceEnum } from '../../../enums/DeviceEnum';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hover: {
      '&:hover': {
        cursor: 'pointer',
      },
    }
  })
);

const ElementComponent: React.FC<ControlProps & { locked?: boolean }> =
  observer(
    (
      {
        control,
        setCurrentScreen,
        locked,
        device,
        isPortrait
      }) => {
      const { title, children, lockedChildren } = control;
      const styles = control.styles(device as DeviceEnum, !!isPortrait);
      const classes = useStyles();
      const backgroundColor = styles.backgroundColor;

      let placeholder;
      let Tag = 'div';
      if (control.type === ControlEnum.Text && !control.hasImage) {
        placeholder = title;
        Tag = 'span';
      }

      const lock = locked || lockedChildren;

      const controlClass = classNames({
        [classes.hover]: control.actions.length > 0,
      });

      const elementChildren = children.length ? children.map((child, i) =>
        <ElementComponent
          key={child.id}
          setCurrentScreen={setCurrentScreen}
          control={child}
          locked={lock}
        />
      ) : placeholder !== undefined ? [placeholder] : [];

      return React.createElement(Tag, {
        id: `capture_${control.id}`,
        'data-testid': 'control',
        onClick: (e: MouseEvent) => {
          if (locked) {
            return;
          }
          control.applyActions(setCurrentScreen);
          e.stopPropagation();
        },
        style: { ...styles, backgroundColor },
        className: controlClass
      }, elementChildren);
    }
  );

export default ElementComponent;
