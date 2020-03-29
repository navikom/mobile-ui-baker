import React from "react";
import IControl from "interfaces/IControl";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import Typography from "@material-ui/core/Typography";
import { ExpansionPanel, makeStyles } from "@material-ui/core";
import { blackOpacity } from "assets/jss/material-dashboard-react";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { Add, Delete, ExpandMore } from "@material-ui/icons";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Control from "models/Control/Control";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import CustomSelect from "components/CustomSelect/CustomSelect";
import {
  ACTION_DISABLE_STYLE,
  ACTION_ENABLE_STYLE,
  ACTION_NAVIGATE_TO,
  ACTION_TOGGLE_STYLE,
  EDITOR_ACTIONS
} from "models/Constants";
import { observer } from "mobx-react-lite";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: blackOpacity(0.05),
      boxShadow: "none"
    },
    details: {
      backgroundColor: theme.palette.background.paper,
      padding: 8,
      display: "block"
    },
    paragraph: {
      margin: "4px 0"
    }
  })
);

interface ActionsProps {
  action: string;
  actions: string[][];
  values: string[][];
  value: string;
  onChange: (index: number, action: string, value: string) => void;
  removeAction: (index: number) => void;
  index: number;
  dictionary: EditorDictionary;
}

const Actions: React.FC<ActionsProps> = (
  {
    action,
    actions,
    values,
    value,
    index,
    dictionary,
    removeAction,
    onChange }) => {
  const classes = useStyles();
  return (
    <Grid container spacing={1} alignItems="center" className={classes.paragraph}>
      <Grid item xs={5} sm={5} md={5}>
        <CustomSelect fullWidth value={action} options={actions} onChange={(e) => onChange(index, e.toString(), value)} />
      </Grid>
      <Grid item xs={6} sm={6} md={6}>
        <CustomSelect fullWidth value={value} options={values} onChange={(e) => onChange(index, action, e.toString())} />
      </Grid>
      <Grid item xs={1} sm={1} md={1}>
        <Tooltip
          title={`${dictionary.defValue(EditorDictionary.keys.delete)} ${dictionary.defValue(EditorDictionary.keys.action)}`}
          placement="top">
          <IconButton size="small" onClick={() => removeAction(index)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  )
};

interface Props {
  control: IControl;
  dictionary: EditorDictionary;
  screens: IControl[];
}

const ControlActions: React.FC<Props> = (
  { control:
    {
      addAction,
      actions,
      editAction,
      removeAction,
    }, screens, dictionary }) => {
  const classes = useStyles();
  const disabled = screens.length < 2 && Control.classes.length === 0;
  const actionData: string[] = [];
  const actionList = EDITOR_ACTIONS.slice()
    .filter(e =>
      (screens.length > 1 && e === ACTION_NAVIGATE_TO) ||
      (Control.classes.length > 0 && [ACTION_TOGGLE_STYLE, ACTION_ENABLE_STYLE, ACTION_DISABLE_STYLE].includes(e)))
    .map(e => [e, dictionary.value(e)]);

  if (Control.classes.length > 0) {
    actionData.push(ACTION_TOGGLE_STYLE, ...Control.classes[0].split("/"));
  } else if (screens.length > 1) {
    actionData.push(ACTION_NAVIGATE_TO, screens[1].id);
  }

  return (
    <>
      <Typography variant="subtitle2" align="center"
                  className={classes.paragraph}>{dictionary.defValue(EditorDictionary.keys.actions)}</Typography>
      {
        Control.actions.map((action, i) => (
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
                    const props = actionName === ACTION_NAVIGATE_TO ?
                      screens.map(e => [e.id, e.title]) : Control.classes.map(e => {
                        const arr = e.split("/");
                        return [e, `${Control.getById(arr[0])!.title}/${arr[1]}`]
                      });
                    console.log(99999, action, properties, properties.join("/"));
                    return <Actions
                      key={i.toString()}
                      index={i}
                      actions={actionList}
                      action={actionName}
                      values={props}
                      value={properties.join("/")}
                      removeAction={removeAction}
                      dictionary={dictionary}
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
