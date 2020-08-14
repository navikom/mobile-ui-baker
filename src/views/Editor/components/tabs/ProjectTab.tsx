import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { FormControl, makeStyles } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import EditorDictionary from 'views/Editor/store/EditorDictionary';
import IEditorTabsProps from 'interfaces/IEditorTabsProps';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import {
  CloudUpload,
  Delete,
  LayersClear,
  SaveAlt,
  PhonelinkSetup,
  Computer
} from '@material-ui/icons';
import { blackOpacity, primaryOpacity, whiteOpacity } from 'assets/jss/material-dashboard-react';
import { Mode } from 'enums/ModeEnum';
import TextInput from 'components/CustomInput/TextInput';
import DialogAlert from 'components/Dialog/DialogAlert';
import { App } from 'models/App';
import Switch from '@material-ui/core/Switch';
import AccessEnum from 'enums/AccessEnum';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { TABS_HEIGHT } from 'models/Constants';
import Typography from '@material-ui/core/Typography';
import AnimationParams from '../AnimationParams';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import LabeledInput from 'components/CustomInput/LabeledInput';
import FigmaIcon from 'components/Icons/FigmaIcon';
import Checkbox from '@material-ui/core/Checkbox';
import ColorPicker from '../ColorPicker';
import ProjectColors from './ProjectColors';
import ProjectBorders from './ProjectBorders';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  container: {
    marginTop: theme.typography.pxToRem(10),
    padding: 5
  },
  title: {
    marginTop: 5,
    padding: 5,
    backgroundColor: blackOpacity(0.05)
  },
  tools: {
    padding: 3,
    backgroundColor: blackOpacity(0.03)
  },
  input: {
    backgroundColor: blackOpacity(0.001),
    textOverflow: 'ellipsis',
    fontSize: 17
  },
  btn: {
    marginLeft: theme.typography.pxToRem(10)
  },
  copyRoot: {
    padding: '3px',
    fontSize: theme.typography.pxToRem(10),
    minWidth: 0
  },
  iconButton: {
    padding: 7
  },
  icon: {
    width: 15,
    height: 15
  },
  listItemText: {
    marginLeft: theme.typography.pxToRem(7)
  },
  figmaInput: {
    padding: theme.typography.pxToRem(4)
  }
}));

const sectionStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 5,
    marginBottom: 5,
    marginTop: 10,
    cursor: 'pointer'
  },
  rootEnabled: {
    backgroundColor: primaryOpacity(.08)
  },
  container: {
    margin: '5px 3px 10px',
    padding: '5px 10px',
    backgroundColor: whiteOpacity(.5),
    width: 'calc(100% - 10)'
  },
  closed: {
    fontSize: 0,
    margin: 0,
    opacity: 0,
    padding: 0,
    height: 0,
    overflow: 'hidden',
    transition: 'all .1s ease-in-out'
  },
  opened: {
    transition: 'all .1s ease-in-out'
  },
  input: {
    minWidth: theme.typography.pxToRem(230)
  }
}));

interface ImportMenuProps {
  dictionary: EditorDictionary;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  importFromFile: () => void;
  importFromFigma: () => void;
}

interface FigmaDialogProps {
  open: boolean;

  dictionary: EditorDictionary;

  loadAssetsEnabled: boolean;

  switchLoadAssets(): void;

  handleClose(): void;

  onChange(field: string): (e: any) => void;

  onFigmaDialogClick(): void;

  credentials: { token: string; key: string };
}

const FigmaDialog: React.FC<FigmaDialogProps> = observer((
  {
    open,
    handleClose,
    onChange,
    onFigmaDialogClick,
    credentials,
    loadAssetsEnabled,
    switchLoadAssets,
    dictionary
  }
) => {

  const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="figma-dialog-title">
        {dictionary.defValue(EditorDictionary.keys.downloadFromFigma)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {dictionary.defValue(EditorDictionary.keys.provideAccessTokenAndFileKeyToFetchDocument)}
        </DialogContentText>
        <FormControl fullWidth margin="dense">
          <LabeledInput
            label={dictionary.defValue(EditorDictionary.keys.accessToken)}
            fullWidth
            value={credentials.token}
            className={classes.input}
            onChange={onChange('token')}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <LabeledInput
            label={dictionary.defValue(EditorDictionary.keys.fileKey)}
            fullWidth
            value={credentials.key}
            className={classes.input}
            onChange={onChange('key')}
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={loadAssetsEnabled}
              onChange={switchLoadAssets}
              name="loadAssets"
              color="primary"
            />
          }
          label={dictionary.defValue(EditorDictionary.keys.downloadProjectAssets)}
        />
        <Grid container justify="center" style={{ marginTop: 20 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onFigmaDialogClick}
            disabled={!(credentials.token.length > 10 && credentials.key.length > 10)}>
            {dictionary.defValue(EditorDictionary.keys.download)}
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});

const ImportMenu: React.FC<ImportMenuProps> = (
  {
    anchorEl,
    handleClose,
    importFromFile,
    importFromFigma,
    dictionary
  }
) => {
  const classes = useStyles();

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {
        [
          [Computer, 'fromFile', importFromFile],
          [FigmaIcon, 'fromFigma', importFromFigma],
        ].map((item, i) => {
          return (
            <MenuItem key={i.toString()} onClick={item[2] as () => void}>
              {React.createElement(item[0] as React.FunctionComponent)}
              <ListItemText primary={dictionary.value(item[1] as string)} className={classes.listItemText} />
            </MenuItem>
          )
        })
      }
    </Menu>
  )
}

const ShareProjectComponent: React.FC<IEditorTabsProps> = (
  {
    dictionary,
    project,
    setAccess,
  }
) => {
  const [tooltip, setTooltip] = React.useState(dictionary!.defValue(EditorDictionary.keys.copy))
  const classes = useStyles();
  const section = sectionStyles();
  const shared = [AccessEnum.EDIT_BY_LINK, AccessEnum.READ_BY_LINK].includes(project!.access);

  const root = classNames({
    [section.root]: true,
    [section.rootEnabled]: shared,
  });

  const container = classNames({
    [section.container]: true,
    [section.opened]: shared,
    [section.closed]: !shared
  });

  const switchAccess = () => {
    setAccess && setAccess(shared ? AccessEnum.OWNER : AccessEnum.READ_BY_LINK);
  }

  const editOrReadAccess = () => {
    setAccess && setAccess(
      project!.access === AccessEnum.READ_BY_LINK ? AccessEnum.EDIT_BY_LINK : AccessEnum.READ_BY_LINK
    );
  }

  const copyToClipboard = () => {
    const input = document.getElementById('copy') as HTMLInputElement & { select: () => void; setSelectionRange: (a: number, b: number) => void };
    if (input) {
      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand('copy');

      setTooltip(dictionary!.defValue(EditorDictionary.keys.copied));
      setTimeout(() => {
        setTooltip(dictionary!.defValue(EditorDictionary.keys.copy));
      }, 3000);
    }

  }

  return (
    <>
      <Grid container alignItems="center" justify="space-between" className={root} onClick={switchAccess}>
        <Typography variant="body1">
          {`${dictionary!.defValue(EditorDictionary.keys.share)} ${dictionary!.defValue(EditorDictionary.keys.project)}`.toUpperCase()}
        </Typography>
        <Switch checked={shared} color="primary" />
      </Grid>
      <div className={container}>
        <Grid container className={classes.container}>
          <FormControl component="fieldset">
            <FormLabel>{dictionary!.defValue(EditorDictionary.keys.usersCan).toUpperCase()}</FormLabel>
            <RadioGroup row aria-label="mode" name="mode" value={project!.access} onChange={editOrReadAccess}>
              <FormControlLabel value={AccessEnum.READ_BY_LINK} control={<Radio color="primary" />}
                                label={dictionary!.defValue(EditorDictionary.keys.read)} />
              <FormControlLabel value={AccessEnum.EDIT_BY_LINK} control={<Radio color="primary" />}
                                label={dictionary!.defValue(EditorDictionary.keys.edit)} />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid container className={classes.container}>
          <FormControl component="fieldset">
            <FormLabel>
              {`${dictionary!.defValue(EditorDictionary.keys.linkTo)} ${dictionary!.defValue(EditorDictionary.keys.project)}`.toUpperCase()}
            </FormLabel>
            <Grid container>
              <InputBase
                id="copy"
                classes={{
                  input: section.input
                }}
                value={window.location.href}
                endAdornment={
                  <Tooltip title={tooltip}>
                    <Button
                      onClick={copyToClipboard}
                      classes={{
                        root: classes.copyRoot
                      }}
                      variant="outlined" size="small">{dictionary!.defValue(EditorDictionary.keys.copy)}
                    </Button>
                  </Tooltip>
                }
              />
            </Grid>
          </FormControl>
        </Grid>
      </div>
    </>
  )
};

const ShareProject = observer(ShareProjectComponent);

const CLEAR = 'clear';
const DELETE = 'delete';

const ProjectTab: React.FC<IEditorTabsProps> = (
  {
    mode,
    switchMode,
    background,
    setBackground,
    statusBarColor,
    setStatusBarColor,
    saveProject,
    savingProject,
    project,
    changeProjectTitle,
    dictionary,
    importProject,
    clearProject,
    deleteProject,
    setAccess,
    statusBarEnabled,
    switchStatusBar,
    navigation,
    setNavigation,
    generate,
    importFromFigma,
    loadAssetsEnabled,
    switchLoadAssets,
    setColor,
    setBorder
  }
) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openFigma, setOpenFigma] = React.useState<boolean>(false);
  const [dangerAction, setDangerAction] = React.useState<string | null>(null);
  const [figmaCreds, setFigmaCreds] = React.useState<{ token: string; key: string }>({ token: '', key: '' });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpenFigma = () => {
    handleClose();
    setOpenFigma(true);
  };

  const handleImportProject = () => {
    handleClose();
    importProject && importProject();
  };

  const handleCloseFigma = () => {
    setOpenFigma(false);
  };

  const onFigmaInputChange = (key: string) => (e: string) => {
    const obj = Object.assign({}, figmaCreds, { [key]: e });
    setFigmaCreds(obj);
  }

  const onFigmaDialogClick = () => {
    handleCloseFigma();
    importFromFigma && importFromFigma(figmaCreds.token, figmaCreds.key);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    // importFromFigma && importFromFigma('55587-de2833b2-2101-4361-be55-7923873c031f', 'Q09rBNMM7vskgeyXmJqEYu');
  };

  const handleDangerAction = (action: string) => {
    setDangerAction(action);
    setOpenDialog(true);
  }

  const handleAction = () => {
    if (dangerAction === CLEAR) {
      clearProject && clearProject();
    }
    if (dangerAction === DELETE) {
      deleteProject && deleteProject();
    }
  }
  const classes = useStyles();

  const dialogContent = dictionary!.value(dangerAction === CLEAR ? 'clearWarning' : 'deleteWarning', project!.title);

  return (<div className={classes.root}>
    <Grid container className={classes.title}>
      <TextInput
        fullWidth
        className={classes.input}
        value={project!.title}
        onChange={(e) => changeProjectTitle && changeProjectTitle(e.currentTarget.value)}
      />
    </Grid>
    <Grid container className={classes.tools}>
      <Tooltip
        placement="top"
        title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.project)}`}>
        <IconButton size="small"
                    onClick={() => saveProject && saveProject()}
                    disabled={savingProject}
                    className={classes.iconButton}>
          <CloudUpload className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Tooltip
        placement="top"
        className={classes.btn}
        title={`${dictionary!.defValue(EditorDictionary.keys.export)} ${dictionary!.defValue(EditorDictionary.keys.project)} ${dictionary!.defValue(EditorDictionary.keys.toFile)}`}>
        <IconButton size="small" onClick={() => saveProject && saveProject(true)} className={classes.iconButton}>
          <SaveAlt style={{ transform: 'rotate(180deg)' }} className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Tooltip
        placement="top"
        className={classes.btn}
        title={`${dictionary!.defValue(EditorDictionary.keys.import)} ${dictionary!.defValue(EditorDictionary.keys.project)}`}>
        <IconButton
          size="small"
          onClick={handleClick}
          className={classes.iconButton}>
          <SaveAlt className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Tooltip
        placement="top"
        className={classes.btn}
        title={`${dictionary!.defValue(EditorDictionary.keys.clear)} ${dictionary!.defValue(EditorDictionary.keys.project)}`}>
        <IconButton size="small" onClick={() => handleDangerAction(CLEAR)} className={classes.iconButton}>
          <LayersClear className={classes.icon} />
        </IconButton>
      </Tooltip>
      <Tooltip
        placement="top"
        className={classes.btn}
        title={`${dictionary!.defValue(EditorDictionary.keys.generate)} ${dictionary!.defValue(EditorDictionary.keys.reactNativePackage)}`}>
        <IconButton size="small" onClick={generate} className={classes.iconButton}>
          <PhonelinkSetup className={classes.icon} />
        </IconButton>
      </Tooltip>
      {
        App.user && project && project.owner && App.user.userId === project.owner.userId && (
          <Tooltip
            placement="top"
            className={classes.btn}
            title={`${dictionary!.defValue(EditorDictionary.keys.delete)} ${dictionary!.defValue(EditorDictionary.keys.project)}`}>
            <IconButton size="small" onClick={() => handleDangerAction(DELETE)} className={classes.iconButton}>
              <Delete className={classes.icon} />
            </IconButton>
          </Tooltip>
        )
      }
    </Grid>
    <div style={{ height: `calc(100% - ${TABS_HEIGHT + 10}px)`, overflow: 'auto' }}>
      <Grid container className={classes.container}>
        <FormControl component="fieldset">
          <FormLabel>{dictionary!.defValue(EditorDictionary.keys.mode).toUpperCase()}</FormLabel>
          <RadioGroup row aria-label="mode" name="mode" value={mode} onChange={switchMode}>
            <FormControlLabel value={Mode.WHITE} control={<Radio color="primary" />}
                              label={dictionary!.defValue(EditorDictionary.keys.white)} />
            <FormControlLabel value={Mode.DARK} control={<Radio color="primary" />}
                              label={dictionary!.defValue(EditorDictionary.keys.dark)} />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid container className={classes.container} justify="space-between">
        <FormControl component="fieldset">
          <FormLabel
            style={{ marginBottom: 10 }}>{dictionary!.defValue(EditorDictionary.keys.statusBar).toUpperCase()}</FormLabel>
          <Switch checked={statusBarEnabled} color="primary" onChange={switchStatusBar} />
        </FormControl>
      </Grid>
      <Grid container className={classes.container} justify="space-between">
        {
          statusBarEnabled && (
            <FormControl component="fieldset">
              <FormLabel
                style={{ marginBottom: 10 }}>
                {`${dictionary!.defValue(EditorDictionary.keys.statusBar)} ${dictionary!.defValue(EditorDictionary.keys.background)}`.toUpperCase()}
              </FormLabel>
              <ColorPicker
                dictionary={dictionary as EditorDictionary}
                color={statusBarColor!.toString()}
                onChange={(e) => setStatusBarColor && setStatusBarColor(e)}
                />
            </FormControl>
          )
        }
        <FormControl component="fieldset">
          <FormLabel
            style={{ marginBottom: 10 }}>{dictionary!.defValue(EditorDictionary.keys.background).toUpperCase()}</FormLabel>
          <ColorPicker
            dictionary={dictionary as EditorDictionary}
            color={background!.backgroundColor}
            onChange={(e) => setBackground && setBackground({ backgroundColor: e })}
            />
        </FormControl>
      </Grid>
      {
        App.user && project && project.owner && App.user.userId === project.owner.userId &&
        <ShareProject dictionary={dictionary} project={project} setAccess={setAccess} />
      }
      <br />
      <ProjectColors dictionary={dictionary as EditorDictionary} setColor={setColor} />
      <ProjectBorders dictionary={dictionary as EditorDictionary} setBorder={setBorder} />
      <AnimationParams
        isDelay={false}
        conditions={(navigation || []) as string[]}
        onChange={setNavigation as (e: (string | number)[]) => void}
        dictionary={dictionary as EditorDictionary}
      />
    </div>
    <DialogAlert
      open={openDialog}
      handleClose={() => setOpenDialog(false)}
      title={`${dictionary!.value(dangerAction === DELETE ? 'delete' : 'clear')} ${dictionary!.defValue(EditorDictionary.keys.project)}`}
      content={dialogContent}
      okTitle={dictionary!.defValue(EditorDictionary.keys.yes)}
      cancelTitle={dictionary!.defValue(EditorDictionary.keys.no)}
      onOk={handleAction}
    />
    <FigmaDialog
      onFigmaDialogClick={onFigmaDialogClick}
      credentials={figmaCreds}
      open={openFigma}
      dictionary={dictionary as EditorDictionary}
      handleClose={handleCloseFigma}
      loadAssetsEnabled={loadAssetsEnabled || false}
      switchLoadAssets={switchLoadAssets as () => void}
      onChange={onFigmaInputChange} />
    <ImportMenu
      dictionary={dictionary as EditorDictionary}
      importFromFile={handleImportProject}
      importFromFigma={handleClickOpenFigma}
      anchorEl={anchorEl}
      handleClose={handleClose} />
  </div>)
};

export default observer(ProjectTab);
