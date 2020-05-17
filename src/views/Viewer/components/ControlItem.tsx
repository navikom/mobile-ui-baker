import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { ControlEnum } from 'enums/ControlEnum';
import { ControlProps } from 'interfaces/IControlProps';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hover: {
      "&:hover": {
        cursor: "pointer",
      },
    }
  })
);

const ElementComponent: React.FC<ControlProps & {locked?: boolean}> =
  observer(
    (
      {
        control,
        setCurrentScreen,
        locked
      }) => {
      const { title, styles, children, lockedChildren } = control;
      const classes = useStyles();
      let backgroundColor = styles.backgroundColor;

      let placeholder;
      if (control.type === ControlEnum.Text) {
        placeholder = title;
      }

      const lock = locked || lockedChildren;

      const controlClass = classNames({
        [classes.hover]: control.actions.length > 0,
      });

      return (
        <div
          id={`capture_${control.id}`}
          data-testid="control"
          onClick={(e) => {
            if(locked) {
              return;
            }
            control.applyActions(setCurrentScreen);
            e.stopPropagation();
          }}
          style={{
            ...styles, backgroundColor
          }}
          className={controlClass}
        >
          {placeholder !== undefined && <div style={{ position: 'relative', height: '100%' }}>{placeholder}</div>}
          {children && children.map((child, i) =>
            <ElementComponent
              key={child.id}
              setCurrentScreen={setCurrentScreen}
              control={child}
              locked={lock}
            />
          )}
        </div>
      )
    });

export default ElementComponent;
