import React from 'react';
import { observer } from 'mobx-react-lite';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { ExpandMore } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { ExpansionPanel, makeStyles } from '@material-ui/core';
import { blackOpacity } from 'assets/jss/material-dashboard-react';
import EditorDictionary from 'views/Editor/store/EditorDictionary';
import ColorsStore from 'models/ColorsStore';
import ColorPicker from '../ColorPicker';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => (
  {
    root: {
      backgroundColor: blackOpacity(0.05),
      boxShadow: 'none'
    },
    details: {
      backgroundColor: theme.palette.background.paper,
      padding: 8,
    },
    box: {
      width: 15,
      height: 15,
      borderRadius: 2,
      border: '1px solid ' + blackOpacity(.5),
      cursor: 'pointer',
      margin: '1px 3px'
    }
  })
);

interface ProjectColorsProps {
  dictionary: EditorDictionary;
  setColor?: (oldColor: string, newColor: string) => void;
}

const ProjectColors: React.FC<ProjectColorsProps> = (
  { dictionary, setColor }
) => {
  const [currentColor, setCurrentColor] = React.useState('#ffffff');
  const [open, setOpen] = React.useState(false);

  const handleClose = React.useCallback(() => {
    console.log(5555555);
    setOpen(false);
  }, [setOpen, open]);

  const onColorChange = (hex: string) => {
    setColor && setColor(currentColor, hex);
    setCurrentColor(hex);
  }

  const classes = useStyles();
  const onColor = (color: string) => () => {
    setCurrentColor(color);
    setOpen(true);
  }
  console.log(333333, ColorsStore.colors, open);
  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls={`panel-colors`}
        id={`panel-header-colors`}
      >
        <Typography variant="subtitle2">
          {dictionary.value(EditorDictionary.keys.project)}{' '}
          {dictionary.value(EditorDictionary.keys.colors)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        {
          ColorsStore.colors.map(item =>
            (
              <Tooltip key={item.color} title={item.title}>
                <div
                  className={classes.box}
                  style={{ backgroundColor: item.color }}
                  onClick={onColor(item.color)} />
              </Tooltip>
            )
          )
        }
      </ExpansionPanelDetails>
      <ColorPicker
        dictionary={dictionary}
        color={currentColor}
        openPicker={open}
        handleClose={handleClose}
        onChange={onColorChange}
        noInput
      />
    </ExpansionPanel>
  )
}

export default observer(ProjectColors);
