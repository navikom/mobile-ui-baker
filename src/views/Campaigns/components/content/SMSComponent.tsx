import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// @material-ui/icons
import {Clear, Person} from "@material-ui/icons";

// interfaces
import {ContentSMSPropsType, IContentSMSView} from "interfaces/IContentStep";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// components
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import cardStyles from "assets/jss/material-dashboard-react/views/cardStyle";
import FormControl from "@material-ui/core/FormControl";
import InputWithIcon from "components/CustomInput/InputWithIcon";

import AttributesEventsListPopper from "components/Poppers/AttributesEventsListPopper";
import EmojiPopper from "components/Poppers/EmojiPopper";
import MobileDeviceComponent from "views/Campaigns/components/content/device/MobileDeviceComponent";
import {insertSubstring} from "utils/string";
import {ISMSMessage} from "interfaces/IVariant";
import DeviceMessageComponent from "views/Campaigns/components/content/DeviceMessageComponent";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
   root: {
    padding: theme.spacing(1)
   },
   container: {
    marginTop: theme.typography.pxToRem(20)
   },
   label: {
    marginRight: theme.typography.pxToRem(30)
   }
  }));

const SMSComponent = (props: {store: IContentSMSView}) => {
 const store = props.store;
 const [cursorIndex, setCursorIndex] = useState(0);
 const classes = useStyles();
 const cardClasses = cardStyles();
 const extraClasses = extraStyles();
 const centerNote = classNames(classes.note, classes.center, classes.textToRight, extraClasses.label);

 const data = store.variant.data as ISMSMessage;

 const onInput = (key: ContentSMSPropsType) => (e: React.ChangeEvent<HTMLInputElement> | string) => {
  store.onInput(key, typeof e === "string" ? insertSubstring(data[key], cursorIndex, e) : e.target.value);
 };

 const onClear = (key: ContentSMSPropsType) => () => {
  store.onInput(key, "");
 };

 const onVariableClick = (key: ContentSMSPropsType) => (e: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement) => {
  store.variablesPopperStore
    .handleClick(e instanceof HTMLButtonElement ? e : e.currentTarget, onInput(key));
  store.emojiStore.clear();
 };

 const onEmojiClick = (key: ContentSMSPropsType) => (e: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement) => {
  store.emojiStore.handleClick(e instanceof HTMLButtonElement ? e : e.currentTarget, onInput(key));
  store.variablesPopperStore.clear();
 };

 return (
   <div className={extraClasses.root}>
    <Card>
     <CardHeader color="inherit" plain>
      <h4 className={cardClasses.cardTitleBlack}>
       {Dictionary.defValue(DictionaryService.keys.message).toUpperCase()}
      </h4>
     </CardHeader>
     <CardBody>
      <Grid container>
       <Grid item xs={12} sm={12} md={8}>
        <Grid container>
         <Grid container item direction="row" className={extraClasses.container}>
          <Typography variant="subtitle2" className={centerNote}>
           {Dictionary.defValue(DictionaryService.keys.sender)}
          </Typography>
          <Grid item xs={12} sm={12} md={8}>
           <FormControl fullWidth>
            <InputWithIcon
              input={{error: store.hasError("sender")}}
              cursorChange={setCursorIndex}
              value={data.sender}
              onChange={onInput("sender")}
              endAdornments={[
               {component: <Clear />, onClick: onClear("sender")},
               {component: <Person />, onClick: onVariableClick("sender")}
              ]}
            />
           </FormControl>
          </Grid>
         </Grid>
        </Grid>
        <Grid container>
         <Grid container item direction="row" className={extraClasses.container}>
          <DeviceMessageComponent
            titleStyle={centerNote}
            message={store.variant.data.message}
            error={store.hasError("message")}
            onInput={onInput("message")}
            onClear={onClear("message")}
            onEmojiClick={onEmojiClick("message")}
            onVariableClick={onVariableClick("message")}
            setCursorIndex={setCursorIndex}
          />
         </Grid>
        </Grid>
       </Grid>
       <Grid item xs={12} sm={12} md={4}>
        <MobileDeviceComponent variant={store.variant} justify="flex-end" />
       </Grid>
      </Grid>
     </CardBody>
    </Card>
    <AttributesEventsListPopper store={store.variablesPopperStore} />
    <EmojiPopper store={store.emojiStore} />
   </div>
 );
};

export default observer(SMSComponent);
