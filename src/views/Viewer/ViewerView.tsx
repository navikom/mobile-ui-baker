import { matchPath, RouteComponentProps } from 'react-router';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Dialog, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ViewerViewStore from 'views/Viewer/store/ViewerViewStore';
import DeviceComponent from 'views/Editor/components/DeviceComponent';
import { IBackgroundColor } from 'interfaces/IProject';
import IControl from 'interfaces/IControl';
import EditorHeader from 'components/Header/EditorHeader';
import { DeviceEnum } from 'enums/DeviceEnum';
import ElementComponent from './components/ControlItem';

import 'views/Viewer/Viewer.css';
import { FIRST_CONTAINER, ROUTE_EDITOR, ROUTE_LOGIN, SECOND_CONTAINER } from 'models/Constants';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import { App } from 'models/App';
import { Transition } from 'components/Dialog/DialogAlert';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter';
import BuyTerms from 'components/Terms/BuyTerms';
import Snackbar from '../../components/Snackbar/Snackbar';
import AddAlert from '@material-ui/icons/AddAlert';
import { Clear } from '@material-ui/icons';
import CustomBackdrop from '../../components/Backdrop/Backdrop';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: theme.typography.pxToRem(700)
    },
    content: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      position: 'absolute',
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    margin: {
      marginTop: theme.typography.pxToRem(60)
    },
    zIndex: {
      zIndex: 1
    },
    cardRoot: {
      maxWidth: '80%',
      marginTop: theme.typography.pxToRem(50),
    },
    title: {
      fontSize: 30
    },
    description: {
      fontSize: 15,
      whiteSpace: 'pre-line',
      opacity: .8
    },
    pos: {
      marginBottom: 12,
    },
    buttons: {
      justifyContent: 'center'
    },
    price: {
      fontWeight: 'bold',
      fontSize: 27,
    },
  })
);

interface ContentProps {
  ios: boolean;
  background: IBackgroundColor;
  firstContainerVisible: boolean;
  firstItems: IControl[];
  secondItems: IControl[];
  device: DeviceEnum;
  portrait: number;
  setCurrentScreen: (action: string, screen?: IControl, behavior?: (string | number)[]) => void;
}

const ContentComponent: React.FC<ContentProps> = (
  {
    background,
    device,
    firstItems,
    secondItems,
    firstContainerVisible,
    setCurrentScreen,
    portrait
  }
) => {
  const classes = useStyles();
  const oldDevices = [DeviceEnum.IPHONE_6, DeviceEnum.PIXEL_5].includes(device);
  const root = classNames({
    [classes.content]: oldDevices,
    [classes.zIndex]: firstContainerVisible
  });
  const secondRoot = classNames({
    [classes.content]: oldDevices,
  });
  return (
    <>
      <div
        id={FIRST_CONTAINER}
        className={root}
        style={{ backgroundColor: background.backgroundColor }}>
        {
          firstItems.map((control, i) => {
            return <ElementComponent
              device={device}
              portrait={portrait as unknown as boolean}
              setCurrentScreen={setCurrentScreen}
              key={control.id}
              control={control} />
          })
        }
      </div>
      <div
        id={SECOND_CONTAINER}
        className={secondRoot}
        style={{ backgroundColor: background.backgroundColor }}>
        {
          secondItems.map((control, i) => {
            return <ElementComponent
              device={device}
              portrait={portrait as unknown as boolean}
              setCurrentScreen={setCurrentScreen}
              key={control.id}
              control={control} />
          })
        }
      </div>
    </>
  )
};

const Content = observer(ContentComponent);

const DeviceContent: React.FC<{ store: ViewerViewStore }> = observer(({ store }) => (
  <DeviceComponent
    device={store.device}
    ios={store.ios}
    mode={store.screenMode}
    background={store.screenBackground}
    statusBarEnabled={store.screenStatusBarEnabled}
    statusBarColor={store.screenStatusBarColor}
    scale={store.scale}
    portrait={(store.portrait ? 1 : 0) as unknown as boolean}>
    <Content
      device={store.device}
      portrait={store.portrait ? 1 : 0}
      setCurrentScreen={(action: string, screen?: IControl, behavior?: (string | number)[]) =>
        store.setCurrentScreenAnimate(action, screen, behavior)}
      firstContainerVisible={store.firstContainerVisible}
      ios={store.ios}
      background={store.screenBackground}
      firstItems={store.firstScreen ? store.firstScreen.children : []}
      secondItems={store.secondScreen ? store.secondScreen.children : []}
    />
  </DeviceComponent>
));

interface ContextComponentProps {
  store: ViewerViewStore;
  header: boolean | null;
}

const ContextComponent: React.FC<ContextComponentProps> = ({ store, header }) => {
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
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

  const closeDialog = () => setOpen(false);
  const openDialog = () => setOpen(true);

  const purchase = () => {
    store.checkout();
    closeDialog();
  }

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
      {
        !header && (
          <div className={container}>
            <DeviceContent store={store} />
          </div>
        )
      }
      {
        header && (
          <div className={container}>
            <Grid container>
              <Grid item xs={12} sm={7} md={7} style={{overflow: 'auto'}}>
                <DeviceContent store={store} />
              </Grid>
              <Grid item xs={12} sm={5} md={5}>
                <Card className={classes.cardRoot}>
                  <CardHeader color="primary">
                    <Grid container justify="space-between">
                      <Typography variant="h3">{store.project.title}</Typography>
                      {
                        store.project.price > 0 && (
                          <Typography className={classes.price}>
                            {' $'}{(store.project.price / 100).toFixed(2)}
                          </Typography>
                        )
                      }
                    </Grid>
                  </CardHeader>
                  <CardBody>
                    <Typography className={classes.description} gutterBottom>
                      {store.project.description}
                    </Typography>
                  </CardBody>
                  <CardFooter className={classes.buttons}>
                    {
                      store.project.editorAvailable ? (
                        <Button
                          onClick={
                            () => App.navigationHistory && App.navigationHistory.replace(`${ROUTE_EDITOR}/${store.project.projectId}`)
                          }
                          color="primary"
                          variant="outlined"
                        >
                          {Dictionary.defValue(DictionaryService.keys.openInEditor)}
                        </Button>
                      ) : store.project.accessRead ? null : App.loggedIn ? (
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={openDialog}
                        >
                          {Dictionary.defValue(DictionaryService.keys.buy)}
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => App.navigationHistory && App.navigationHistory.replace(ROUTE_LOGIN)}
                        >
                          {Dictionary.defValue(DictionaryService.keys.login)}
                        </Button>
                      )
                    }
                  </CardFooter>
                </Card>
              </Grid>
            </Grid>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={closeDialog}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                {Dictionary.defValue(DictionaryService.keys.agreementTitle)}
              </DialogTitle>
              <BuyTerms />
              <DialogActions>
                <Button onClick={purchase} color="primary" variant="outlined">
                  {Dictionary.defValue(DictionaryService.keys.iAgree)}
                </Button>
                <Button onClick={closeDialog} variant="outlined">
                  {Dictionary.defValue(DictionaryService.keys.cancel)}
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar
              place="br"
              color="info"
              icon={AddAlert}
              message={Dictionary.defValue(DictionaryService.keys.weThankYouForPurchasing, store.project.title)}
              open={store.paymentSuccess}
              closeNotification={() => store.setPaymentSuccess(false)}
              close
            />
            <Snackbar
              place="br"
              color="danger"
              icon={Clear}
              message={Dictionary.defValue(DictionaryService.keys.weAreSorryButYourCurrent)}
              open={store.paymentFailure}
              closeNotification={() => store.setPaymentFailure(false)}
              close
            />
          </div>
        )
      }
      <CustomBackdrop open={store.fetchingProject} />
    </div>
  )
};

const Context = observer(ContextComponent);

function Viewer(props: RouteComponentProps) {
  const match = matchPath<{ id: string; viewer: string }>(props.history.location.pathname, {
    path: '/:viewer/:id',
    exact: true,
    strict: false
  });
  const id = match ? Number(match.params.id) : null;
  const [store] = React.useState(new ViewerViewStore(props.location.search));
  useEffect(() => {
    id && store.fetchProjectData(id);
    return () => {
      store.dispose();
    }
  }, [store, id]);
  return <Context store={store} header={match && match.params.viewer === 'screens'} />;
}

export default Viewer;
