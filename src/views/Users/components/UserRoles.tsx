import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

// services

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { UserDetails } from "views/Users/components/UserDetailsStore";
import { IRole } from "interfaces/IRole";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      width: theme.typography.pxToRem(200)
    }
  })
);

export default observer(() => {
  const classes = useStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    extraClasses.label
  );
  const user = UserDetails.user;
  return (
    <Grid container>
      {UserDetails.roles.map((role: IRole, i: number) => (
        <Grid
          key={i}
          container
          item
          direction="row"
          className={classes.container}
        >
          <Typography variant="subtitle2" className={centerNote}>
            {role.name}:
          </Typography>
          <Switch
            checked={user && user.hasRole(role.roleId)}
            onChange={() => UserDetails.updateRole(role)}
            value={role.name}
            color="primary"
          />
        </Grid>
      ))}
    </Grid>
  );
});
