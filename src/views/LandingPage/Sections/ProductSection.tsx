import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import InfoArea from "components/InfoArea/InfoArea";

import styles from "./whiteSectionStyle";
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>{Dictionary.defValue(DictionaryService.keys.weAreMuiditor)}</h2>
          <h4 className={classes.subTitle}>{Dictionary.defValue(DictionaryService.keys.welcomeToBeautiful)}</h4>
          <h5 className={classes.description}>
            {Dictionary.defValue(DictionaryService.keys.muiditorStandsForBest)}..
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title={Dictionary.defValue(DictionaryService.keys.muiditorFree)}
              description={Dictionary.defValue(DictionaryService.keys.noSignUpRequire)}
              icon={Chat}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title={Dictionary.defValue(DictionaryService.keys.muiditorEmbedPlugin)}
              description={Dictionary.defValue(DictionaryService.keys.embedMuiditorEditorAndOrViewer)}
              icon={VerifiedUser}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title={Dictionary.defValue(DictionaryService.keys.muiditorEmbedPluginPro)}
              description={Dictionary.defValue(DictionaryService.keys.upgradeFromFreeToPro)}
              icon={Fingerprint}
              iconColor="danger"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
