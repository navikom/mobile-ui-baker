import React from "react";
import { makeStyles } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import {
  CloudUpload,
  Delete,
  FilterNone,
  KeyboardArrowUp,
  Lock,
  LockOpen,
  Visibility,
  VisibilityOff
} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import { ControlEnum } from "enums/ControlEnum";
import EditorViewStore from "views/Editor/store/EditorViewStore";
import ControlTabItem from "views/Editor/components/tabs/ControlTabItem";
import CustomDragLayer from "views/Editor/components/CustomDragLayer";
import IEditorTabsProps from "interfaces/IEditorTabsProps";
import IControl from "interfaces/IControl";
import CSSProperties from "views/Editor/components/tabs/CSSProperties";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import { TABS_HEIGHT } from "models/Constants";
import ControlActions from "views/Editor/components/tabs/ControlActions";
import TextInput from "components/CustomInput/TextInput";
import { App } from "models/App";
import { blackOpacity, primaryOpacity } from "assets/jss/material-dashboard-react";
import { SharedControls } from "models/Project/ControlsStore";
import { SharedComponents } from "models/Project/SharedComponentsStore";
import { CreateFromInstance } from "models/Control/ControlStores";
import { OwnComponents } from "models/Project/OwnComponentsStore";
import Popover from "@material-ui/core/Popover";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  disableDetailsButton: {
    backgroundColor: primaryOpacity(.05)
  },
  paragraph: {
    margin: "4px 0"
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
    textOverflow: "ellipsis",
  },
  menu: {
    borderRadius: "50%"
  }
}));

const ControlTab: React.FC<IEditorTabsProps> = ({ dictionary, deleteControl }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [control, selectControl] = React.useState<IControl | null>(null);
  const classes = useStyles();
  const keys = Object.keys(EditorViewStore.CONTROLS) as (keyof typeof ControlEnum)[];
  const open = Boolean(anchorEl);
  const isAdmin = App.user && App.user.isAdmin;

  const handleMenu = (control: IControl) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    selectControl(control);
  };

  const handleClose = () => {
    setAnchorEl(null);
    selectControl(null);
  };

  const handleDelete = () => {
    // todo show alert before delete
    // deleteControl && control && deleteControl(control);
    handleClose();
  };

  return (
    <div>
      <Typography align="center" variant="subtitle1" className={classes.paragraph}>
        {dictionary!.defValue(EditorDictionary.keys.elements)}
      </Typography>
      <div className={classes.container}>
        {
          keys.map((k, i) =>
            <ControlTabItem key={i.toString()} type={EditorViewStore.CONTROLS[k]} />)
        }
        <CustomDragLayer />
      </div>
      <Typography align="center" variant="subtitle1" className={classes.paragraph}>
        {dictionary!.defValue(EditorDictionary.keys.controls)}
      </Typography>
      <div className={classes.container}>
        {
          SharedControls.items.map((instance, i) => {
            const control = CreateFromInstance(instance);
            return <ControlTabItem key={i.toString()} control={control} handleMenu={isAdmin ? handleMenu(control) : () => {}} />
          })
        }
      </div>
      <Typography align="center" variant="subtitle1" className={classes.paragraph}>
        {dictionary!.defValue(EditorDictionary.keys.sharedComponents)}
      </Typography>
      <div className={classes.container}>
        {
          SharedComponents.items.map((instance, i) => {
            const control = CreateFromInstance(instance)
            return <ControlTabItem key={i.toString()} control={control} handleMenu={isAdmin ? handleMenu(control) : () => {}}  />
          })
        }
      </div>
      <Typography align="center" variant="subtitle1" className={classes.paragraph}>
        {dictionary!.defValue(EditorDictionary.keys.components)}
      </Typography>
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
          vertical: "top",
          horizontal: "right",
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
    </div>
  )
};

interface ControlDetailsProps {
  selectControl?: (control?: IControl) => void;
  cloneControl?: (control: IControl) => void;
  isSelected?: (control: IControl) => boolean;
  control?: IControl;
  dictionary: EditorDictionary;
  screens: IControl[];
  saveControl: (control: IControl) => void;
  saveComponent: (control: IControl) => void;
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
    screens
  }
) => {
  const classes = useStyles();
  return (
    <div style={{ height: "100%" }}>
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
          App.user && App.user.isAdmin && (
            <Tooltip
              title={`${dictionary!.defValue(EditorDictionary.keys.save)} ${dictionary!.defValue(EditorDictionary.keys.control)}`}>
              <IconButton size="small" onClick={() => saveControl(control!)}>
                <CloudUpload />
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
        <IconButton size="small" onClick={() => {
          isSelected!(control!) && selectControl!();
          control!.deleteSelf()
        }}>
          <Delete />
        </IconButton>
      </Grid>
      <div style={{ height: `calc(100% - ${TABS_HEIGHT + 28}px)`, overflow: "auto" }}>
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
    screens
  }
) => {
  return (
    <div style={{ height: "100%" }}>
      {
        selectedControl === undefined ?
          <ControlTab dictionary={dictionary} /> :
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
