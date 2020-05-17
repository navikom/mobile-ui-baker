import React from 'react';
import { observer } from 'mobx-react-lite';
import { FormControl, makeStyles } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import EditorDictionary from 'views/Editor/store/EditorDictionary';
import IEditorTabsProps from 'interfaces/IEditorTabsProps';
import ColorInput from 'components/CustomInput/ColorInput';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { CloudUpload, Delete, LayersClear, SaveAlt, } from '@material-ui/icons';
import { blackOpacity, primaryOpacity, whiteOpacity } from 'assets/jss/material-dashboard-react';
import { Mode } from 'enums/ModeEnum';
import TextInput from 'components/CustomInput/TextInput';
import DialogAlert from 'components/Dialog/DialogAlert';
import { App } from 'models/App';
import Switch from '@material-ui/core/Switch';
import AccessEnum from 'enums/AccessEnum';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { TABS_HEIGHT } from '../../../../models/Constants';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

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

const ShareProjectComponent: React.FC<IEditorTabsProps> = (
  {
    dictionary,
    project,
    setAccess,
  }
) => {
  const [tooltip, setTooltip] = React.useState(dictionary!.defValue(EditorDictionary.keys.linkTo))
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
    const input = document.getElementById('copy') as HTMLInputElement & { select: () => void, setSelectionRange: (a: number, b: number) => void};
    if (input) {
      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand('copy');

      setTooltip(dictionary!.defValue(EditorDictionary.keys.linkCopied, input.value));
      setTimeout(() => {
        setTooltip(dictionary!.defValue(EditorDictionary.keys.copyLink));
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
    setAccess
  }
) => {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [dangerAction, setDangerAction] = React.useState<string | null>(null);
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
        title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.project)}`}>
        <IconButton size="small" onClick={() => saveProject && saveProject()} disabled={savingProject}>
          <CloudUpload />
        </IconButton>
      </Tooltip>
      <Tooltip
        className={classes.btn}
        title={`${dictionary!.defValue(EditorDictionary.keys.export)} ${dictionary!.defValue(EditorDictionary.keys.project)} ${dictionary!.defValue(EditorDictionary.keys.toFile)}`}>
        <IconButton size="small" onClick={() => saveProject && saveProject(true)}>
          <SaveAlt style={{ transform: 'rotate(180deg)' }} />
        </IconButton>
      </Tooltip>
      <Tooltip
        className={classes.btn}
        title={`${dictionary!.defValue(EditorDictionary.keys.import)} ${dictionary!.defValue(EditorDictionary.keys.project)} ${dictionary!.defValue(EditorDictionary.keys.fromFile)}`}>
        <IconButton size="small" onClick={importProject}>
          <SaveAlt />
        </IconButton>
      </Tooltip>
      <Tooltip
        className={classes.btn}
        title={`${dictionary!.defValue(EditorDictionary.keys.clear)} ${dictionary!.defValue(EditorDictionary.keys.project)}`}>
        <IconButton size="small" onClick={() => handleDangerAction(CLEAR)}>
          <LayersClear />
        </IconButton>
      </Tooltip>
      {
        App.user && project && project.owner && App.user.userId === project.owner.userId && (
          <Tooltip
            className={classes.btn}
            title={`${dictionary!.defValue(EditorDictionary.keys.delete)} ${dictionary!.defValue(EditorDictionary.keys.project)}`}>
            <IconButton size="small" onClick={() => handleDangerAction(DELETE)}>
              <Delete />
            </IconButton>
          </Tooltip>
        )
      }
    </Grid>
    <div style={{ height: `calc(100% - ${TABS_HEIGHT * 2 - 40}px)`, overflow: 'auto' }}>
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
          <ColorInput
            color={statusBarColor!.toString()}
            onChange={(e) => setStatusBarColor && setStatusBarColor(e)}
            label={dictionary!.defValue(EditorDictionary.keys.background)} />
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel
            style={{ marginBottom: 10 }}>{dictionary!.defValue(EditorDictionary.keys.background).toUpperCase()}</FormLabel>
          <ColorInput
            color={background!.backgroundColor}
            onChange={(e) => setBackground && setBackground({ backgroundColor: e })}
            label={dictionary!.defValue(EditorDictionary.keys.background)} />
        </FormControl>
      </Grid>
      {
        App.user && project && project.owner && App.user.userId === project.owner.userId &&
        <ShareProject dictionary={dictionary} project={project} setAccess={setAccess} />
      }
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
  </div>)
};

export default observer(ProjectTab);
