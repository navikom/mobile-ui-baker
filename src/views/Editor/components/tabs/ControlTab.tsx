import React from "react";
import { ControlEnum } from "models/ControlEnum";
import EditorViewStore from "views/Editor/store/EditorViewStore";
import ControlTabItem from "views/Editor/components/tabs/ControlTabItem";
import { makeStyles } from "@material-ui/core";
import CustomDragLayer from "views/Editor/components/CustomDragLayer";
import IEditorTabsProps from "interfaces/IEditorTabsProps";
import { blackOpacity, primaryOpacity } from "assets/jss/material-dashboard-react";
import { Delete, FilterNone, KeyboardArrowUp, Visibility, VisibilityOff } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import IControl from "interfaces/IControl";
import { observer } from "mobx-react-lite";
import CSSProperties from "views/Editor/components/tabs/CSSProperties";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import EditorInput from "components/CustomInput/EditorInput";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  disableDetailsButton: {
    backgroundColor: primaryOpacity(.05)
  },
  title: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    backgroundColor: blackOpacity(0.05)
  }
}));

const ControlTab: React.FC<IEditorTabsProps> = () => {
  const classes = useStyles();
  const keys = Object.keys(EditorViewStore.CONTROLS) as (keyof typeof ControlEnum)[];
  return (
    <div className={classes.root}>
      {
        keys.map((k, i) =>
          <ControlTabItem key={i.toString()} type={EditorViewStore.CONTROLS[k]} />)
      }
      <CustomDragLayer />
    </div>
  )
};

interface ControlDetailsProps {
  selectControl?: (control?: IControl) => void;
  cloneControl?: (control: IControl) => void;
  isSelected?: (control: IControl) => boolean;
  control?: IControl;
  dictionary: EditorDictionary;
}

const ControlDetails: React.FC<ControlDetailsProps> = observer((
  {
    selectControl,
    control,
    dictionary,
    cloneControl,
    isSelected
  }
) => {
  const classes = useStyles();
  return (
    <div style={{ height: "100%" }}>
      <Button fullWidth variant="outlined" onClick={() => selectControl && selectControl()}>
        <KeyboardArrowUp />
      </Button>
      <Grid container alignItems="center" justify="space-between" className={classes.title}>
        <Grid item xs={8} sm={8} md={8}>
          <EditorInput
            style={{}}
            html={control!.title}
            onChange={(e) => control!.changeTitle(e)}
            tagName="b"
          />
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
          <Grid container justify="flex-end">
            <IconButton size="small" onClick={control!.switchVisibility}>
              {control!.visible ? <Visibility /> : <VisibilityOff color="disabled" />}
            </IconButton>
            <IconButton size="small" onClick={() => cloneControl!(control!)}>
              <FilterNone />
            </IconButton>
            <IconButton size="small" onClick={() => {
              isSelected!(control!) && selectControl!();
              control!.deleteSelf()
            }}>
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <CSSProperties properties={control!.cssProperties} dictionary={dictionary} />
    </div>
  )
});

const Control: React.FC<IEditorTabsProps> = (
  {
    selectedControl,
    selectControl,
    dictionary,
    cloneControl,
    isSelected
  }
) => {
  return (
    <div style={{ height: "100%" }}>
      {
        selectedControl === undefined ?
          <ControlTab /> :
          <ControlDetails selectControl={selectControl} control={selectedControl} isSelected={isSelected}
                          cloneControl={cloneControl} dictionary={dictionary as EditorDictionary} />
      }
    </div>
  )
}

export default Control;