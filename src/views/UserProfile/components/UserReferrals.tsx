import React from "react";
import { observer } from "mobx-react-lite";

// @material-ui/core
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Link from "@material-ui/core/Link";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// models
import { Users } from "models/User/UsersStore";

// core components
import Table from "components/Table/Table";
import { UserDetails } from "views/UserProfile/components/UserDetailsStore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      opacity: 0.5,
      marginTop: theme.typography.pxToRem(10)
    },
    link: {
      cursor: "pointer"
    }
  })
);

export default observer(() => {
  if (!UserDetails.user) return null;
  const classes = useStyles();
  const referrals = UserDetails.user.referrals;
  if (referrals.count === 0) {
    return (
      <Typography
        variant="subtitle1"
        color="inherit"
        align="center"
        className={classes.title}
      >
        {Dictionary.defValue(DictionaryService.keys.doNotHaveReferrals)}&nbsp;
        <Link
          onClick={() => console.log("link to referrals guide")}
          className={classes.link}
        >
          {Dictionary.defValue(DictionaryService.keys.learnMore)}.
        </Link>
      </Typography>
    );
  }
  return (
    <Table
      tableProps={{
        tableHeaderColor: "primary",
        tableHead: [
          Dictionary.defValue(DictionaryService.keys.id),
          Dictionary.defValue(DictionaryService.keys.date),
          Dictionary.defValue(DictionaryService.keys.action),
          Dictionary.defValue(DictionaryService.keys.email),
          Dictionary.defValue(DictionaryService.keys.status)
        ],
        tableData: Users.userTableData
      }}
      paginationProps={{
        rowsPerPageOptions: referrals.rowsPerPageOptions,
        count: referrals.count,
        rowsPerPage: referrals.viewRowsPerPage,
        page: referrals.viewPage,
        onChangePage: referrals.handleChangePageInView,
        onChangeRowsPerPage: referrals.handleChangeRowsPerPage
      }}
      onRowClick={(data: string[]) => UserDetails.bindCurrentReferral(data[0])}
    />
  );
});
