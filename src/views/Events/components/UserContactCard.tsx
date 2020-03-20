import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";
import React from "react";
import GridContainer from "components/Grid/GridContainer";
import { FormRow } from "components/Grid/FormRow";
import { IUser } from "interfaces/IUser";

export const UserContactCard = (props: {user: IUser | null}) => {
  const user = props.user;
  return (
    <GridContainer spacing={1}>
      <GridContainer item xs={12} spacing={3}>
        <FormRow data={[
          [Dictionary.defValue(DictionaryService.keys.name), user!.firstName],
          [Dictionary.defValue(DictionaryService.keys.email), user!.email],
          [Dictionary.defValue(DictionaryService.keys.phone), user!.phone]
        ]}/>
      </GridContainer>
    </GridContainer>
  )
};
