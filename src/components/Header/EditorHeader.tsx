import React, { useState } from 'react';
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
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const editorStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: theme.typography.pxToRem(1400),
    },
    toolbar: {
      justifyContent: 'space-between'
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
    listItemText: {
      marginLeft: theme.typography.pxToRem(7)
    }
  })
);

interface ContextComponentProps {
  store: DisplayViewStore & { saving?: boolean; switchAutoSave?: () => void; autoSave?: boolean };
}

interface MenuProps extends ContextComponentProps {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  switchFullscreen: () => void;
  fullScreen: boolean;
  viewer?: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  navigate: (route: string) => () => void;
  logout: () => void;

}

interface ProfileMenuItemsProps {
  navigate: (route: string) => () => void;
  logout: () => void;
}

const ProfileMenuItemsComponent: React.FC<ProfileMenuItemsProps> = (
  { navigate, logout }, ref
) => {
  const items = [
    [navigate(ROUTE_PROJECTS), 'projects'],
  ];
  if (App.loggedIn) {
    items.push(
      [navigate(ROUTE_USER_PROFILE), 'profile'],
      [logout, 'logout']
    )
  } else {
    items.push(
      [navigate(ROUTE_LOGIN), 'login']
    )
  }
  return (
    <>
      {
        items.map((item, i) => (
          <MenuItem key={i.toString()} onClick={item[0] as () => void}>{Dictionary.value(item[1] as string)}</MenuItem>
        ))
      }
    </>
  )
};

const ProfileMenuItems = React.forwardRef(ProfileMenuItemsComponent);

const MobileMenu: React.FC<MenuProps> = (
  {
    anchorEl,
    handleClose,
    switchFullscreen,
    fullScreen,
    store,
  }
) => {
  const classes = editorStyles();
  const navigate = (route: string) => () => {
    App.navigationHistory && App.navigationHistory.push(route);
  }
  return (
    <Menu
      id="customized-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {
        [
          [fullScreen ? FullscreenExit : Fullscreen, 'fullscreen', switchFullscreen],
          [store.ios ? Android : Apple, 'os', () => store.setIOS(!store.ios)],
          [!store.portrait ? StayCurrentPortrait : StayCurrentLandscape, 'orientation', store.switchPortrait],
          [AddAPhoto, 'screenshot', store.makeProjectScreenshot]
        ].map((item, i) => {
          return (
            <MenuItem key={i.toString()} onClick={item[2] as () => void}>
              {React.createElement(item[0] as React.FunctionComponent)}
              <ListItemText primary={Dictionary.value(item[1] as string)} className={classes.listItemText} />
            </MenuItem>
          )
        })
      }
      <Divider />
      <ProfileMenuItems navigate={navigate} logout={() => Auth.logout()} />
    </Menu>
  )
}

const DesktopMenu: React.FC<MenuProps> = (
  {
    fullScreen,
    switchFullscreen,
    store,
    viewer,
    handleClick,
  }
) => {
  const classes = editorStyles();
  return (
    <Hidden smDown>
      <div className={classes.headerButtons}>
        <Tooltip
          title={store.dictionary.defValue(EditorDictionary.keys.fullscreen)}
        >
          <IconButton
            color="inherit"
            onClick={switchFullscreen}
          >
            {fullScreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Tooltip>
        <IconButton
          color="inherit"
          onClick={() => store.setIOS(!store.ios)}
        >
          {store.ios ? <Android /> : <Apple />}
        </IconButton>
        <Tooltip title={store.dictionary.defValue(EditorDictionary.keys.orientation)}>
          <IconButton color="inherit" onClick={store.switchPortrait}>
            {!store.portrait ? <StayCurrentPortrait /> : <StayCurrentLandscape />}
          </IconButton>
        </Tooltip>
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
          onClick={handleClick}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </div>
    </Hidden>
  )
};

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
    fullScreen,
    viewer,
    position = 'fixed'
  }
) => {
  const classes = editorStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
      <Toolbar className={classes.toolbar}>
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
        <DesktopMenu
          anchorEl={anchorEl}
          handleClose={handleClose}
          handleClick={handleClick}
          fullScreen={fullScreen}
          logout={logout}
          navigate={navigate}
          store={store}
          switchFullscreen={switchFullscreen}
          viewer={viewer}
        />
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <MobileMenu
            anchorEl={menuAnchorEl}
            handleClose={handleMenuClose}
            handleClick={handleClick}
            fullScreen={fullScreen}
            logout={logout}
            navigate={navigate}
            store={store}
            switchFullscreen={switchFullscreen}
            viewer={viewer}
          />
        </Hidden>
      </Toolbar>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ProfileMenuItems navigate={navigate} logout={logout} />
      </Menu>
    </AppBar>
  )
}

export default EditorHeaderComponent;
