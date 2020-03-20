import React from "react";
import GridItem from "components/Grid/GridItem";

export const FormRow = ({ ...props }) => {
  return (
    <React.Fragment>
      {props.data.map((entry: string[], key: number) => (
        <GridItem xs={4} key={key}>
          <div>
            {entry[0].length ? entry[0].toUpperCase() + ":" : ""}{" "}
            <b>{entry[1]}</b>
          </div>
        </GridItem>
      ))}
    </React.Fragment>
  );
};
