import React from "react";
import { FormRow } from "components/Grid/FormRow";

// interfaces
import { IUsersRegions } from "interfaces/IUsersRegions";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

import GridContainer from "components/Grid/GridContainer";

type UserLocationCardType = {
  location?: IUsersRegions;
}

export function UserLocationCard(props: UserLocationCardType) {
  const location = props.location ? props.location : { region: {} } as IUsersRegions;
  return (
    <GridContainer spacing={1}>
      <GridContainer item xs={12} spacing={3}>
        <FormRow data={[
          [Dictionary.defValue(DictionaryService.keys.country), location.region.country],
          [Dictionary.defValue(DictionaryService.keys.state), location.region.region],
          [Dictionary.defValue(DictionaryService.keys.city), location.region.city]
        ]}/>
      </GridContainer>
      <GridContainer item xs={12} spacing={3}>
        <FormRow data={[
          [Dictionary.defValue(DictionaryService.keys.locality), ""],
          [Dictionary.defValue(DictionaryService.keys.timezone), location.region.timezone], ["", ""]
        ]}/>
      </GridContainer>
    </GridContainer>
  )
}
