import React from 'react';
import { observer, useDisposable } from 'mobx-react-lite';
import { when } from 'mobx';
import { RouteComponentProps } from 'react-router';

// utils
import { lazy } from 'utils';

// services
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';

// models
import { Users } from 'models/User/UsersStore';
import { App } from 'models/App';
import { ROUTE_USERS_LIST } from 'models/Constants';

// assets
import useStyle from 'assets/jss/material-dashboard-react/components/listStyle';
import CardFooter from '../../components/Card/CardFooter';
import Typography from '@material-ui/core/Typography';
import CustomInput from '../../components/CustomInput/CustomInput';
import Grid from '@material-ui/core/Grid';
import DateInput from '../../components/CustomInput/DateInput';
import { Button } from '@material-ui/core';
import classNames from 'classnames';

// core components
const Table = lazy(() => import('components/Table/TablePagination'));
const Card = lazy(() => import('components/Card/Card'));
const CardHeader = lazy(() => import('components/Card/CardHeader'));
const CardBody = lazy(() => import('components/Card/CardBody'));

interface ClearUsersTableProps {
  performClear: (date: Date) => void;
}

const ClearUsersTable: React.FC<ClearUsersTableProps> = (
  {performClear}
) => {
  const [date, setDate] = React.useState(new Date());
  return (
    <CardFooter>
      <Grid container item direction="row" alignItems="center">
        <Grid item xs={4} sm={2} md={2}>
          <Typography variant="subtitle2">
            {Dictionary.defValue(DictionaryService.keys.clearUsersTable)}:
          </Typography>
        </Grid>
        <Grid item xs={4} sm={2} md={2}>
          <DateInput date={date} onChange={(e: Date) => setDate(e)} />
        </Grid>
        <Grid container item xs={4} sm={2} md={2} justify="center">
          <Button variant="outlined" onClick={() => performClear(date)}>
            {Dictionary.defValue(DictionaryService.keys.perform)}
          </Button>
        </Grid>
      </Grid>
    </CardFooter>
  )
}

const UsersList = observer((props: RouteComponentProps) => {
  useDisposable(() => when(() => App.sessionIsReady, () => Users.fetchItems()));

  const classes = useStyle();
  const performClear = (date: Date) => {
    Users.clearUsersTable(date);
  }

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>
          {Dictionary.defValue(DictionaryService.keys.users)}
        </h4>
        <p className={classes.cardCategoryWhite}>
          {Dictionary.defValue(DictionaryService.keys.usersDashboard)}
        </p>
      </CardHeader>
      <CardBody>
        <Table
          tableProps={{
            tableHeaderColor: 'primary',
            tableHead: [
              Dictionary.defValue(DictionaryService.keys.userId),
              Dictionary.defValue(DictionaryService.keys.date),
              Dictionary.defValue(DictionaryService.keys.action),
              Dictionary.defValue(DictionaryService.keys.email),
              Dictionary.defValue(DictionaryService.keys.status),
              Dictionary.defValue(DictionaryService.keys.activity)
            ],
            tableData: Users.userTableData
          }}
          paginationProps={{
            rowsPerPageOptions: Users.rowsPerPageOptions,
            count: Users.count,
            rowsPerPage: Users.viewRowsPerPage,
            page: Users.viewPage,
            onChangePage: Users.handleChangePageInView,
            onChangeRowsPerPage: Users.handleChangeRowsPerPage
          }}
          onRowClick={(data: string[]) =>
            props.history.push(ROUTE_USERS_LIST + '/' + data[0])
          }
        />
      </CardBody>
      <ClearUsersTable performClear={performClear} />
    </Card>
  );
});

export default UsersList;
