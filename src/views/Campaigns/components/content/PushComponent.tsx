import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// @material-ui/icons
import {Clear, InsertEmoticon, Person, Delete} from "@material-ui/icons";

// interfaces
import {ContentNotificationPropsType, IContentPushOrInApp} from "interfaces/IContentStep";
import {IPushMessage, IPushVariant} from "interfaces/IVariant";

// services
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";

// components
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import EmojiPopper from "components/Poppers/EmojiPopper";
import IOSSwitch from "components/Switch/IOSSwitch";
import FiltarableComponent from "components/Filter/FiltarableComponent";
import AttributesEventsListPopper from "components/Poppers/AttributesEventsListPopper";
import InputWithIcon from "components/CustomInput/InputWithIcon";

import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import cardStyles from "assets/jss/material-dashboard-react/views/cardStyle";

import MobileDeviceComponent from "views/Campaigns/components/content/device/MobileDeviceComponent";

// utils
import {insertSubstring} from "utils/string";
import DeviceMessageComponent from "views/Campaigns/components/content/DeviceMessageComponent";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
   root: {
    padding: theme.spacing(2)
   },
   container: {
    marginTop: theme.typography.pxToRem(20)
   },
   label: {
    width: theme.typography.pxToRem(150),
    marginRight: theme.typography.pxToRem(30)
   }
  }));

const KeyValuePairs = observer((props: {store: IContentPushOrInApp}) => {
 const classes = useStyles();
 const extraClasses = extraStyles();
 const centerNote = classNames(classes.note, classes.center, classes.textToRight, extraClasses.label);
 const variant = props.store.variant as IPushVariant;
 return (
   <>
    {
     variant.data.keyValuePairs.map((prop: string[], i: number) => {
        const first = {
         value: prop[0],
         onChange: (value: string) => props.store.updateKey(i, value),
         label: "key"
        };
        const second = {
         value: prop[1],
         onChange: (value: string) => props.store.updateValue(i, value),
         label: "value"
        };
        return (
          <Grid key={i} container item direction="row" className={extraClasses.container}>
           <Typography variant="subtitle2" className={centerNote}>
            {Dictionary.defValue(DictionaryService.keys.keyValuePair)}
           </Typography>
           <Grid item xs={12} sm={12} md={8}>
            <Grid container>
             <Grid item xs={12} sm={12} md={11}>
              <FiltarableComponent first={first} second={second} />
             </Grid>
             <Grid container item xs={12} sm={12} md={1} justify="flex-end">
              <IconButton onClick={() => props.store.deleteKeyValue(i)}>
               <Delete />
              </IconButton>
             </Grid>
            </Grid>
           </Grid>
          </Grid>
        );
       }
     )
    }
   </>
 );
});

function PushComponent(props: {store: IContentPushOrInApp}) {

 const store = props.store;

 const [cursorIndex, setCursorIndex] = useState(0);

 const classes = useStyles();
 const cardClasses = cardStyles();
 const extraClasses = extraStyles();
 const centerNote = classNames(classes.note, classes.center, classes.textToRight, extraClasses.label);

 const data = store.variant.data as IPushMessage;

 const onInput = (key: ContentNotificationPropsType) => (e: React.ChangeEvent<HTMLInputElement> | string) => {
  store.onInput(key, typeof e === "string" ? insertSubstring(data[key], cursorIndex, e) : e.target.value);
 };

 const onClear = (key: ContentNotificationPropsType) => () => {
  store.onInput(key, "");
 };

 const onVariableClick = (key: ContentNotificationPropsType) => (e: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement) => {
  store.variablesPopperStore
    .handleClick(e instanceof HTMLButtonElement ? e : e.currentTarget, onInput(key));
  store.emojiStore.clear();
 };

 const onEmojiClick = (key: ContentNotificationPropsType) => (e: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement) => {
  store.emojiStore.handleClick(e instanceof HTMLButtonElement ? e : e.currentTarget, onInput(key));
  store.variablesPopperStore.clear();
 };

 return (
   <div className={extraClasses.root}>
    <Grid container>
     <Grid item xs={12} sm={12} md={8}>
      <Card>
       <CardHeader color="inherit" plain>
        <h4 className={cardClasses.cardTitleBlack}>
         {Dictionary.defValue(DictionaryService.keys.message).toUpperCase()}
        </h4>
       </CardHeader>
       <CardBody>
        <Grid container item direction="row" className={extraClasses.container}>
         <Typography variant="subtitle2" className={centerNote}>
          {Dictionary.defValue(DictionaryService.keys.title)}
         </Typography>
         <Grid item xs={12} sm={12} md={8}>
          <FormControl fullWidth>
           <InputWithIcon
             input={{error: store.hasError("title")}}
             cursorChange={setCursorIndex}
             value={data.title}
             onChange={onInput("title")}
             endAdornments={[
              {component: <Clear />, onClick: onClear("title")},
              {component: <InsertEmoticon />, onClick: onEmojiClick("title")},
              {component: <Person />, onClick: onVariableClick("title")}
             ]}
           />
          </FormControl>
         </Grid>
        </Grid>
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
       </CardBody>
      </Card>
      <Card>
       <CardHeader color="inherit" plain>
        <Grid container justify="space-between" alignItems="center">
         <h4 className={cardClasses.cardTitleBlack}>
          {Dictionary.defValue(DictionaryService.keys.keyValuePairs).toUpperCase()}
         </h4>
         <IOSSwitch
           checked={store.keyValueEnabled}
           onChange={store.switchKeyValueEnabled}
           value={"On"}
         />
        </Grid>
       </CardHeader>
       <CardBody>
        {
         store.keyValueEnabled && <KeyValuePairs store={store} />
        }
        {
         store.keyValueEnabled && (
           <Grid container justify="center" className={extraClasses.container}>
            <Button variant="outlined" color="primary" onClick={store.createKeyValue}>
             {Dictionary.defValue(DictionaryService.keys.add)} {Dictionary.defValue(DictionaryService.keys.keyValuePair)}
            </Button>
           </Grid>
         )
        }
       </CardBody>
      </Card>
     </Grid>
     <Grid item xs={12} sm={12} md={4}>
      <MobileDeviceComponent variant={store.variant} justify="flex-end" />
     </Grid>
    </Grid>
    <AttributesEventsListPopper store={store.variablesPopperStore} />
    <EmojiPopper store={store.emojiStore} />
   </div>
 );
}

export default observer(PushComponent);
