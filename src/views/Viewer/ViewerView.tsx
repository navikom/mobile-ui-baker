import { matchPath, RouteComponentProps } from 'react-router';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import ViewerViewStore from 'views/Viewer/store/ViewerViewStore';
import DeviceComponent from 'views/Editor/components/DeviceComponent';
import { IBackgroundColor } from 'interfaces/IProject';
import IControl from 'interfaces/IControl';
import EditorHeader from 'components/Header/EditorHeader';
import { DeviceEnum } from 'enums/DeviceEnum';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';
import ElementComponent from './components/ControlItem';
import Grid from '@material-ui/core/Grid';

import 'views/Viewer/Viewer.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: theme.typography.pxToRem(700)
    },
    content: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    margin: {
      marginTop: theme.typography.pxToRem(60)
    }
  })
);

interface ContentProps {
  ios: boolean;
  background: IBackgroundColor;
  items: IControl[];
  device: DeviceEnum;
  setCurrentScreen: (screen: IControl) => void;
}

const ContentComponent: React.FC<ContentProps> = (
  {
    background,
    device,
    items,
    setCurrentScreen
  }
) => {
  const classes = useStyles();
  const oldDevices = [DeviceEnum.IPHONE_6, DeviceEnum.PIXEL_5].includes(device);
  const root = oldDevices ? classNames(classes.content) : '';
  return (
    <div className={root} style={{ backgroundColor: background.backgroundColor }}>
      {
        items.map((control, i) => {
          return <ElementComponent
            setCurrentScreen={setCurrentScreen}
            key={control.id}
            control={control} />
        })
      }
    </div>
  )
};

const Content = observer(ContentComponent);

interface ContextComponentProps {
  store: ViewerViewStore;
  header: boolean | null;
}

const ContextComponent: React.FC<ContextComponentProps> = ({store, header}) => {
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);
  const classes = useStyles();
  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        setFullScreen(false);
      }
    }
    document.addEventListener('fullscreenchange', exitHandler, false);
    return () => {
      document.removeEventListener('fullscreenchange', exitHandler);
    }
  }, []);

  const switchFullscreen = () => {
    setFullScreen(!fullScreen);
    if (fullScreen) {
      document.exitFullscreen && document.exitFullscreen();
    } else {
      const elem = document.documentElement;
      elem.requestFullscreen && elem.requestFullscreen();
    }
  }

  const container = classNames({
    [classes.margin]: header
  });

  return (
    <div className={classes.root}>
      {
        header &&
        <EditorHeader
          position="fixed"
          viewer={true}
          store={store}
          fullScreen={fullScreen}
          switchFullscreen={switchFullscreen} />
      }
      <div className={container}>
        <DeviceComponent
          device={store.device}
          ios={store.ios}
          mode={store.mode}
          background={store.background}
          statusBarColor={store.statusBarColor}
          portrait={store.portrait}>
          <Content
            device={store.device}
            setCurrentScreen={(screen: IControl) => store.setCurrentScreen(screen)}
            ios={store.ios}
            background={store.background}
            items={store.currentScreen.children}
          />
        </DeviceComponent>
      </div>
    </div>
  )
};

const Context = observer(ContextComponent);

function Viewer(props: RouteComponentProps) {
  const match = matchPath<{ id: string; viewer: string}>(props.history.location.pathname, {
    path: '/:viewer/:id',
    exact: true,
    strict: false
  });
  const id = match ? Number(match.params.id) : null;
  const [store] = React.useState(new ViewerViewStore(props.location.search));
  console.log(33333, match, id);
  useEffect(() => {
    id && store.fetchProjectData(id);
    return () => {
      store.dispose();
    }
  }, [store, id]);
  return <Context store={store} header={match && match.params.viewer === 'screens'} />;
}

export default Viewer;
