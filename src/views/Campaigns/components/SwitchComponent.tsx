import React from "react";
import classNames from "classnames";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

// core components
import FiltarableComponent from "components/Filter/FiltarableComponent";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";

// view stores
import { OneTimeRunViewStore } from "views/Campaigns/store/OneTimeRunViewStore";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.typography.pxToRem(20)
    },
    label: {
      width: theme.typography.pxToRem(200),
      marginRight: theme.typography.pxToRem(30)
    }
  })
);

type DeliveryTimeComponentProps = {
  onTime: (date: Date) => void;
  date?: Date;
  timeZone?: string;
  onTimeZone?: (value: string) => void;
};

const DeliveryTimeComponent = (props: DeliveryTimeComponentProps) => {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    classes.textToRight,
    extraClasses.label
  );

  const first = {
    date: props.date || new Date(),
    onChange: props.onTime
  };
  const second = {
    time: props.date || new Date(),
    onChange: props.onTime
  };
  let third;
  if (props.timeZone) {
    third = {
      value: props.timeZone,
      options: OneTimeRunViewStore.timeZones,
      onChange: props.onTimeZone
    };
  }
  return (
    <Grid container item direction="row" className={extraClasses.container}>
      <Typography variant="subtitle2" className={centerNote} />
      <Grid item xs={12} sm={12} md={6}>
        <FiltarableComponent first={first} second={second} third={third} />
      </Grid>
    </Grid>
  );
};

type Props = {
  setTimeDate: (date: Date) => void;
  setTimeZone?: (value: string) => void;
  switchOn: () => void;
  on: boolean;
  later?: Date;
  timeZone?: string;
  onTitle: string;
  offTitle: string;
  title: string;
};

function SwitchComponent(props: Props) {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    classes.textToRight,
    extraClasses.label
  );
  const {
    on,
    title,
    onTitle,
    offTitle,
    setTimeDate,
    setTimeZone,
    switchOn,
    later,
    timeZone
  } = props;
  return (
    <Grid container>
      <Grid container item direction="row" className={extraClasses.container}>
        <Typography variant="subtitle2" className={centerNote}>
          {title}
        </Typography>
        <Grid item xs={12} sm={12} md={6}>
          <RadioGroup onChange={switchOn}>
            <FormControlLabel
              checked={on}
              control={<Radio color="primary" />}
              label={onTitle}
            />
            <FormControlLabel
              checked={!on}
              control={<Radio color="primary" />}
              label={offTitle}
            />
          </RadioGroup>
        </Grid>
      </Grid>
      {!on && (
        <DeliveryTimeComponent
          onTime={setTimeDate}
          date={later}
          timeZone={timeZone}
          onTimeZone={setTimeZone}
        />
      )}
    </Grid>
  );
}

export default SwitchComponent;
