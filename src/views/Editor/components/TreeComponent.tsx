import React from "react";
import { observer } from "mobx-react-lite";
import TextInput from "components/CustomInput/TextInput";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Add, AddCircleOutline, Delete, FilterNone, Remove } from "@material-ui/icons";
import classNames from "classnames";
import IControl from "interfaces/IControl";
import TreeItem from "views/Editor/components/control/TreeItem";
import { DropEnum } from "enums/DropEnum";
import { DragAndDropItem } from "views/Editor/store/EditorViewStore";
import { primaryOpacity } from "assets/jss/material-dashboard-react";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import CustomDragLayer from './CustomDragLayer';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      margin: "0 .5em",
      padding: ".5em",
      maxHeight: "1000px",
    },
    closed: {
      overflow: "hidden",
      padding: "0 .5em",
      maxHeight: 0,
      opacity: 0,
      transition: "max-height .2s,padding .1s, opacity .2s"
    },
    opened: {
      transition: "all .1s"
    },
    selected: {
      backgroundColor: primaryOpacity(.08),
    },
    selectedInput: {
      backgroundColor: primaryOpacity(.008),
    },
    btn: {
      height: '80%'
    }
  })
);

interface ScreenComponentProps {
  opened: boolean;
  controls: IControl[];
  moveControl: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  handleDropCanvas: (item: DragAndDropItem) => void;
  handleDropElement: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  cloneControl: (control: IControl) => void;
  selectControl: (control?: IControl) => void;
  isSelected: (control: IControl) => boolean;
}

const ScreenComponent: React.FC<ScreenComponentProps> = observer(
  ({ opened, controls, moveControl, handleDropElement, handleDropCanvas, cloneControl, selectControl, isSelected }) => {
    const classes = useStyles();
    const list = classNames({
      [classes.list]: true,
      [classes.opened]: opened,
      [classes.closed]: !opened
    });
    return <div className={list}>
      {controls.map((control, i) =>
        <TreeItem
          key={control.id}
          control={control}
          moveControl={moveControl}
          handleDropElement={handleDropElement}
          level={0}
          cloneControl={cloneControl}
          selectControl={selectControl}
          isSelected={isSelected}
        />)
      }
    </div>
  });

interface TreeComponentProps {
  screens: IControl[];
  moveControl: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  handleDropCanvas: (item: DragAndDropItem) => void;
  handleDropElement: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  isCurrent: (screen: IControl) => boolean;
  setCurrentScreen: (screen: IControl) => void;
  addScreen: () => void;
  removeScreen: (screen: IControl) => void;
  dictionary: EditorDictionary;
  cloneScreen: (screen: IControl) => void;
  cloneControl: (control: IControl) => void;
  selectControl: (control?: IControl) => void;
  isSelected: (control: IControl) => boolean;
}

const TreeComponent: React.FC<TreeComponentProps> = (
  {
    screens,
    moveControl,
    handleDropElement,
    handleDropCanvas,
    isCurrent,
    setCurrentScreen,
    addScreen,
    dictionary,
    removeScreen,
    cloneScreen,
    cloneControl,
    selectControl,
    isSelected
  }) => {
  const classes = useStyles();
  return (
    <>
      <Grid container alignItems="center" style={{ padding: 5 }}>
        <IconButton color="primary" onClick={addScreen}>
          <AddCircleOutline />
        </IconButton>
        {dictionary.defValue(EditorDictionary.keys.screen).toUpperCase()}
      </Grid>
      {screens.map((screen, i) => (
        <div key={i.toString()} style={{marginTop: 15}}>
          <Grid
            container
            className={isCurrent(screen) ? classes.selected : undefined}
            style={{paddingRight: 5}}
            alignItems="center">
            <IconButton onClick={screen.switchOpened} size="small" className={classes.btn}>
              {screen.opened ? <Remove /> : <Add />}
            </IconButton>
            <TextInput
              className={isCurrent(screen) ? classes.selectedInput : undefined}
              value={screen.title}
              onChange={(e) => screen.changeTitle(e.currentTarget.value)}
              onClick={() => setCurrentScreen(screen)}
            />
            <IconButton size="small" onClick={() => cloneScreen(screen)} style={{marginLeft: "auto"}}  className={classes.btn}>
              <FilterNone />
            </IconButton>
            {
              screens.length > 1 && (
                <IconButton size="small" onClick={() => removeScreen(screen)}  className={classes.btn}>
                  <Delete />
                </IconButton>
              )
            }
          </Grid>
          <ScreenComponent
            opened={screen.opened}
            controls={screen.children}
            moveControl={moveControl}
            handleDropElement={handleDropElement}
            handleDropCanvas={handleDropCanvas}
            cloneControl={cloneControl}
            selectControl={selectControl}
            isSelected={isSelected}
          />
        </div>
      ))}
    </>
  )
};

export default observer(TreeComponent);
