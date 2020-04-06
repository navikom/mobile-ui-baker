import React from "react";
import { FormRow } from "components/Grid/FormRow";

// interfaces

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

import GridContainer from "components/Grid/GridContainer";
import { IRegion } from "interfaces/IRegion";

type UserLocationCardType = {
  location?: IRegion;
}

export function UserLocationCard(props: UserLocationCardType) {
  const location = props.location ? props.location : {} as IRegion;
  return (
    <GridContainer spacing={1}>
      <GridContainer item xs={12} spacing={3}>
        <FormRow data={[
          [Dictionary.defValue(DictionaryService.keys.country), location.country || ""],
          [Dictionary.defValue(DictionaryService.keys.state), location.region || ""],
          [Dictionary.defValue(DictionaryService.keys.city), location.city || ""]
        ]}/>
      </GridContainer>
      <GridContainer item xs={12} spacing={3}>
        <FormRow data={[
          [Dictionary.defValue(DictionaryService.keys.locality), ""],
          [Dictionary.defValue(DictionaryService.keys.timezone), location.timezone || ""], ["", ""]
        ]}/>
      </GridContainer>
    </GridContainer>
  )
}
