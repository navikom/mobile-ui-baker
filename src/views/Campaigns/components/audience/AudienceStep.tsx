import React from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// @material-ui/icons
import { AddCircleOutline, EditOutlined, Add } from "@material-ui/icons";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import BootstrapInput from "components/CustomInput/BootstrapInput";
import CustomSelect from "components/CustomSelect/CustomSelect";
import Fab from "components/CustomButtons/Fab";
import CardFooter from "components/Card/CardFooter";

// interfaces
import { ISegment } from "interfaces/ISegment";

// view store
import CampaignViewStore from "views/Campaigns/store/CampaignViewStore";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    container: {
      marginTop: theme.typography.pxToRem(20)
    },
    title: {
      opacity: 0.5,
      marginTop: theme.typography.pxToRem(10)
    },
    label: {
      width: theme.typography.pxToRem(200),
      marginRight: theme.typography.pxToRem(30)
    },
    iconButton: {
      padding: theme.typography.pxToRem(9)
    },
    extendedIcon: {
      marginRight: theme.spacing(1)
    },
    reachableWrapper: {
      width: "100%",
      padding: theme.spacing(1),
      border: "1px solid rgba(0,0,0,.1)"
    },
    highlight: {
      opacity: 0.8
    }
  })
);

interface ISegmentRow {
  onClick(): void;

  include: boolean;
  title: string;
}

const SegmentRows = observer((props: ISegmentRow) => {
  const store = CampaignViewStore.audienceStepStore;
  if (!store) return null;
  const { include, title } = props;
  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    classes.textToRight,
    extraClasses.label
  );
  const items = include ? store.includeSegments : store.excludeSegments;
  const buttonTitle = `${Dictionary.value(
    include ? "include" : "exclude"
  )} ${Dictionary.defValue(DictionaryService.keys.segment)}`;
  return (
    <div className={extraClasses.root}>
      {items.map((prop: ISegment, i: number) => {
        return (
          <Grid
            key={i}
            container
            item
            direction="row"
            className={extraClasses.container}
          >
            <Typography variant="subtitle2" className={centerNote}>
              {i === 0 ? title : ""}
            </Typography>
            <Grid container item xs={12} sm={12} md={8}>
              <Grid item xs={12} sm={3} md={3}>
                {i === 0 && <CustomSelect onChange={() => {}} options={[]} />}
              </Grid>
              <Grid item xs={12} sm={5} md={7}>
                <FormControl fullWidth>
                  <CustomSelect
                    value={prop.segmentId}
                    onChange={(e: number) => store.addSegment(e, include)}
                    options={store.segmentsListForSelect(include)}
                  />
                </FormControl>
              </Grid>
              <Grid container item xs={12} sm={4} md={2} justify="flex-end">
                {store.includeSegments.length > 0 && (
                  <IconButton
                    onClick={() => {}}
                    className={extraClasses.iconButton}
                  >
                    <EditOutlined color="primary" />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => {}}
                  className={extraClasses.iconButton}
                >
                  <AddCircleOutline color="primary" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
      <Grid container item direction="row">
        <Typography variant="subtitle2" className={centerNote}>
          {" "}
        </Typography>
        <Grid item xs={6} sm={6} md={6}>
          <Fab variant="extended" size="sm">
            <Add className={extraClasses.extendedIcon} />
            {buttonTitle}
          </Fab>
        </Grid>
      </Grid>
    </div>
  );
});

const Reachable = observer(() => {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const title = classNames(classes.note, classes.center, extraClasses.label);
  const centerNote = classNames(
    classes.note,
    classes.center,
    extraClasses.label,
    extraClasses.highlight
  );

  return (
    <div className={extraClasses.reachableWrapper}>
      <Typography variant="subtitle2" className={title}>
        {Dictionary.defValue(DictionaryService.keys.users)} (
        {CampaignViewStore.channelName} Channel):
      </Typography>
      <Typography variant="h5" className={centerNote}>
        0
      </Typography>
    </div>
  );
});

const AudienceStep = () => {
  const store = CampaignViewStore.audienceStepStore;

  console.log(121212121, useStyles);
  const extraClasses = extraStyles();
  const classes = useStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    classes.textToRight,
    extraClasses.label
  );

  if (!store) return null;

  return (
    <Card>
      <CardBody>
        <Grid container>
          <Grid container item direction="row">
            <Typography variant="subtitle2" className={centerNote}>
              {Dictionary.defValue(DictionaryService.keys.name)}
            </Typography>
            <Grid item xs={12} sm={12} md={6}>
              <BootstrapInput
                fullWidth
                error={store.errors.name !== undefined}
                endAdornment={store.errors.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  store.setName(
                    e.target.value.length ? e.target.value : undefined
                  )
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            direction="row"
            className={extraClasses.container}
          >
            <Typography variant="subtitle2" className={centerNote}>
              {Dictionary.defValue(DictionaryService.keys.audience)}
            </Typography>
            <Grid item xs={12} sm={12} md={6}>
              <FormControl component="fieldset">
                <RadioGroup onChange={() => store.switchMultipleSegments()}>
                  <FormControlLabel
                    checked={!store.multipleSegments}
                    control={<Radio color="primary" />}
                    label={Dictionary.defValue(
                      DictionaryService.keys.usersInSingleSegment
                    )}
                  />
                  <FormControlLabel
                    checked={store.multipleSegments}
                    control={<Radio color="primary" />}
                    label={Dictionary.defValue(
                      DictionaryService.keys.usersInMultipleSegments
                    )}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          {!store.multipleSegments && (
            <Grid
              container
              item
              direction="row"
              className={extraClasses.container}
            >
              <Typography variant="subtitle2" className={centerNote}>
                {Dictionary.defValue(DictionaryService.keys.sendTo)}
              </Typography>
              <Grid container item xs={12} sm={12} md={6}>
                <Grid item xs={12} sm={8} md={10}>
                  <FormControl fullWidth>
                    <CustomSelect
                      value={
                        store.includeSegments.length > 0
                          ? store.includeSegments[0].segmentId
                          : ""
                      }
                      onChange={(e: number) => store.addSegment(e)}
                      options={store.segmentsListForSelect()}
                    />
                  </FormControl>
                </Grid>
                <Grid container item xs={12} sm={4} md={2} justify="flex-end">
                  {store.includeSegments.length > 0 && (
                    <IconButton
                      onClick={() => {}}
                      className={extraClasses.iconButton}
                    >
                      <EditOutlined color="primary" />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => {}}
                    className={extraClasses.iconButton}
                  >
                    <AddCircleOutline color="primary" />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          )}
          {store.multipleSegments && (
            <SegmentRows
              onClick={() => {}}
              include={true}
              title={Dictionary.defValue(DictionaryService.keys.sendTo)}
            />
          )}
          {store.multipleSegments && store.includeSegments.length > 0 && (
            <SegmentRows
              onClick={() => {}}
              include={false}
              title={Dictionary.defValue(DictionaryService.keys.doNotSentTo)}
            />
          )}
        </Grid>
      </CardBody>
      <CardFooter>
        <Grid container item direction="row" className={extraClasses.container}>
          <Typography variant="subtitle2" className={centerNote}>
            {Dictionary.defValue(DictionaryService.keys.reachability)}
          </Typography>
          <Grid item xs={12} sm={12} md={8}>
            <Reachable />
          </Grid>
        </Grid>
      </CardFooter>
    </Card>
  );
};

export default observer(AudienceStep);
