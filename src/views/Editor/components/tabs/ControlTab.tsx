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
import CustomDragLayer from 'views/Editor/components/CustomDragLayer';
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
import { SharedComponents } from 'models/Project/SharedComponentsStore';
import { CreateFromInstance } from 'models/Control/ControlStores';
import { OwnComponents } from 'models/Project/OwnComponentsStore';

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
  }
}));

type ControlTabProps = IEditorTabsProps

const ControlTabComponent: React.FC<ControlTabProps> = (
  {
    dictionary,
    selectedControl,
    selectControl,
    deleteControl,
    importControl,
    importComponent
  }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const classes = useStyles();
  const keys = Object.keys(EditorViewStore.CONTROLS) as (keyof typeof ControlEnum)[];
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
    <div>
      <Typography align="center" variant="subtitle2" className={classes.paragraph}>
        {dictionary!.defValue(EditorDictionary.keys.elements)}
      </Typography>
      <div className={classes.container}>
        {
          keys.map((k, i) =>
            <ControlTabItem key={i.toString()} type={EditorViewStore.CONTROLS[k]} />)
        }
        <CustomDragLayer />
      </div>
      <Grid container alignItems="center" justify="space-between" className={classes.tools}>
        <Typography align="center" variant="subtitle2" className={classes.paragraph}>
          {dictionary!.defValue(EditorDictionary.keys.controls)}
        </Typography>
        {
          App.isAdmin && (
            <Tooltip
              title={`${dictionary!.defValue(EditorDictionary.keys.import)} ${dictionary!.defValue(EditorDictionary.keys.control)} ${dictionary!.defValue(EditorDictionary.keys.fromFile)}`}>
              <IconButton size="small" onClick={importControl}>
                <SaveAlt />
              </IconButton>
            </Tooltip>
          )
        }
      </Grid>
      <div className={classes.container}>
        {
          SharedControls.items.map((instance, i) => {
            const control = CreateFromInstance(instance);
            return <ControlTabItem key={i.toString()} control={control}
                                   handleMenu={isAdmin ? handleMenu(control) : () => {
                                   }} />
          })
        }
      </div>

      <Grid container alignItems="center" justify="space-between" className={classes.tools}>
        <Typography variant="subtitle2" className={classes.paragraph}>
          {dictionary!.defValue(EditorDictionary.keys.sharedComponents)}
        </Typography>
      </Grid>
      <div className={classes.container}>
        {
          SharedComponents.items.map((instance, i) => {
            const control = CreateFromInstance(instance);
            return <ControlTabItem key={i.toString()} control={control}
                                   handleMenu={isAdmin ? handleMenu(control) : () => {
                                   }} />
          })
        }
      </div>
      <Grid container alignItems="center" justify="space-between" className={classes.tools}>
        <Typography align="center" variant="subtitle2" className={classes.paragraph}>
          {dictionary!.defValue(EditorDictionary.keys.components)}
        </Typography>
        <Tooltip
          title={`${dictionary!.defValue(EditorDictionary.keys.import)} ${dictionary!.defValue(EditorDictionary.keys.control)} ${dictionary!.defValue(EditorDictionary.keys.fromFile)}`}>
          <IconButton size="small" onClick={importComponent}>
            <SaveAlt />
          </IconButton>
        </Tooltip>
      </Grid>

      <div className={classes.container}>
        {
          OwnComponents.items.map((instance, i) => {
            const control = CreateFromInstance(instance);
            return <ControlTabItem key={i.toString()} control={control} handleMenu={handleMenu(control)} />
          })
        }
      </div>
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
        <IconButton size="small" onClick={handleDelete}>
          <Delete />
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
    </div>
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
  }
) => {
  const classes = useStyles();
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
        <IconButton size="small" onClick={control!.switchVisibility}>
          {control!.visible ? <Visibility /> : <VisibilityOff color="disabled" />}
        </IconButton>
        <Tooltip title={dictionary.defValue(EditorDictionary.keys.lockChildren)} placement="top">
          <IconButton size="small" onClick={control!.switchLockChildren}>
            {control!.lockedChildren ? <Lock color="disabled" /> : <LockOpen />}
          </IconButton>
        </Tooltip>
        <Tooltip title={dictionary.defValue(EditorDictionary.keys.cloneControl)} placement="top">
          <IconButton size="small" onClick={() => cloneControl && cloneControl(control!)}>
            <FilterNone />
          </IconButton>
        </Tooltip>
        {
          App.isAdmin && (
            <Tooltip
              title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.control)}`}>
              <IconButton size="small" onClick={() => saveControl(control!)} disabled={control!.saving}>
                <CloudUpload />
              </IconButton>
            </Tooltip>
          )
        }
        {
          App.isAdmin && (
            <Tooltip
              title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.control)} ${dictionary!.defValue(EditorDictionary.keys.toFile)}`}>
              <IconButton size="small" onClick={() => saveControl(control!, true)} disabled={control!.saving}>
                <SaveAlt style={{ transform: 'rotate(180deg)' }} />
              </IconButton>
            </Tooltip>
          )
        }
        <Tooltip
          title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.component)}`}>
          <IconButton size="small" onClick={() => saveComponent(control!)} disabled={control?.saving}>
            <CloudUpload />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.component)} ${dictionary!.defValue(EditorDictionary.keys.toFile)}`}>
          <IconButton size="small" onClick={() => saveComponent(control!, true)} disabled={control?.saving}>
            <SaveAlt style={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        </Tooltip>
        <IconButton size="small" onClick={() => {
          isSelected!(control!) && selectControl!();
          control!.deleteSelf()
        }}>
          <Delete />
        </IconButton>
      </Grid>
      <div style={{ height: `calc(100% - ${TABS_HEIGHT * 2 - 10}px)`, overflow: 'auto' }}>
        <CSSProperties control={control as IControl} dictionary={dictionary} />
        <ControlActions screens={screens} control={control as IControl} dictionary={dictionary} />
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
  }
) => {
  const [element, setElement] = React.useState<IControl | undefined>();

  const deleteElement = () => {
    console.log('Delete control', element);
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
            dictionary={dictionary} /> :
          <ControlDetails
            saveControl={saveControl as (control: IControl) => void}
            saveComponent={saveComponent as (control: IControl) => void}
            selectControl={selectControl}
            control={selectedControl}
            isSelected={isSelected}
            screens={screens as IControl[]}
            cloneControl={cloneControl}
            dictionary={dictionary as EditorDictionary} />
      }
    </div>
  )
};

export default Control;
