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
  FilterNone
} from '@material-ui/icons';
import { blackOpacity, primaryOpacity, whiteColor, whiteOpacity } from 'assets/jss/material-dashboard-react';
import { Mode } from 'enums/ModeEnum';
import TextInput from 'components/CustomInput/TextInput';
import { TABS_HEIGHT } from 'models/Constants';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import ColorPicker from '../ColorPicker';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  container: {
    marginTop: theme.typography.pxToRem(10),
    padding: 5
  },
  containerExtend: {
    margin: '5px 3px 10px',
    padding: '5px 10px',
    backgroundColor: whiteOpacity(.5),
    width: '94%'
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
  extend: {
    paddingLeft: 5,
    marginBottom: 5,
    cursor: 'pointer'
  },
  extendEnabled: {
    backgroundColor: primaryOpacity(.08)
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
  iconButton: {
    padding: 7
  },
  icon: {
    width: 15,
    height: 15
  },
}));

const StatusBarExtendComponent: React.FC<IEditorTabsProps> = observer((
  {screen, dictionary}
) => {

  const classes = useStyles();

  const extend = classNames({
    [classes.extend]: true,
    [classes.extendEnabled]: screen && screen.statusBarExtended,
  });

  const container = classNames({
    [classes.containerExtend]: true,
    [classes.opened]: screen ? screen.statusBarExtended : false,
    [classes.closed]: screen ? !screen.statusBarExtended : true,
  });

  return (
    <React.Fragment>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        className={extend}
        onClick={screen ? () => screen.switchExtended() : () => {}}>
        <Typography variant="body1">
          {dictionary!.defValue(EditorDictionary.keys.statusBar)}{' '}
          {dictionary!.defValue(EditorDictionary.keys.extend)}
        </Typography>
        <Switch checked={screen ? screen.statusBarExtended : false} color="primary" />
      </Grid>
      <div className={container}>
        <Grid container className={classes.container}>
          <FormControl component="fieldset">
            <FormLabel>{dictionary!.defValue(EditorDictionary.keys.mode).toUpperCase()}</FormLabel>
            <RadioGroup
              row aria-label="mode"
              name="mode"
              value={screen ? screen.mode : Mode.WHITE}
              onChange={screen ? screen.switchMode : () => {
              }}>
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
            <Switch
              checked={screen ? screen.statusBarEnabled : false}
              color="primary"
              onChange={screen ? () => screen.switchStatusBarEnabled() : () => {}} />
          </FormControl>
        </Grid>
        <Grid container className={classes.container} justify="space-between">
          <FormControl component="fieldset">
            <FormLabel
              style={{ marginBottom: 10 }}>
              {`${dictionary!.defValue(EditorDictionary.keys.statusBar)} ${dictionary!.defValue(EditorDictionary.keys.background)}`.toUpperCase()}
            </FormLabel>
            <ColorPicker
              dictionary={dictionary as EditorDictionary}
              color={screen ? screen.statusBarColor : whiteColor}
              onChange={(e) => screen && screen.setStatusBarColor(e)}
              />
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel
              style={{ marginBottom: 10 }}>{dictionary!.defValue(EditorDictionary.keys.background).toUpperCase()}</FormLabel>
            <ColorPicker
              dictionary={dictionary as EditorDictionary}
              color={screen ? screen.background : whiteColor}
              onChange={(e) => screen && screen.setBackground(e)}
              />
          </FormControl>
        </Grid>
      </div>
    </React.Fragment>
  )
});

const ScreenTab: React.FC<IEditorTabsProps> = (
  {
    dictionary,
    screen,
    cloneControl,
  }
) => {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container className={classes.title}>
        <TextInput
          fullWidth
          className={classes.input}
          value={screen!.title}
          onChange={(e) => screen && screen.changeTitle(e.currentTarget.value)}
        />
      </Grid>
      <Grid container className={classes.tools}>
        <Tooltip title={dictionary!.defValue(EditorDictionary.keys.cloneControl)} placement="top">
          <IconButton size="small" onClick={() => screen && cloneControl && cloneControl(screen)}
                      className={classes.iconButton}>
            <FilterNone className={classes.icon} />
          </IconButton>
        </Tooltip>
      </Grid>
      <div style={{ height: `calc(100% - ${TABS_HEIGHT + 10}px)`, overflow: 'auto' }}>
        <StatusBarExtendComponent screen={screen} dictionary={dictionary} />
      </div>
    </div>)
};

export default observer(ScreenTab);
