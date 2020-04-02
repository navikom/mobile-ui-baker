import React from "react";
import { observer } from "mobx-react-lite";
import ICSSProperty from "interfaces/ICSSProperty";
import { CSS_CATEGORIES, TABS_HEIGHT } from "models/Constants";
import CSSProperty from "views/Editor/components/tabs/CSSProperty";
import EditorDictionary from "views/Editor/store/EditorDictionary";
import { ExpansionPanel, makeStyles } from "@material-ui/core";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { Add, Delete, ExpandMore } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { blackOpacity } from "assets/jss/material-dashboard-react";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IControl from "interfaces/IControl";
import { MAIN_CSS_STYLE } from "models/Control/Control";
import EditorInput from "components/CustomInput/EditorInput";
import IconButton from "@material-ui/core/IconButton";
import { PROPERTY_EXPANDED } from "models/Control/CSSProperty";

const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: blackOpacity(0.05),
      boxShadow: "none"
    },
    details: {
      backgroundColor: theme.palette.background.paper,
      padding: 8,
    },
    paragraph: {
      margin: "4px 0"
    }
  })
);

interface CSSPropertiesProps {
  dictionary: EditorDictionary;
  control: IControl,
  styleKey: string;
}

const CSSPropertiesComponent: React.FC<CSSPropertiesProps> = ({ control, styleKey, dictionary }) => {

  const classes = useStyles();
  const properties = control.cssStyles.get(styleKey) as ICSSProperty[];

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
                  <CSSProperty
                    key={j.toString()}
                    switchEnabled={control.switchEnabled(styleKey, p.key)}
                    switchExpanded={control.switchExpanded(styleKey, p.key)}
                    setValue={control.setValue(styleKey, p.key)}
                    prop={p}
                    dictionary={dictionary} />)}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>)
        })
      }
    </div>
  )
};

const CSSProperties = observer(CSSPropertiesComponent);

interface CSSMapProps {
  control: IControl;
  dictionary: EditorDictionary;
}

const CSSMap: React.FC<CSSMapProps> = ({ control, dictionary }) => {
  const { cssStyles, addCSSStyle } = control;
  const classes = useStyles();
  const keys = Array.from(cssStyles.keys());
  return (
    <>
      <Typography variant="subtitle2" align="center"
                  className={classes.paragraph}>{dictionary.defValue(EditorDictionary.keys.styles)}</Typography>
      {
        keys.map((key, i) => {
          return (<ExpansionPanel key={i} className={classes.root}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel${i}a-content`}
              id={`panel${i}a-header`}
            >
              {key === MAIN_CSS_STYLE ?
                <Typography variant="subtitle2">{key}</Typography> :
                (<Grid container alignItems="center" justify="space-between">
                  <Grid item xs={11} sm={11} md={11}>
                    <EditorInput style={{}} html={key} onChange={(e) => control.renameCSSStyle(key, e)} />
                  </Grid>
                  <Grid item xs={1} sm={1} md={1}>
                    <Tooltip
                      title={`${dictionary.defValue(EditorDictionary.keys.delete)} ${dictionary.defValue(EditorDictionary.keys.style)}`}
                      placement="top">
                      <IconButton size="small" onClick={() => control.removeCSSStyle(key)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>)}

            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <CSSProperties control={control} styleKey={key} dictionary={dictionary} />
            </ExpansionPanelDetails>
          </ExpansionPanel>)
        })
      }
      <Tooltip
        title={`${dictionary.defValue(EditorDictionary.keys.add)} ${dictionary.defValue(EditorDictionary.keys.style)}`}
        placement="top">
        <Button fullWidth variant="outlined" className={classes.paragraph} onClick={() => addCSSStyle()}>
          <Add />
        </Button>
      </Tooltip>
    </>
  )
};

export default observer(CSSMap);
