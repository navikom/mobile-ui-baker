import React from "react";
import Typography from "@material-ui/core/Typography";
import {Dictionary, DictionaryService} from "services/Dictionary/Dictionary";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputWithIcon from "components/CustomInput/InputWithIcon";
import {Clear, InsertEmoticon, Person} from "@material-ui/icons";

type MessageComponentType = {
 titleStyle: string;
 message: string;
 error: boolean;
 onInput(e: React.ChangeEvent<HTMLInputElement> | string): void;
 onEmojiClick(e: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement): void;
 onVariableClick(e: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement): void;
 setCursorIndex(index: number): void;
 onClear(): void;
}

function DeviceMessageComponent(props: MessageComponentType) {
 const {titleStyle, error, setCursorIndex, message, onInput, onClear, onEmojiClick, onVariableClick} = props;
 return (
   <>
    <Typography variant="subtitle2" className={titleStyle}>
     {Dictionary.defValue(DictionaryService.keys.message)}
    </Typography>
    <Grid item xs={12} sm={12} md={8}>
     <FormControl fullWidth>
      <InputWithIcon
        multiline
        input={{error}}
        cursorChange={setCursorIndex}
        value={message}
        onChange={onInput}
        endAdornments={[
         {component: <Clear />, onClick: onClear},
         {component: <InsertEmoticon />, onClick: onEmojiClick},
         {component: <Person />, onClick: onVariableClick}
        ]}
      />
     </FormControl>
    </Grid>
   </>
 )
}

export default DeviceMessageComponent;
