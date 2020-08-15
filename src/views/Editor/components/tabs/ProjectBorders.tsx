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
import Grid from '@material-ui/core/Grid';

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
    wrapper: {
      margin: '3px 0'
    },
    box: {
      width: 15,
      height: 15,
      borderRadius: 2,
      border: '1px solid ' + blackOpacity(.5),
      cursor: 'pointer',
    }
  })
);

interface ProjectBordersProps {
  dictionary: EditorDictionary;
  setBorder?: (oldBorder: string, newBorder: string) => void;
}

const ProjectBorders: React.FC<ProjectBordersProps> = (
  { dictionary, setBorder }
) => {
  const [currentBorder, setCurrentBorder] = React.useState('#ffffff');
  const [open, setOpen] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onBorderChange = (border: string) => {
    setBorder && setBorder(currentBorder, border);
    setCurrentBorder(border);
  }

  const classes = useStyles();
  const onBorder = (color: string) => () => {
    setCurrentBorder(color);
    setOpen(true);
  }
  const [width, style, ...rest] = currentBorder.split(' ');
  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMore />}
        aria-controls={`panel-borders`}
        id={`panel-header-borders`}
      >
        <Typography variant="subtitle2">
          {dictionary.value(EditorDictionary.keys.project)}{' '}
          {dictionary.value(EditorDictionary.keys.borders)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <Grid container>
          {
            ColorsStore.borders.map(item =>
              (
                <Grid item xs={1} sm={1} md={1} key={item.border} className={classes.wrapper}>
                  <Tooltip title={item.title}>
                    <div
                      className={classes.box}
                      style={{ border: item.border }}
                      onClick={onBorder(item.border)} />
                  </Tooltip>
                </Grid>
              )
            )
          }
        </Grid>
      </ExpansionPanelDetails>
      <ColorPicker
        dictionary={dictionary}
        borderWidth={Number(width.replace('px', ''))}
        borderStyle={style}
        color={rest.join(' ')}
        openPicker={open}
        handleClose={handleClose}
        onChange={onBorderChange}
        noInput
        noBorderInput
      />
    </ExpansionPanel>
  )
}

export default observer(ProjectBorders);
