import React from "react";
import { createStyles, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DndProvider, useDrop } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { observer } from "mobx-react-lite";
import Grid from "@material-ui/core/Grid";
import DeviceComponent from "views/Editor/components/DeviceComponent";
import { blackOpacity, whiteColor } from "assets/jss/material-dashboard-react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { AccountCircle, Android, Apple } from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import EditorViewStore, { DragAndDropItem } from "views/Editor/store/EditorViewStore";
import ControlTab from "views/Editor/components/tabs/ControlTab";
import ControlItem from "views/Editor/components/control/ControlItem";
import { ItemTypes } from "views/Editor/store/ItemTypes";
import IControl from "interfaces/IControl";
import { DropEnum } from "models/DropEnum";

const contentStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      minHeight: "100%"
    }
  })
);

interface ContentProps {
  items: IControl[],
  moveControl:
    (parent: IControl, source: IControl, dropAction: DropEnum, newItem: boolean, dropIndex: number, hoverIndex: number)
      => void;
  handleDrop: (item: DragAndDropItem) => void;
  hoverCanvas: (item: DragAndDropItem) => void;
}

const Content: React.FC<ContentProps> = observer(({ items, moveControl, handleDrop, hoverCanvas }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CONTROL,
    hover: (item: DragAndDropItem, monitor) => {
      if(monitor.isOver({shallow: true})) {
        console.log('Over canvas %s', item.control.name);
        hoverCanvas(item);
      }
    },
    drop: (item: DragAndDropItem) => {
      handleDrop(item);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const classes = contentStyles();

  const isActive = canDrop && isOver;
  let backgroundColor = whiteColor;
  if (isActive) {
    backgroundColor = blackOpacity(0.05);
  } else if (canDrop) {
    backgroundColor = blackOpacity(0.1);
  }
  return (
    <div ref={drop} className={classes.root} style={{ backgroundColor: backgroundColor }}>
      {
        items.map((control, i) => {
          return <ControlItem key={control.id} index={i} control={control} moveControl={moveControl} />
        })
      }
    </div>
  )
});

const editorStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: theme.typography.pxToRem(1000)
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      marginRight: theme.spacing(12),
    },
    tabs: {
      backgroundColor: blackOpacity(0.05),
    },
    bordered: {
      border: "1px solid " + blackOpacity(0.12),
    },
    tab: {
      minWidth: 120,
    },
    headerButtons: {
      flexGrow: 1,
    }
  })
);

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const TabContent = [ControlTab];

function Editor() {
  const classes = editorStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [store] = React.useState(new EditorViewStore());
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const tabsStyle = classNames(classes.tabs);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {Dictionary.defValue(DictionaryService.keys.mobileUiEditor)}
          </Typography>
          <div className={classes.headerButtons}>
            <IconButton
              color={store.ios ? "default" : "inherit"}
              onClick={() => store.setIOS(false)}
            >
              <Android />
            </IconButton>
            <IconButton
              color={store.ios ? "inherit" : "default"}
              onClick={() => store.setIOS(true)}
            >
              <Apple />
            </IconButton>
          </div>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <div>
        <DndProvider debugMode={true} backend={Backend}>
          <Grid container>
            <Grid item xs={2} sm={2} md={2}>
              <div className={classes.bordered} style={{ padding: 5, marginTop: 5 }}></div>
            </Grid>
            <Grid item xs={7} sm={7} md={7} style={{ padding: 5 }}>
              <div className={classes.bordered}>
                <div style={{ transform: "translate3d(0, 0, 0)" }}>
                  <div style={{ transform: "scale(1)" }}>
                    <DeviceComponent ios={store.ios} mode={store.mode}>
                      <Content
                        items={store.document}
                        moveControl={store.moveControl}
                        handleDrop={store.handleDrop}
                        hoverCanvas={store.hoverCanvas} />
                    </DeviceComponent>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={3} sm={3} md={3} style={{ padding: 5 }}>
              <Paper variant="outlined" square className={tabsStyle}>
                <Tabs
                  value={store.tabToolsIndex}
                  onChange={store.handleTabTool}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  {
                    EditorViewStore.TABS.map((tab, i) =>
                      <Tab key={i.toString()} label={store.dictionary.defValue(tab)} {...a11yProps(i)}
                           className={classes.tab} />)
                  }
                </Tabs>
              </Paper>
              <div className={classes.bordered} style={{ padding: 5, marginTop: 5 }}>
                {React.createElement(TabContent[0])}
              </div>
            </Grid>
          </Grid>
        </DndProvider>
      </div>
    </div>
  );
}

export default observer(Editor);
