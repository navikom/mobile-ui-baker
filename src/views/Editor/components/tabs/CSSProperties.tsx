import React from "react";
import { observer } from "mobx-react-lite";
import ICSSProperty from "interfaces/ICSSProperty";
import { CSS_CATEGORIES, TABS_HEIGHT } from "models/Constants";
import CSSProperty from "views/Editor/components/tabs/CSSProperty";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import { PROPERTY_EXPANDED } from "models/Control/CSSProperty";
import { ExpansionPanel, makeStyles } from "@material-ui/core";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { ExpandMore } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { blackOpacity } from "assets/jss/material-dashboard-react";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: blackOpacity(0.05),
      boxShadow: "none"
    },
    details: {
      backgroundColor: theme.palette.background.paper,
      padding: 8,
    }
  })
);

interface CSSPropertiesProps {
  properties: ICSSProperty[];
  dictionary: EditorDictionary;
}

const CSSProperties: React.FC<CSSPropertiesProps> = ({ properties, dictionary }) => {

  const classes = useStyles();

  const hasToShow = (prop: ICSSProperty) => {
    if (prop.showWhen) {
      const property = properties.find(p => p.key === prop.showWhen![0]);
      if (property) {
        if (prop.showWhen[1] === PROPERTY_EXPANDED && property.expanded) {
          return true;
        }
        if (prop.showWhen[1] === property.value) {
          return true;
        }
      }
      return false;
    }
    return true;
  };

  const props = CSS_CATEGORIES.map(cat =>
    [cat, properties.filter(prop => hasToShow(prop) && prop.category === cat).map((prop, i) => prop)]
  ).filter(cat => cat[1].length);

  return (
    <div style={{ height: `calc(100% - ${TABS_HEIGHT + 7}px)`, overflow: "auto" }}>
      {
        props.map((prop, i) => {
          return (<ExpansionPanel key={i} className={classes.root}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${i}a-content`}
              id={`panel${i}a-header`}
            >
              <Typography variant="subtitle2">{dictionary.value(prop[0].toString())}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <Grid container>
                {(prop[1] as ICSSProperty[]).map((p, j) =>
                  <CSSProperty key={j.toString()} prop={p} dictionary={dictionary} />)}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>)
        })
      }
    </div>
  )
};

export default observer(CSSProperties);
