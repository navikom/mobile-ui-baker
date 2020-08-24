import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import { ExpansionPanel, makeStyles } from '@material-ui/core';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { Add, Delete, ExpandMore } from '@material-ui/icons';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

import ControlStore from 'models/Control/ControlStore';
import {
  ACTION_DISABLE_STYLE,
  ACTION_ENABLE_STYLE,
  ACTION_NAVIGATE_BACK,
  ACTION_NAVIGATE_REPLACE,
  ACTION_NAVIGATE_TO,
  ACTION_TOGGLE_STYLE,
  EDITOR_ACTIONS
} from 'models/Constants';
import IControl from 'interfaces/IControl';
import EditorDictionary from 'views/Editor/store/EditorDictionary';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import DelayEnum from 'enums/DelayEnum';
import AnimationParams from '../AnimationParams';
import { blackOpacity } from 'assets/jss/material-dashboard-react';

const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: blackOpacity(0.05),
      boxShadow: 'none'
    },
    details: {
      backgroundColor: theme.palette.background.paper,
      padding: 8,
      display: 'block'
    },
    paragraph: {
      margin: '4px 0'
    },
    propKeyWrapper: {
      marginTop: theme.typography.pxToRem(5),
      paddingLeft: theme.typography.pxToRem(5),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: blackOpacity(0.05)
    },
    pointer: {
      cursor: 'pointer'
    },
    block: {
      border: '1px dotted ' + blackOpacity(0.3),
      margin: '7px 0',
      padding: '2px'
    }
  })
);

interface ActionsProps {
  action: string;
  actions: string[][];
  values: string[][];
  properties: string[];
  onChange: (index: number, action: string, value: string) => void;
  removeAction: (index: number) => void;
  onKeyChange: (index: number, action: string) => void;
  index: number;
  dictionary: EditorDictionary;
}

const Actions: React.FC<ActionsProps> = (
  {
    action,
    actions,
    values,
    properties,
    index,
    dictionary,
    removeAction,
    onChange,
    onKeyChange
  }) => {
  const classes = useStyles();
  let value = properties[0];
  const rest = properties.slice(1);
  let delay = false;
  if (![ACTION_NAVIGATE_TO, ACTION_NAVIGATE_REPLACE, ACTION_NAVIGATE_BACK].includes(action)) {
    value = `${value}/${rest.shift()}`;
    delay = true;
  }

  const [extraParamsEnabled, setExtraParamsEnabled] = React.useState(false);

  React.useEffect(() => {
    setExtraParamsEnabled(rest.length > 0);
  }, [rest, setExtraParamsEnabled]);

  const switchExtraParams = React.useCallback(() => {
    const newExtraParamsEnabled = !extraParamsEnabled;
    if (!newExtraParamsEnabled) {
      onChange(index, action, value);
    } else {
      if (delay) {
        onChange(index, action, `${value}/${DelayEnum.AFTER}/300`);
      } else {
        // set dummy Animations string to expand block
        onChange(index, action, `${value}/Animations`);
      }
    }
  }, [onChange, extraParamsEnabled, index, action, value, delay]);

  const editExtraParams = (payload: (string | number)[]) => {
    onChange(index, action, [value, ...payload].join('/'));
  }

  const onKeyChangeHandle = (e: string | number) => {
    onKeyChange(index, e.toString());
  }

  const isBack = action === ACTION_NAVIGATE_BACK;

  const expand = classNames(classes.propKeyWrapper, classes.pointer);
  return (
    <Grid container alignItems="center" className={classNames(classes.paragraph, classes.block)}>
      <Grid container spacing={1} alignItems="center">
        <Grid
          item
          xs={isBack ? 11 : 5}
          sm={isBack ? 11 : 5}
          md={isBack ? 11 : 5}>
          <CustomSelect fullWidth value={action} options={actions}
                        onChange={onKeyChangeHandle} />
        </Grid>
        {
          !isBack && (
            <Grid item xs={6} sm={6} md={6}>
              <CustomSelect fullWidth value={value} options={values}
                            onChange={(e) => onChange(index, action, e.toString())} />
            </Grid>
          )
        }
        <Grid item xs={1} sm={1} md={1}>
          <Tooltip
            title={`${dictionary.defValue(EditorDictionary.keys.delete)} ${dictionary.defValue(EditorDictionary.keys.action)}`}
            placement="top">
            <IconButton size="small" onClick={() => removeAction(index)} style={{ marginLeft: -5 }}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      {
        !isBack && (
          <div className={expand} onClick={switchExtraParams}>
            <Typography>
              {dictionary.defValue(delay ? EditorDictionary.keys.delay : EditorDictionary.keys.transition)}
            </Typography>
            <Switch checked={extraParamsEnabled} color="primary" />
          </div>
        )
      }

      {
        extraParamsEnabled && !isBack &&
        <AnimationParams isDelay={delay} conditions={rest} onChange={editExtraParams} dictionary={dictionary} />
      }
    </Grid>
  )
};

interface Props {
  control: IControl;
  dictionary: EditorDictionary;
  screens: IControl[];
}

const ControlActions: React.FC<Props> = (
  {
    control:
      {
        addAction,
        actions,
        editAction,
        removeAction,
      }, screens, dictionary
  }) => {
  const classes = useStyles();
  const disabled = screens.length < 2 && ControlStore.classes.length === 0;
  const actionData: string[] = [];
  const actionList = EDITOR_ACTIONS.slice()
    .filter(e =>
      (screens.length > 1 && [ACTION_NAVIGATE_TO, ACTION_NAVIGATE_REPLACE, ACTION_NAVIGATE_BACK].includes(e)) ||
      (ControlStore.classes.length > 0 && [ACTION_TOGGLE_STYLE, ACTION_ENABLE_STYLE, ACTION_DISABLE_STYLE].includes(e)))
    .map(e => [e, dictionary.value(e)]);

  if (ControlStore.classes.length > 0) {
    actionData.push(ACTION_TOGGLE_STYLE, ...ControlStore.classes[0].split('/'));
  } else if (screens.length > 1) {
    actionData.push(ACTION_NAVIGATE_TO, screens[1].id);
  }

  const screensProps = screens.map(e => [e.id, e.title]);
  const controlsProps = ControlStore.classes.map(e => {
    const arr = e.split('/');
    return [e, `${ControlStore.getById(arr[0])!.title}/${arr[1]}`]
  });

  const onKeyChange = (index: number, action: string) => {
    const value = [ACTION_NAVIGATE_TO, ACTION_NAVIGATE_REPLACE, ACTION_NAVIGATE_BACK].includes(action) ?
      screensProps[0][0] : controlsProps[0][0];
    editAction(index, action, value);
  }

  return (
    <>
      <Typography variant="subtitle2" align="center"
                  className={classes.paragraph}>{dictionary.defValue(EditorDictionary.keys.actions)}</Typography>
      {
        ControlStore.actions.map((action, i) => (
          <ExpansionPanel key={i} className={classes.root}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${i}a-content`}
              id={`panel${i}a-header`}
            >
              <Typography variant="subtitle2">{dictionary.value(action)}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              {
                actions.map((action, i) => {
                  const [actionName, ...properties] = action;
                  const props = [ACTION_NAVIGATE_TO, ACTION_NAVIGATE_REPLACE, ACTION_NAVIGATE_BACK].includes(actionName) ?
                    screensProps.slice() : controlsProps.map(e => e.slice());
                  return <Actions
                    key={i.toString()}
                    index={i}
                    actions={actionList}
                    action={actionName}
                    values={props}
                    properties={properties}
                    removeAction={removeAction}
                    dictionary={dictionary}
                    onKeyChange={onKeyChange}
                    onChange={editAction} />
                })
              }
              {
                disabled ? (
                  <Button
                    disabled={disabled}
                    fullWidth
                    variant="outlined"
                    className={classes.paragraph}
                    onClick={() => addAction(actionData)}>
                    <Add />
                  </Button>
                ) : (
                  <Tooltip
                    title={`${dictionary.defValue(EditorDictionary.keys.add)} ${dictionary.defValue(EditorDictionary.keys.action)}`}
                    placement="top">
                    <Button
                      disabled={disabled}
                      fullWidth
                      variant="outlined"
                      className={classes.paragraph}
                      onClick={() => addAction(actionData)}>
                      <Add />
                    </Button>
                  </Tooltip>
                )
              }
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))
      }
    </>
  )
};

export default observer(ControlActions);
