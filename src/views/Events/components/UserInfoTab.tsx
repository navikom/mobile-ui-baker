import React, { ReactNode } from "react";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// interfaces
import { IUser } from "interfaces/IUser";

// core components
import { UserContactCard } from "views/Events/components/UserContactCard";
import { UserLocationCard } from "views/Events/components/UserLocationCard";
import { UserEventsCard } from "views/Events/components/UserEventsCard";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";

type InfoTabCardType = {
  header: string | ReactNode;
  body: ReactNode;
}

const InfoTabCard = (props: InfoTabCardType) => (
  <GridContainer>
    <GridItem xs={12} sm={12} md={12}>
      <Card>
        <CardHeader>
          {props.header}
        </CardHeader>
        <CardBody>
          {props.body}
        </CardBody>
      </Card>
    </GridItem>
  </GridContainer>
);

type UserInfoTabType = {
  user: IUser;
}

const UserInfoTab = (props: UserInfoTabType) => (
  <div>
    <InfoTabCard
      header={Dictionary.defValue(DictionaryService.keys.contact)}
      body={<UserContactCard user={props.user}/>}
    />
    <InfoTabCard
      header={Dictionary.defValue(DictionaryService.keys.location)}
      body={<UserLocationCard location={props.user!.location} />}
    />
    <InfoTabCard
      header={Dictionary.defValue(DictionaryService.keys.location)}
      body={<UserEventsCard user={props.user} />}
    />
  </div>
);

export default UserInfoTab
