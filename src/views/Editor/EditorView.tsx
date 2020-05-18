import React, { useEffect } from 'react';
import { matchPath } from 'react-router';
import { RouteComponentProps } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { DndProvider, useDrop } from 'react-dnd';
import classNames from 'classnames';
import Backend from 'react-dnd-html5-backend';
import { observer } from 'mobx-react-lite';

// @material-ui/core
import { createStyles, Theme, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import {
  Clear,
  Redo,
  Undo
} from '@material-ui/icons';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Skeleton } from '@material-ui/lab';

import DeviceComponent from 'views/Editor/components/DeviceComponent';
import EditorViewStore, { DragAndDropItem } from 'views/Editor/store/EditorViewStore';
import ControlTab from 'views/Editor/components/tabs/ControlTab';
import ControlItem from 'views/Editor/components/control/ControlItem';
import { ItemTypes } from 'views/Editor/store/ItemTypes';
import IControl from 'interfaces/IControl';
import { DropEnum } from 'enums/DropEnum';
import TreeComponent from 'views/Editor/components/TreeComponent';
import { TABS_HEIGHT } from 'models/Constants';
import ProjectTab from 'views/Editor/components/tabs/ProjectTab';
import { blackOpacity, whiteColor, whiteOpacity } from 'assets/jss/material-dashboard-react';
import { IBackgroundColor } from 'interfaces/IProject';
import AddAlert from '@material-ui/icons/AddAlert';
import Snackbar from 'components/Snackbar/Snackbar';
import { SharedControls } from 'models/Project/ControlsStore';
import { SharedComponents } from 'models/Project/SharedComponentsStore';
import { when } from 'mobx';
import { App } from 'models/App';
import { OwnComponents } from 'models/Project/OwnComponentsStore';

import { DeviceEnum } from 'enums/DeviceEnum';
import EditorHeader from 'components/Header/EditorHeader';
import CustomDragLayer from './components/CustomDragLayer';

import 'views/Editor/Editor.css';

const contentStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })
);

interface ContentProps {
  items: IControl[];
  moveControl: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  handleDropCanvas: (item: DragAndDropItem) => void;
  handleDropElement: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  selectControl: (control?: IControl) => void;
  isSelected: (control: IControl) => boolean;
  setCurrentScreen: (screen: IControl) => void;
  background: IBackgroundColor;
  ios: boolean;
  device: DeviceEnum;
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
    device,
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

  const oldDevices = [DeviceEnum.IPHONE_6, DeviceEnum.PIXEL_5].includes(device);
  const root = oldDevices ? classNames(classes.root) : '';
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
      overflowY: 'hidden'
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
    cover: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: whiteOpacity(0.8),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      maxHeight: '2000px'
    },
    coverInactive: {
      height: 0,
      maxHeight: 0,
      transition: 'height .15s, max-height .15s ease-out'
    },
    historyButtons: {
      position: 'absolute',
      bottom: 20,
      right: -130,
      zIndex: 99
    }
  })
);

const Preview = () => {
  return (
    <React.Fragment>
      <div style={{ width: '25%', height: '75%' }}>
        <Skeleton variant="rect" animation="wave" height="90%" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="75%" />
      </div>
      <div style={{ width: '45%', height: '75%' }}>
        <Skeleton variant="rect" animation="wave" height="90%" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="60%" />
      </div>
      <div style={{ width: '25%', height: '75%' }}>
        <Skeleton variant="rect" animation="wave" height="90%" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="60%" />
      </div>
    </React.Fragment>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
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
  const [height, setHeight] = React.useState(window.innerHeight);
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);
  const classes = editorStyles();

  useEffect(() => {
    const resize = () => {
      setHeight(window.innerHeight);
    };
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        setFullScreen(false);
      }
    }
    window.addEventListener('resize', resize, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('fullscreenchange', exitHandler);
    }
  }, [height]);

  const switchFullscreen = () => {
    setFullScreen(!fullScreen);
    if (fullScreen) {
      document.exitFullscreen && document.exitFullscreen();
    } else {
      const elem = document.documentElement;
      elem.requestFullscreen && elem.requestFullscreen();
    }
  }

  const tabsStyle = classNames(classes.tabs);
  const cover = classNames({
    [classes.cover]: true,
    [classes.coverInactive]: !store.loadingPlugin
  });

  return (
    <div className={classes.root} style={{ height }}>
      {
        !store.pluginStore.data.hideHeader &&
        <EditorHeader store={store} fullScreen={fullScreen} switchFullscreen={switchFullscreen} />
      }
      <div style={{ marginTop: 65}}>
        <DndProvider debugMode={true} backend={Backend}>
          <CustomDragLayer />
          <Grid container style={{ height: '100%' }}>
            <Grid item xs={2} sm={2} md={3} style={{ padding: 5, position: 'relative' }}>
              <div className={classes.bordered} style={{ overflow: 'auto', height: height - TABS_HEIGHT }}>
                <TreeComponent
                  screens={store.screens}
                  moveControl={store.moveControl}
                  handleDropCanvas={store.handleDropCanvas}
                  handleDropElement={store.handleDropElement}
                  isCurrent={store.isCurrent}
                  setCurrentScreen={(screen: IControl) => store.setCurrentScreen(screen)}
                  addScreen={store.addScreen}
                  removeScreen={store.removeScreen}
                  dictionary={store.dictionary}
                  cloneControl={store.cloneControl}
                  cloneScreen={store.cloneScreen}
                  selectControl={store.selectControl}
                  isSelected={store.isSelected}
                />
              </div>
              <div className={classes.historyButtons}>
                <ButtonGroup color="primary" variant="outlined">
                  <Button disabled={!store.history.canUndo} onClick={() => store.history.undo()}>
                    <Undo />
                  </Button>
                  <Button disabled={!store.history.canRedo} onClick={() => store.history.redo()}>
                    <Redo />
                  </Button>
                </ButtonGroup>
              </div>
            </Grid>
            <Grid item xs={7} sm={7} md={6} style={{ padding: 5 }}>
              <div className={classes.bordered} style={{ overflow: 'auto', height: height - TABS_HEIGHT }}>
                <div style={{ transform: 'translate3d(0, 0, 0)' }}>
                  <div style={{ transform: 'scale(1)' }}>
                    <DeviceComponent
                      device={store.device}
                      ios={store.ios}
                      mode={store.mode}
                      background={store.background}
                      statusBarColor={store.statusBarColor}
                      portrait={store.portrait}>
                      <Content
                        device={store.device}
                        ios={store.ios}
                        background={store.background}
                        items={store.currentScreen.children}
                        moveControl={store.moveControl}
                        handleDropCanvas={store.handleDropCanvas}
                        handleDropElement={store.handleDropElement}
                        selectControl={store.selectControl}
                        isSelected={store.isSelected}
                        setCurrentScreen={(screen: IControl) => store.setCurrentScreen(screen)}
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
              <div className={classes.bordered} style={{ padding: 5, marginTop: 5, height: height - TABS_HEIGHT * 2 + 11 }}>
                {React.createElement(TabContent[store.tabToolsIndex], store.tabProps)}
              </div>
            </Grid>
          </Grid>
        </DndProvider>
      </div>
      <Snackbar
        place="br"
        color="info"
        icon={AddAlert}
        message={store.successMessage}
        open={store.successRequest}
        closeNotification={() => store.setSuccessRequest(false)}
        close
      />
      <Snackbar
        place="br"
        color="danger"
        icon={Clear}
        message={store.error || ''}
        open={store.hasError}
        closeNotification={() => store.setError(null)}
        close
      />
      <div className={cover}>
        {
          store.loadingPlugin && <Preview />
        }
      </div>
    </div>
  )
};

const Context = observer(ContextComponent);

function Editor(props: RouteComponentProps) {
  const match = matchPath<{ id: string }>(props.history.location.pathname, {
    path: '/editor/:id',
    exact: true,
    strict: false
  });
  const id = match ? Number(match.params.id) : null;
  const [store] = React.useState(new EditorViewStore(props.location.search));
  useEffect(() => {
    store.checkLocalStorage().then(() => {
      id && store.fetchProjectData(id);
    });
    SharedControls.fetchItems().catch(err => console.log('Shared controls fetch error %s', err.message));
    SharedComponents.fetchItems().catch(err => console.log('Shared controls fetch error %s', err.message));
    when(() => App.loggedIn, async () => {
      try {
        await OwnComponents.fetchItems();
      } catch (err) {
        console.log('Own components error %s', err.message);
      }
    });
    return () => {
      store.dispose();
    }
  }, [store, id]);
  return <Context store={store} />;
}

export default Editor;
