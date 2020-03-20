import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FiltarableComponent from "components/Filter/FiltarableComponent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    note: {
      opacity: 0.4,
      padding: theme.typography.pxToRem(10)
    }
  })
);

type PeriodComponentProps = {
  amount: number;
  onAmount: (e: number) => void;
  period: string;
  onPeriod: (e: string) => void;
  options: string[];
  tale: string;
};

const PeriodComponent = (props: PeriodComponentProps) => {
  const classes = useStyles();

  const first = {
    value: props.amount,
    onChange: props.onAmount,
    type: "number"
  };

  const second = {
    value: props.period,
    options: props.options,
    onChange: props.onPeriod
  };

  return (
    <Grid container item md={10}>
      <Grid item md={6}>
        <FiltarableComponent first={first} second={second} />
      </Grid>
      <Grid container item md={6}>
        <Typography variant="body1" className={classes.note}>
          {props.tale}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default PeriodComponent;
