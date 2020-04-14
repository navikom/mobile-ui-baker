import React, { useEffect } from "react";
import { NavLink } from "react-router-dom"
import { matchPath } from "react-router";
import { RouteComponentProps } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { DndProvider, useDrop } from "react-dnd";
import classNames from "classnames";
import Backend from "react-dnd-html5-backend";
import { observer } from "mobx-react-lite";
import html2canvas from "html2canvas";

// @material-ui/core
import { createStyles, Theme, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import {
  AccountCircle, AddAPhoto,
  Android,
  Apple, Clear,
  Redo,
  RestorePage,
  StayCurrentLandscape,
  StayCurrentPortrait,
  Undo
} from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";

import DeviceComponent from "views/Editor/components/DeviceComponent";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import EditorViewStore, { DragAndDropItem } from "views/Editor/store/EditorViewStore";
import ControlTab from "views/Editor/components/tabs/ControlTab";
import ControlItem from "views/Editor/components/control/ControlItem";
import { ItemTypes } from "views/Editor/store/ItemTypes";
import IControl from "interfaces/IControl";
import { DropEnum } from "enums/DropEnum";
import TreeComponent from "views/Editor/components/TreeComponent";
import { ROUTE_LOGIN, ROUTE_ROOT, ROUTE_USER_PROFILE, TABS_HEIGHT } from "models/Constants";
import ProjectTab from "views/Editor/components/tabs/ProjectTab";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import { blackOpacity, whiteColor } from "assets/jss/material-dashboard-react";
import { IBackgroundColor } from "interfaces/IProject";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar";
import { SharedControls } from "models/Project/ControlsStore";
import { SharedComponents } from "models/Project/SharedComponentsStore";
import { when } from "mobx";
import { App } from "models/App";
import { OwnComponents } from "models/Project/OwnComponentsStore";
import { Auth } from "models/Auth/Auth";

const contentStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      overflow: "auto"
    }
  })
);

interface ContentProps {
  items: IControl[],
  moveControl: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  handleDropCanvas: (item: DragAndDropItem) => void;
  handleDropElement: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  selectControl: (control?: IControl) => void;
  isSelected: (control: IControl) => boolean;
  setCurrentScreen: (screen: IControl) => void;
  background: IBackgroundColor;
  ios: boolean;
}

const Content: React.FC<ContentProps> = observer((
  {
    items,
    moveControl,
    handleDropCanvas,
    handleDropElement,
    isSelected,
    selectControl,
    background,
    ios,
    setCurrentScreen
  }
) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CONTROL,
    drop: (props: DragAndDropItem, monitor: any) => {
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
      handleDropCanvas(props);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const classes = contentStyles();

  const isActive = canDrop && isOver;
  let backgroundColor = background.backgroundColor;
  if (isActive) {
    backgroundColor = blackOpacity(0.05);
  } else if (canDrop) {
    backgroundColor = blackOpacity(0.1);
  }

  const root = classNames(classes.root);
  return (
    <div ref={drop} className={root} style={{ backgroundColor: backgroundColor }}
         onClick={() => selectControl()}>
      {
        items.map((control, i) => {
          return <ControlItem
            key={control.id}
            control={control}
            moveControl={moveControl}
            handleDropElement={handleDropElement}
            isSelected={isSelected}
            setCurrentScreen={setCurrentScreen}
            selectControl={selectControl} />
        })
      }
    </div>
  )
});

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
      border: "1px solid " + blackOpacity(0.12),
    },
    tab: {
      minWidth: 120,
    },
    headerButtons: {
      flexGrow: 1,
    },
    headerRightGroup: {
      display: "flex",
      alignItems: "center"
    }
  })
);

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const TabContent = [ProjectTab, ControlTab];

interface ContextComponentProps {
  store: EditorViewStore;
}

const ContextComponent: React.FC<ContextComponentProps> = (
  {
    store,
  }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [height, setHeight] = React.useState(window.innerHeight - 75);
  const classes = editorStyles();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const resize = () => {
      setHeight(window.innerHeight - 75);
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    }
  }, [height]);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateLogin = () => {
    handleClose();
    App.navigationHistory!.push(ROUTE_LOGIN);
  };

  const navigateDashboard = () => {
    handleClose();
    App.navigationHistory!.push(ROUTE_USER_PROFILE);
  };

  const logout = () => {
    handleClose();
    Auth.logout();
  };

  const handleScreenshot = () => {
    const element = document.querySelector("#capture") as HTMLElement;
    element && html2canvas(element).then(canvas => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL();
      a.download = "somefilename.png";
      a.click();
      setTimeout(() => {
        a.remove();
      }, 300);
    })
  };

  const tabsStyle = classNames(classes.tabs);
  return (
    <div className={classes.root} style={{ height }}>
      <AppBar position="static">
        <Toolbar>
          <NavLink to={ROUTE_ROOT}>
            <Typography variant="h6" className={classes.title}>
              {Dictionary.defValue(DictionaryService.keys.mobileUiEditor)}
            </Typography>
          </NavLink>
          <div className={classes.headerButtons}>
            <IconButton
              color={store.ios ? "default" : "inherit"}
              onClick={() => store.setIOS(false)}
            >
              <Android />
            </IconButton>
            <IconButton
              color={store.ios ? "inherit" : "default"}
              onClick={() => store.setIOS(true)}
            >
              <Apple />
            </IconButton>
            <IconButton color="inherit" onClick={store.switchPortrait}>
              {!store.portrait ? <StayCurrentPortrait /> : <StayCurrentLandscape />}
            </IconButton>
            <Tooltip title={store.dictionary.defValue(EditorDictionary.keys.makeScreenshot)}>
              <IconButton color="inherit" onClick={handleScreenshot}>
                <AddAPhoto />
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.headerRightGroup}>
            <Typography color={store.saving ? "secondary" : "primary"} style={{ transition: "all .5s ease-out" }}>
              {Dictionary.defValue(DictionaryService.keys.projectStored)}
            </Typography>
            <Tooltip
              title={store.dictionary.defValue(EditorDictionary.keys.autoSave)}
            >
              <IconButton
                onClick={store.switchAutoSave}
                color={store.autoSave ? "secondary" : "inherit"}
              >
                <RestorePage />
              </IconButton>
            </Tooltip>
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
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              {
                App.loggedIn ?
                  (<MenuItem
                    onClick={navigateDashboard}>{Dictionary.defValue(DictionaryService.keys.dashboard)}</MenuItem>) :
                  (<MenuItem onClick={navigateLogin}>{Dictionary.defValue(DictionaryService.keys.login)}</MenuItem>)
              }
              {
                App.loggedIn &&
                (<MenuItem onClick={logout}>{Dictionary.defValue(DictionaryService.keys.logout)}</MenuItem>)
              }
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <div style={{ height: "100%" }}>
        <DndProvider debugMode={true} backend={Backend}>
          <Grid container style={{ height: "100%" }}>
            <Grid item xs={2} sm={2} md={3} style={{ padding: 5 }}>
              <div className={classes.bordered} style={{ overflow: "auto", height }}>
                <TreeComponent
                  screens={store.screens}
                  moveControl={store.moveControl}
                  handleDropCanvas={store.handleDropCanvas}
                  handleDropElement={store.handleDropElement}
                  isCurrent={store.isCurrent}
                  setCurrentScreen={store.setCurrentScreen}
                  addScreen={store.addScreen}
                  removeScreen={store.removeScreen}
                  dictionary={store.dictionary}
                  cloneControl={store.cloneControl}
                  cloneScreen={store.cloneScreen}
                  selectControl={store.selectControl}
                  isSelected={store.isSelected}
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={7} md={6} style={{ padding: 5 }}>
              <div className={classes.bordered} style={{ overflow: "auto", height }}>
                <div style={{ transform: "translate3d(0, 0, 0)" }}>
                  <div style={{ transform: "scale(1)" }}>
                    <DeviceComponent
                      ios={store.ios}
                      mode={store.mode}
                      background={store.background}
                      statusBarColor={store.statusBarColor}
                      portrait={store.portrait}>
                      <Content
                        ios={store.ios}
                        background={store.background}
                        items={store.currentScreen.children}
                        moveControl={store.moveControl}
                        handleDropCanvas={store.handleDropCanvas}
                        handleDropElement={store.handleDropElement}
                        selectControl={store.selectControl}
                        isSelected={store.isSelected}
                        setCurrentScreen={store.setCurrentScreen}
                      />
                    </DeviceComponent>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={3} sm={3} md={3} style={{ padding: 5 }}>
              <Paper variant="outlined" square className={tabsStyle}>
                <Tabs
                  value={store.tabToolsIndex}
                  onChange={store.handleTabTool}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  {
                    EditorViewStore.TABS.map((tab, i) =>
                      <Tab key={i.toString()} label={store.dictionary.defValue(tab)} {...a11yProps(i)}
                           className={classes.tab} />)
                  }
                </Tabs>
              </Paper>
              <div className={classes.bordered} style={{ padding: 5, marginTop: 5, height: height - TABS_HEIGHT }}>
                {React.createElement(TabContent[store.tabToolsIndex], store.tabProps)}
              </div>
            </Grid>
          </Grid>
        </DndProvider>
      </div>
      <div style={{ position: "absolute", bottom: 20, left: "480px" }}>
        <ButtonGroup color="primary" variant="outlined">
          <Button disabled={!store.history.canUndo} onClick={() => store.history.undo()}>
            <Undo />
          </Button>
          <Button disabled={!store.history.canRedo} onClick={() => store.history.redo()}>
            <Redo />
          </Button>
        </ButtonGroup>
      </div>
      <Snackbar
        place="br"
        color="info"
        icon={AddAlert}
        message={Dictionary.defValue(DictionaryService.keys.dataSavedSuccessfully, Dictionary.defValue(DictionaryService.keys.data))}
        open={store.successRequest}
        closeNotification={() => store.setSuccessRequest(false)}
        close
      />
      <Snackbar
        place="br"
        color="danger"
        icon={Clear}
        message={Dictionary.defValue(DictionaryService.keys.dataSaveError, [Dictionary.defValue(DictionaryService.keys.data), store.error || ""])}
        open={store.hasError}
        closeNotification={() => store.setError(null)}
        close
      />
    </div>
  )
};

const Context = observer(ContextComponent);

function Editor(props: RouteComponentProps) {
  const match = matchPath<{ id: string }>(props.history.location.pathname, {
    path: "/editor/:id",
    exact: true,
    strict: false
  });
  const id = match ? Number(match.params.id) : null;
  const [store] = React.useState(new EditorViewStore());
  useEffect(() => {
    console.log("EditorView mount");
    store.checkLocalStorage();
    store.fetchProjectData(id);
    SharedControls.fetchItems().catch(err => console.log("Shared controls fetch error %s", err.message));
    SharedComponents.fetchItems().catch(err => console.log("Shared controls fetch error %s", err.message));
    when(() => App.loggedIn, async () => {
      try {
        await OwnComponents.fetchItems();
      } catch (err) {
        console.log("Own components error %s", err.message);
      }
    });
  }, []);
  return <Context store={store} />;
}

export default Editor;
