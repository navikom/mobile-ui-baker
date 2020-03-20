import React from "react";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// core components
import { FormRow } from "components/Grid/FormRow";
import GridContainer from "components/Grid/GridContainer";

// interfaces
import { IUser } from "interfaces/IUser";

type UserEventsCardType = {
  user: IUser;
}
export const UserEventsCard = (props: UserEventsCardType) => (
  <GridContainer spacing={1}>
    <GridContainer item xs={12} spacing={3}>
      <FormRow
        data={[
          [
            Dictionary.defValue(DictionaryService.keys.firstSeen),
            Dictionary.timeDateString(props.user.createdAt)
          ],
          [
            Dictionary.defValue(DictionaryService.keys.lastSeen),
            Dictionary.timeDateString(props.user.lastEvent)
          ],
          [
            Dictionary.defValue(DictionaryService.keys.identified),
            Dictionary.timeDateString(props.user.createdAt)
          ]
        ]}
      />
    </GridContainer>
    <GridContainer item xs={12} spacing={3}>
      <FormRow
        data={[
          [
            Dictionary.defValue(DictionaryService.keys.totalEvents),
            props.user.eventsCount
          ],
          [
            Dictionary.defValue(DictionaryService.keys.totalTime),
            props.user.totalTime
          ],
          ["", ""]
        ]}
      />
    </GridContainer>
  </GridContainer>
);
