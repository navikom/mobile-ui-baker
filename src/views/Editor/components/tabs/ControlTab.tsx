import React from 'react';
import { makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import {
  CloudUpload,
  Delete,
  FilterNone,
  KeyboardArrowUp,
  Lock,
  LockOpen, SaveAlt,
  Visibility,
  VisibilityOff
} from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';

import { ControlEnum } from 'enums/ControlEnum';
import EditorViewStore from 'views/Editor/store/EditorViewStore';
import ControlTabItem from 'views/Editor/components/tabs/ControlTabItem';
import IEditorTabsProps from 'interfaces/IEditorTabsProps';
import IControl from 'interfaces/IControl';
import CSSProperties from 'views/Editor/components/tabs/CSSProperties';
import EditorDictionary from 'views/Editor/store/EditorDictionary';
import { TABS_HEIGHT } from 'models/Constants';
import ControlActions from 'views/Editor/components/tabs/ControlActions';
import TextInput from 'components/CustomInput/TextInput';
import DialogAlert from 'components/Dialog/DialogAlert';
import { App } from 'models/App';
import { blackOpacity, primaryOpacity } from 'assets/jss/material-dashboard-react';
import { SharedControls } from 'models/Project/ControlsStore';
import { CreateForMenu } from 'models/Control/ControlStores';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import { ScreenMetaEnum } from 'enums/ScreenMetaEnum';
import { TextMetaEnum } from 'enums/TextMetaEnum';
import IProject from 'interfaces/IProject';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  disableDetailsButton: {
    backgroundColor: primaryOpacity(.05)
  },
  paragraph: {
    margin: '4px 0'
  },
  title: {
    marginTop: 5,
    padding: 5,
    backgroundColor: blackOpacity(0.05)
  },
  id: {
    marginTop: 5,
    padding: 5,
    backgroundColor: blackOpacity(0.02),
    opacity: 0.5
  },
  meta: {
    marginTop: 5,
    padding: 5,
    backgroundColor: blackOpacity(0.02),
    opacity: 0.8
  },
  tools: {
    padding: 3,
    backgroundColor: blackOpacity(0.03)
  },
  input: {
    backgroundColor: blackOpacity(0.001),
    textOverflow: 'ellipsis',
  },
  menu: {
    borderRadius: '50%'
  },
  iconButton: {
    padding: 7
  },
  icon: {
    width: 15,
    height: 15
  },
  box: {
    height: 'calc(100% - 120px)',
    overflow: 'auto'
  }
}));

interface ControlInstanceProps {
  isAdmin: boolean;
  handleMenu: (control: IControl) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  items: IProject[];
}

const ControlInstance: React.FC<ControlInstanceProps> =
  observer(({ isAdmin, handleMenu, items }) => {
    const classes = useStyles();

    const handler = React.useCallback((control: IControl) => {
      return handleMenu(control);
    }, []);

    return (
      <div className={classes.container}>
        {
          items.map((instance, i) => {
            const control = CreateForMenu(instance);
            return <ControlTabItem
              key={i.toString()}
              control={control}
              handleMenu={handler(control)} />
          })
        }
      </div>
    )
  });

type ControlTabProps = IEditorTabsProps

const ControlTabComponent: React.FC<ControlTabProps> = (
  {
    dictionary,
    selectedControl,
    selectControl,
    deleteControl,
    importControl,
    importComponent,
    ownComponents
  }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const classes = useStyles();
  const keys = Object.keys(EditorViewStore.CONTROLS).filter(e => e !== ControlEnum.Screen) as (keyof typeof ControlEnum)[];
  const open = Boolean(anchorEl);
  const isAdmin = App.isAdmin;

  const handleMenu = (control: IControl) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    selectControl && selectControl(control);
  };

  const handleDialogClose = () => setOpenDialog(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setOpenDialog(true);
    handleClose();
  };

  const title = selectedControl && selectedControl.instance && selectedControl.instance.type ? ['control', 'component'][selectedControl.instance.type] : 'control';

  const dialogContent =
    dictionary!.defValue(EditorDictionary.keys.deleteWarning, `${dictionary!.value(title)} "${selectedControl && selectedControl.title}"`);

  return (
    <React.Fragment>
      <Typography align="center" variant="subtitle2" className={classes.paragraph}>
        {dictionary!.defValue(EditorDictionary.keys.elements)}
      </Typography>
      <div className={classes.container}>
        {
          keys.map((k, i) =>
            <ControlTabItem key={i.toString()} type={EditorViewStore.CONTROLS[k]} />)
        }
      </div>
      {
        SharedControls.size > 10000 && (
          <Grid container alignItems="center" justify={App.isAdmin ? 'space-between' : 'center'}
                className={classes.tools}>
            <Typography align="center" variant="subtitle2" className={classes.paragraph}>
              {dictionary!.defValue(EditorDictionary.keys.controls)}
            </Typography>
            {
              App.isAdmin && (
                <Tooltip
                  title={`${dictionary!.defValue(EditorDictionary.keys.import)} ${dictionary!.defValue(EditorDictionary.keys.control)} ${dictionary!.defValue(EditorDictionary.keys.fromFile)}`}>
                  <IconButton size="small" onClick={importControl} className={classes.iconButton}>
                    <SaveAlt className={classes.icon} />
                  </IconButton>
                </Tooltip>
              )
            }
          </Grid>
        )
      }

      <Grid container alignItems="center" justify="space-between" className={classes.tools}>
        <Typography align="center" variant="subtitle2" className={classes.paragraph}>
          {dictionary!.defValue(EditorDictionary.keys.components)}
        </Typography>
        <Tooltip
          title={`${dictionary!.defValue(EditorDictionary.keys.import)} ${dictionary!.defValue(EditorDictionary.keys.control)} ${dictionary!.defValue(EditorDictionary.keys.fromFile)}`}>
          <IconButton size="small" onClick={importComponent} className={classes.iconButton}>
            <SaveAlt className={classes.icon} />
          </IconButton>
        </Tooltip>
      </Grid>

      {
        ownComponents && ownComponents.length > 0 && (
          <div className={classes.box}>
            <ControlInstance isAdmin={isAdmin} handleMenu={handleMenu} items={ownComponents} />
          </div>

          )
      }
      <Popover
        id="menu-controls"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        onClose={handleClose}
        classes={{
          paper: classes.menu
        }}
      >
        <IconButton size="small" onClick={handleDelete} className={classes.iconButton}>
          <Delete className={classes.icon} />
        </IconButton>
      </Popover>
      <DialogAlert
        open={openDialog}
        handleClose={handleDialogClose}
        title={`${dictionary!.defValue(EditorDictionary.keys.delete)} ${dictionary!.defValue(EditorDictionary.keys.action)}`}
        content={dialogContent}
        okTitle={dictionary!.defValue(EditorDictionary.keys.yes)}
        cancelTitle={dictionary!.defValue(EditorDictionary.keys.no)}
        onOk={() => {
          deleteControl && selectedControl && deleteControl(selectedControl);
        }}
        onCancel={() => selectControl && selectControl()}
      />
    </React.Fragment>
  )
};

const ControlTab = observer(ControlTabComponent);

interface ControlDetailsProps {
  selectControl?: (control?: IControl) => void;
  cloneControl?: (control: IControl) => void;
  isSelected?: (control: IControl) => boolean;
  control?: IControl;
  dictionary: EditorDictionary;
  screens: IControl[];
  saveControl: (control: IControl, toFile?: boolean) => void;
  saveComponent: (control: IControl, toFile?: boolean) => void;
  metaList: string[][];
  setMeta: (meta: ScreenMetaEnum | TextMetaEnum, control: IControl) => void;
}

const ControlDetails: React.FC<ControlDetailsProps> = observer((
  {
    selectControl,
    control,
    dictionary,
    cloneControl,
    isSelected,
    saveControl,
    saveComponent,
    screens,
    metaList,
    setMeta
  }
) => {
  const classes = useStyles();
  const screenMetaList = metaList.slice();
  const textMetaList = Object.values(TextMetaEnum).map(e => [e, dictionary.value(e)]);
  if (!screenMetaList.find(e => e[0] === control!.meta)) {
    screenMetaList.push([control!.meta, dictionary.value(control!.meta)]);
  }

  return (
    <div style={{ height: '100%' }}>
      <Tooltip
        title={`${dictionary.defValue(EditorDictionary.keys.goTo)} ${dictionary.defValue(EditorDictionary.keys.controls)}`}
        placement="top">
        <Button fullWidth variant="outlined" onClick={() => selectControl && selectControl()}>
          <KeyboardArrowUp />
        </Button>
      </Tooltip>
      <Grid container className={classes.title}>
        <TextInput
          fullWidth
          className={classes.input}
          value={control!.title}
          onChange={(e) => control!.changeTitle(e.currentTarget.value)}
        />
      </Grid>
      <Grid container justify="space-between" className={classes.tools}>
        <IconButton size="small" onClick={control!.switchVisibility} className={classes.iconButton}>
          {control!.visible ? <Visibility className={classes.icon} /> : <VisibilityOff color="disabled" className={classes.icon} />}
        </IconButton>
        <Tooltip title={dictionary.defValue(EditorDictionary.keys.lockChildren)} placement="top">
          <IconButton size="small" onClick={control!.switchLockChildren} className={classes.iconButton}>
            {control!.lockedChildren ? <Lock color="disabled" className={classes.icon} /> : <LockOpen className={classes.icon} />}
          </IconButton>
        </Tooltip>
        <Tooltip title={dictionary.defValue(EditorDictionary.keys.cloneControl)} placement="top">
          <IconButton size="small" onClick={() => cloneControl && cloneControl(control!)} className={classes.iconButton}>
            <FilterNone className={classes.icon} />
          </IconButton>
        </Tooltip>
        {
          App.isAdmin && (
            <Tooltip
              title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.control)}`}>
              <IconButton
                size="small" onClick={() => saveControl(control!)}
                className={classes.iconButton}
                disabled={control!.saving}>
                <CloudUpload className={classes.icon} />
              </IconButton>
            </Tooltip>
          )
        }
        {
          App.isAdmin && (
            <Tooltip
              title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.control)} ${dictionary!.defValue(EditorDictionary.keys.toFile)}`}>
              <IconButton
                size="small"
                onClick={() => saveControl(control!, true)}
                className={classes.iconButton}
                disabled={control!.saving}>
                <SaveAlt className={classes.icon} style={{ transform: 'rotate(180deg)' }} />
              </IconButton>
            </Tooltip>
          )
        }
        <Tooltip
          title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.component)}`}>
          <IconButton
            size="small"
            onClick={() => saveComponent(control!)}
            className={classes.iconButton}
            disabled={control?.saving}>
            <CloudUpload className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.component)} ${dictionary!.defValue(EditorDictionary.keys.toFile)}`}>
          <IconButton
            size="small"
            onClick={() => saveComponent(control!, true)}
            className={classes.iconButton}
            disabled={control?.saving}>
            <SaveAlt className={classes.icon} style={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        </Tooltip>
        <IconButton size="small" className={classes.iconButton} onClick={() => {
          isSelected!(control!) && selectControl!();
          control!.deleteSelf()
        }}>
          <Delete className={classes.icon} />
        </IconButton>
      </Grid>
      <div style={{ height: `calc(100% - ${TABS_HEIGHT * 2 - 35}px)`, overflow: 'auto' }}>
        <Grid container className={classes.id}>
          <Typography variant="body2">#{control!.id}</Typography>
        </Grid>
        <Typography variant="subtitle2" align="center"
                    className={classes.paragraph}>
          {dictionary.defValue(EditorDictionary.keys.meta)}{' '}
          ({dictionary.value(control!.meta)})
        </Typography>
        <Grid container className={classes.meta} alignItems="center">
          <Grid item xs={12} sm={6} md={6}>
            <Typography>{dictionary.value(EditorDictionary.keys.availableMeta)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            {
              control!.type === ControlEnum.Grid ? (
                <CustomSelect fullWidth value={control!.meta} options={screenMetaList}
                              onChange={(e) => setMeta(e as ScreenMetaEnum, control!)} />
              ) : (
                <CustomSelect fullWidth value={control!.meta} options={textMetaList}
                              onChange={(e) => setMeta(e as TextMetaEnum, control!)} />
              )
            }
          </Grid>
        </Grid>
        <CSSProperties control={control as IControl} dictionary={dictionary} />
        {
          control!.type === ControlEnum.Grid && !control!.hasImage &&
          <ControlActions screens={screens} control={control as IControl} dictionary={dictionary} />
        }
      </div>

    </div>
  )
});

const Control: React.FC<IEditorTabsProps> = (
  {
    selectedControl,
    selectControl,
    dictionary,
    cloneControl,
    isSelected,
    saveControl,
    saveComponent,
    screens,
    deleteControl,
    importControl,
    importComponent,
    metaList,
    setMeta,
    ownComponents
  }
) => {
  const [element, setElement] = React.useState<IControl | undefined>();

  const deleteElement = () => {
    deleteControl && element && deleteControl(element);
    setElement(undefined);
  };

  const selectElement = (element?: IControl) => {
    setElement(element);
  };

  return (
    <div style={{ height: '100%' }}>
      {
        selectedControl === undefined ?
          <ControlTab
            selectedControl={element}
            selectControl={selectElement}
            deleteControl={deleteElement}
            importComponent={importComponent}
            importControl={importControl}
            ownComponents={ownComponents}
            dictionary={dictionary} /> :
          <ControlDetails
            saveControl={saveControl as (control: IControl) => void}
            saveComponent={saveComponent as (control: IControl) => void}
            selectControl={selectControl}
            control={selectedControl}
            isSelected={isSelected}
            screens={screens as IControl[]}
            cloneControl={cloneControl}
            metaList={metaList as string[][]}
            setMeta={setMeta as (meta: ScreenMetaEnum | TextMetaEnum, control: IControl) => void}
            dictionary={dictionary as EditorDictionary} />
      }
    </div>
  )
};

export default Control;
