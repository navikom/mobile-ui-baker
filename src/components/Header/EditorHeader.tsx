import React from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { App } from 'models/App';
import { Auth } from 'models/Auth/Auth';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Skeleton } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import IconButton from '@material-ui/core/IconButton';
import {
  AccountCircle,
  AddAPhoto,
  Android,
  Apple,
  Fullscreen,
  FullscreenExit, RestorePage,
  StayCurrentLandscape,
  StayCurrentPortrait
} from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';
import { ROUTE_LOGIN, ROUTE_PROJECTS, ROUTE_USER_PROFILE } from 'models/Constants';
import { blackOpacity, whiteColor } from 'assets/jss/material-dashboard-react';
import EditorDictionary from 'views/Editor/store/EditorDictionary';
import DisplayViewStore from 'models/DisplayViewStore';

const editorStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: theme.typography.pxToRem(1400),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      marginRight: theme.spacing(12),
      color: whiteColor
    },
    tabs: {
      backgroundColor: blackOpacity(0.05),
    },
    bordered: {
      border: '1px solid ' + blackOpacity(0.12),
    },
    tab: {
      minWidth: 120,
    },
    headerButtons: {
      flexGrow: 1,
    },
    headerRightGroup: {
      display: 'flex',
      alignItems: 'center'
    },

  })
);

interface ContextComponentProps {
  store: DisplayViewStore & {saving?: boolean; switchAutoSave?: () => void; autoSave?: boolean};
}

interface EditorHeaderProps extends ContextComponentProps {
  switchFullscreen: () => void;
  fullScreen: boolean;
  viewer?: boolean;
  position?: 'static' | 'fixed';
}

const EditorHeaderComponent: React.FC<EditorHeaderProps> = (
  {
    store,
    switchFullscreen,
    fullScreen ,
    viewer,
    position = 'static'
  }
  ) => {
  const classes = editorStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = (route: string) => () => {
    handleClose();
    App.navigationHistory!.push(route);
  }

  const logout = () => {
    handleClose();
    Auth.logout();
  };
  return (
    <AppBar position={position}>
      <Toolbar>
        {
          store.loadingPlugin ? (
            <div style={{ width: 200 }}>
              <Skeleton animation="wave" width={200} height={10} style={{ marginBottom: 5 }} />
              <Skeleton animation="wave" width={170} height={10} />
            </div>

          ) : (
            <NavLink to={store.pluginStore.data.routeLink}>
              <Typography variant="h6" className={classes.title}>
                {Dictionary.value(store.pluginStore.data.routeTitle)}
              </Typography>
            </NavLink>
          )
        }

        <div className={classes.headerButtons}>
          <IconButton
            color="inherit"
            onClick={switchFullscreen}
          >
            {fullScreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => store.setIOS(!store.ios)}
          >
            {store.ios ? <Android /> : <Apple />}
          </IconButton>
          <IconButton color="inherit" onClick={store.switchPortrait}>
            {!store.portrait ? <StayCurrentPortrait /> : <StayCurrentLandscape />}
          </IconButton>
          <Tooltip title={store.dictionary.defValue(EditorDictionary.keys.makeScreenshot)}>
            <IconButton color="inherit" onClick={store.makeProjectScreenshot}>
              <AddAPhoto />
            </IconButton>
          </Tooltip>
        </div>
        <div className={classes.headerRightGroup}>
          {
            !viewer && (
              <>
                <Typography color={store.saving ? 'secondary' : 'primary'} style={{ transition: 'all .5s ease-out' }}>
                  {Dictionary.defValue(DictionaryService.keys.projectStored)}
                </Typography>
                <Tooltip
                  title={store.dictionary.defValue(EditorDictionary.keys.autoSave)}
                >
                  <IconButton
                    onClick={store.switchAutoSave}
                    color={store.autoSave ? 'secondary' : 'inherit'}
                  >
                    <RestorePage />
                  </IconButton>
                </Tooltip>
              </>
            )
          }
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={navigate(ROUTE_PROJECTS)}>{Dictionary.defValue(DictionaryService.keys.projects)}</MenuItem>
            {
              App.loggedIn ?
                (<MenuItem
                  onClick={navigate(ROUTE_USER_PROFILE)}>{Dictionary.defValue(DictionaryService.keys.profile)}</MenuItem>) :
                (<MenuItem
                  onClick={navigate(ROUTE_LOGIN)}>{Dictionary.defValue(DictionaryService.keys.login)}</MenuItem>)
            }
            {
              App.loggedIn &&
              (<MenuItem onClick={logout}>{Dictionary.defValue(DictionaryService.keys.logout)}</MenuItem>)
            }
          </Menu>
        </div>
      </Toolbar>

    </AppBar>
  )
}

export default observer(EditorHeaderComponent);
