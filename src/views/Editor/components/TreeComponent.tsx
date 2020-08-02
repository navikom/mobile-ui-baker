import React from 'react';
import { observer } from 'mobx-react-lite';
import TextInput from 'components/CustomInput/TextInput';
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Add, AddCircleOutline, Delete, FilterNone, Remove } from '@material-ui/icons';
import classNames from 'classnames';
import IControl from 'interfaces/IControl';
import TreeItem from 'views/Editor/components/control/TreeItem';
import { DropEnum } from 'enums/DropEnum';
import { DragAndDropItem } from 'views/Editor/store/EditorViewStore';
import { primaryOpacity } from 'assets/jss/material-dashboard-react';
import EditorDictionary from 'views/Editor/store/EditorDictionary';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      margin: '0 .5em',
      padding: '.5em',
      maxHeight: '50000px',
    },
    closed: {
      overflow: 'hidden',
      padding: '0 .5em',
      maxHeight: 0,
      opacity: 0,
      transition: 'max-height .2s,padding .1s, opacity .2s'
    },
    opened: {
      transition: 'all .1s'
    },
    selected: {
      backgroundColor: primaryOpacity(.08),
      borderRadius: 5
    },
    input: {
      maxWidth: 220,
      position: 'absolute',
      left: 30,
      top: 0,
      height: '60%',
    },
    rowWrapper: {
      width: '100%',
      position: 'relative',
      '&:hover': {
        "& $row": {
          opacity: 1,
          transition: 'all 300ms linear',
        }
      }
    },
    row: {
      opacity: 0,
      transition: 'all 100ms linear',
    },
    selectedInput: {
      backgroundColor: primaryOpacity(.008),
    },
    btn: {
      height: '80%'
    },
    iconButton: {
      padding: 7
    },
    icon: {
      width: 15,
      height: 15
    },
  })
);

interface ScreenComponentProps {
  opened: boolean;
  controls: IControl[];
  moveControl: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  handleDropCanvas: (item: DragAndDropItem) => void;
  handleDropElement: (parent: IControl, source: IControl, dropAction: DropEnum) => void;
  cloneControl: (control: IControl) => void;
  selectControl: (control?: IControl, screen?: IControl) => void;
  isSelected: (control: IControl) => boolean;
  screen: IControl;
}

const ScreenComponent: React.FC<ScreenComponentProps> = observer(
  ({ opened, controls, moveControl, handleDropElement, handleDropCanvas, cloneControl, selectControl, isSelected, screen }) => {
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
          screen={screen}
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
    isSelected,
  }) => {
  const classes = useStyles();
  return (
    <>
      <Grid container alignItems="center" style={{ padding: 5 }}>
        <IconButton color="primary" onClick={addScreen} className={classes.iconButton}>
          <AddCircleOutline className={classes.icon} />
        </IconButton>
        {dictionary.defValue(EditorDictionary.keys.screen).toUpperCase()}
      </Grid>
      {screens.map((screen, i) => (
        <div key={i.toString()} style={{ marginTop: 15 }}>
          <div className={classes.rowWrapper}>
            <Grid
              container
              className={isCurrent(screen) ? classNames(classes.selected) : classes.row}
              style={{ paddingRight: 5 }}
              alignItems="center">
              <IconButton
                onClick={screen.switchOpened}
                size="small"
                className={classNames(classes.btn, classes.iconButton)}>
                {screen.opened ? <Remove className={classes.icon} /> : <Add className={classes.icon} />}
              </IconButton>
              <IconButton
                size="small"
                onClick={() => cloneScreen(screen)}
                style={{ marginLeft: 'auto' }}
                className={classNames(classes.btn, classes.iconButton)}>
                <FilterNone className={classes.icon} />
              </IconButton>
              {
                screens.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removeScreen(screen)}
                    className={classNames(classes.btn, classes.iconButton)}>
                    <Delete className={classes.icon} />
                  </IconButton>
                )
              }
            </Grid>
            <TextInput
              className={
                classNames(classes.input, isCurrent(screen) ? classes.selectedInput : undefined)
              }
              value={screen.title}
              onChange={(e) => screen.changeTitle(e.currentTarget.value)}
              onClick={() => setCurrentScreen(screen)}
            />
          </div>
          <ScreenComponent
            opened={screen.opened}
            controls={screen.children}
            moveControl={moveControl}
            handleDropElement={handleDropElement}
            handleDropCanvas={handleDropCanvas}
            cloneControl={cloneControl}
            selectControl={selectControl}
            isSelected={isSelected}
            screen={screen}
          />
        </div>
      ))}
    </>
  )
};

export default observer(TreeComponent);
