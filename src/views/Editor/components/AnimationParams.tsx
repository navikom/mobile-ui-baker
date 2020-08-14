import React from 'react';
import classNames from 'classnames';
import { ExpansionPanel, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import CustomSelect from 'components/CustomSelect/CustomSelect';
import NumberInput from 'components/CustomInput/NumberInput';
import EditorDictionary from '../store/EditorDictionary';
import DelayEnum from 'enums/DelayEnum';
import AnimationEnum, { AnimationDirectionEnum } from 'enums/AnimationEnum';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import ScreenSwitcherEnum from 'enums/ScreenSwitcherEnum';
import { getSwitcherParams } from 'models/DisplayViewStore';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { ExpandMore } from '@material-ui/icons';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

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
      backgroundColor: blackOpacity(0.03)
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

interface TransitionProps {
  action: string;
  actions: string[];
  param: string;
  params: string[];
  duration: number;
  currentParams?: (string | number)[];
  nextParams?: (string | number)[];
  onChange: (payload: (string | number)[]) => void;
  screenSwitcher: ScreenSwitcherEnum;
}

const Transition: React.FC<TransitionProps> = (
  {
    action,
    actions,
    param,
    params,
    duration,
    onChange,
    currentParams,
    nextParams,
    screenSwitcher
  }
) => {
  const classes = useStyles();
  return (
    <Grid container spacing={1} alignItems="center" className={classes.paragraph}>
      <Grid item xs={3} sm={3} md={3}>
        <CustomSelect
          fullWidth
          value={action}
          options={actions}
          onChange={(e) => {
            onChange(currentParams ?
              [...currentParams, screenSwitcher, e.toString(), param, duration] :
              nextParams ? [screenSwitcher, e.toString(), param, duration, ...nextParams] :
                [screenSwitcher, e.toString(), param, duration])
          }} />
      </Grid>
      <Grid item xs={3} sm={3} md={3}>
        <CustomSelect
          fullWidth
          value={param}
          options={params}
          onChange={(e) => {
            onChange(currentParams ?
              [...currentParams, screenSwitcher, action, e.toString(), duration] :
              nextParams ? [screenSwitcher, action, e.toString(), duration, ...nextParams] :
                [screenSwitcher, action, e.toString(), duration])
          }} />
      </Grid>
      <Grid item xs={5} sm={5} md={5}>
        <NumberInput
          value={duration}
          onChange={(e) => {
            onChange(currentParams ?
              [...currentParams, screenSwitcher, action, param, e] :
              nextParams ? [screenSwitcher, action, param, e, ...nextParams] :
                [screenSwitcher, action, param, e])
          }} />
      </Grid>
    </Grid>
  )
}

interface AnimationParamsProps {
  isDelay: boolean;
  conditions: string[];
  onChange: (payload: (string | number)[]) => void;
  dictionary: EditorDictionary;
}

const AnimationParams: React.FC<AnimationParamsProps> = (
  { isDelay, conditions, onChange, dictionary }
) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState([false, false]);
  const [currentSwitcherParams] = React.useState(getSwitcherParams(conditions, ScreenSwitcherEnum.CURRENT));
  const [nextSwitcherParams] = React.useState(getSwitcherParams(conditions, ScreenSwitcherEnum.NEXT));

  React.useEffect(() => {
    setExpanded([!!currentSwitcherParams, !!nextSwitcherParams]);
  }, [setExpanded, currentSwitcherParams, nextSwitcherParams]);

  if (isDelay) {
    let action = DelayEnum.BEFORE;
    let value = 300;
    if (conditions.length) {
      action = conditions[0] as DelayEnum;
      value = Number(conditions[1]);
    }
    return (
      <Grid container spacing={1} alignItems="center" className={classes.paragraph}>
        <Grid item xs={6} sm={6} md={6}>
          <CustomSelect fullWidth value={action} options={[DelayEnum.BEFORE, DelayEnum.AFTER]}
                        onChange={(e) => onChange([e.toString(), value])} />
        </Grid>
        <Grid item xs={6} sm={6} md={6}>
          <NumberInput size="small" value={value} onChange={(e) => onChange([action, e])} />
        </Grid>
      </Grid>
    )
  }
  const currentSwitcherParams1 = getSwitcherParams(conditions, ScreenSwitcherEnum.CURRENT);
  const nextSwitcherParams1 = getSwitcherParams(conditions, ScreenSwitcherEnum.NEXT);
  let currentScreenAction = AnimationEnum.FADE;
  let currentScreenParam = AnimationDirectionEnum.NONE;
  let currentScreenDuration = 300;
  let nextScreenAction = AnimationEnum.FADE;
  let nextScreenParam = AnimationDirectionEnum.NONE;
  let nextScreenDuration = 300;
  const params = [AnimationDirectionEnum.NONE, AnimationDirectionEnum.TOP, AnimationDirectionEnum.BOTTOM,
    AnimationDirectionEnum.LEFT, AnimationDirectionEnum.RIGHT];

  if (conditions.length > 1) {

    if (currentSwitcherParams1) {
      currentScreenAction = currentSwitcherParams1[0] as AnimationEnum;
      currentScreenParam = currentSwitcherParams1[1] as AnimationDirectionEnum;
      currentScreenDuration = Number(currentSwitcherParams1[2]);
    }
    if (nextSwitcherParams1) {
      nextScreenAction = nextSwitcherParams1[0] as AnimationEnum;
      nextScreenParam = nextSwitcherParams1[1] as AnimationDirectionEnum;
      nextScreenDuration = Number(nextSwitcherParams1[2]);
    }
  }

  const expand = classNames(classes.propKeyWrapper, classes.pointer);

  const switchExpanded = (index: number) => () => {
    const isExpanded = !expanded[index];
    const newExpanded = expanded.slice();
    newExpanded[index] = isExpanded;
    const payload = [];
    if (newExpanded[0]) {
      payload.push(
        ScreenSwitcherEnum.CURRENT, currentScreenAction, currentScreenParam, currentScreenDuration
      )
    }
    if (newExpanded[1]) {
      payload.push(
        ScreenSwitcherEnum.NEXT, nextScreenAction, nextScreenParam, nextScreenDuration
      )
    }
    onChange(payload);
    setExpanded(newExpanded);
  }

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls={`panel-animations`}
        id={`panel-header-animations`}
      >
        <Typography variant="subtitle2">
          {dictionary!.defValue(EditorDictionary.keys.project)}{' '}
          {dictionary!.defValue(EditorDictionary.keys.navigation)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <Grid container>
          <div className={expand} onClick={switchExpanded(0)}>
            <Typography>
              {dictionary.defValue(EditorDictionary.keys.current)}{' '}
              {dictionary.defValue(EditorDictionary.keys.screen)}
            </Typography>
            <Switch checked={expanded[0]} color="primary" />
          </div>
          {
            expanded[0] && (
              <Transition
                screenSwitcher={ScreenSwitcherEnum.CURRENT}
                action={currentScreenAction}
                actions={[AnimationEnum.FADE, AnimationEnum.SLIDE]}
                param={currentScreenParam}
                params={params.slice()}
                duration={currentScreenDuration}
                onChange={onChange}
                nextParams={
                  expanded[1] ? [ScreenSwitcherEnum.NEXT, nextScreenAction, nextScreenParam, nextScreenDuration] : undefined
                }
              />
            )
          }
          <div className={expand} onClick={switchExpanded(1)}>
            <Typography>
              {dictionary.defValue(EditorDictionary.keys.next)}{' '}
              {dictionary.defValue(EditorDictionary.keys.screen)}
            </Typography>
            <Switch checked={expanded[1]} color="primary" />
          </div>
          {
            expanded[1] && (
              <Transition
                screenSwitcher={ScreenSwitcherEnum.NEXT}
                action={nextScreenAction}
                actions={[AnimationEnum.FADE, AnimationEnum.SLIDE]}
                param={nextScreenParam}
                params={params.slice()}
                duration={nextScreenDuration}
                onChange={onChange}
                currentParams={
                  expanded[0] ? [ScreenSwitcherEnum.CURRENT, currentScreenAction, currentScreenParam, currentScreenDuration] : undefined
                }
              />
            )
          }
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )

}

export default React.memo(AnimationParams);
