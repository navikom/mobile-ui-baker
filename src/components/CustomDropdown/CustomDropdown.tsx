import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// nodejs library to set properties for components

// @material-ui/core components
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Popper from '@material-ui/core/Popper';

// core components
import Button from 'components/CustomButtons/RegularButton';

import useStyles from 'assets/jss/material-kit-react/components/customDropdownStyle';

type ColorType = 'black' | 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'rose';

interface CustomDropdownProps {
  hoverColor?: ColorType;
  buttonText: React.ReactNode;
  buttonIcon: React.FC;
  dropdownList: React.ReactNode[];
  buttonProps: any;
  dropup?: boolean;
  dropdownHeader?: React.ReactNode;
  rtlActive?: boolean;
  caret?: boolean;
  left?: boolean;
  noLiPadding?: boolean;
  onClick?: (param: any) => void;
  divider?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = (
  {
    buttonText,
    dropdownList,
    buttonProps,
    dropup,
    dropdownHeader,
    caret = true,
    hoverColor = 'primary',
    left,
    rtlActive,
    noLiPadding,
    onClick,
    ...rest
  }
) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<EventTarget & HTMLButtonElement>) => {
    if (anchorEl && anchorEl === event.target) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = (param: any) => {
    setAnchorEl(null);
    if (onClick) {
      onClick(param);
    }
  };
  const handleCloseAway = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorEl === event.target) {
      return;
    }
    setAnchorEl(null);
  };
  const classes = useStyles();
  const caretClasses = classNames({
    [classes.caret]: true,
    [classes.caretActive]: Boolean(anchorEl),
    [classes.caretRTL]: rtlActive
  });
  const dropdownItem = classNames({
    [classes.dropdownItem]: true,
    [classes[hoverColor + 'Hover' as unknown as 'primaryHover']]: true,
    [classes.noLiPadding]: noLiPadding,
    [classes.dropdownItemRTL]: rtlActive
  });
  let icon;
  switch (typeof rest.buttonIcon) {
    case 'object':
      // @ts-ignore
      icon = <rest.buttonIcon className={classes.buttonIcon} />;
      break;
    case 'string':
      icon = <Icon className={classes.buttonIcon}>{rest.buttonIcon}</Icon>;
      break;
    default:
      icon = null;
      break;
  }
  return (
    <div>
      <div>
        <Button
          aria-label="Notifications"
          aria-owns={anchorEl ? 'menu-list' : null}
          aria-haspopup="true"
          {...buttonProps}
          onClick={handleClick}
        >
          {icon}
          {buttonText !== undefined ? buttonText : null}
          {caret ? <b className={caretClasses} /> : null}
        </Button>
      </div>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        transition
        disablePortal
        placement={
          dropup
            ? left
            ? 'top-start'
            : 'top'
            : left
            ? 'bottom-start'
            : 'bottom'
        }
        className={classNames({
          [classes.popperClose]: !anchorEl,
          [classes.popperResponsive]: true
        })}
      >
        {() => (
          <Grow
            in={Boolean(anchorEl)}
            style={
              dropup
                ? { transformOrigin: '0 100% 0' }
                : { transformOrigin: '0 0 0' }
            }
          >
            <Paper className={classes.dropdown}>
              <ClickAwayListener onClickAway={handleCloseAway}>
                <MenuList role="menu" className={classes.menuList}>
                  {dropdownHeader !== undefined ? (
                    <MenuItem
                      onClick={() => handleClose(dropdownHeader)}
                      className={classes.dropdownHeader}
                    >
                      {dropdownHeader}
                    </MenuItem>
                  ) : null}
                  {dropdownList.map((prop, key) => {
                    if (rest.divider) {
                      return (
                        <Divider
                          key={key}
                          onClick={() => handleClose('divider')}
                          className={classes.dropdownDividerItem}
                        />
                      );
                    }
                    return (
                      <MenuItem
                        key={key}
                        onClick={() => handleClose(prop)}
                        className={dropdownItem}
                      >
                        {prop}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

export default CustomDropdown;
