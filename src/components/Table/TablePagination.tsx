import React from "react";

// @material-ui/core components
import TablePagination from "@material-ui/core/TablePagination";

import Table from "components/Table/Table";
import { makeStyles } from "@material-ui/core/styles";
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

const useStyles = makeStyles({
  tableWrapper: {
    maxHeight: window.innerHeight - 100,
    overflow: "auto"
  }
});

function CustomTablePagination({ ...props }) {
  const classes = useStyles();
  return (
    <div className={classes.tableWrapper}>
      <Table
        stickyHeader
        aria-label="sticky table"
        {...props.tableProps}
        onRowClick={props.onRowClick}
      />
      {props.paginationProps.count > 5 && (
        <TablePagination
          labelRowsPerPage={`${Dictionary.defValue(
            DictionaryService.keys.rowsPerPage,
            DictionaryService.keys.rows
          )}:`}
          component="div"
          backIconButtonProps={{
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
          {...props.paginationProps}
        />
      )}
    </div>
  );
}

export default CustomTablePagination;
