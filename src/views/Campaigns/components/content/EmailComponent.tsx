import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

// @material-ui/core
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";

// @material-ui/icons
import { Person, Clear, InsertEmoticon, Delete } from "@material-ui/icons";

// core components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import InputWithIcon from "components/CustomInput/InputWithIcon";

// interfaces
import {
  ContentEmailPropsType,
  IContentEmailView
} from "interfaces/IContentStep";

// services
import { Dictionary, DictionaryService } from "services/Dictionary/Dictionary";

// components
import AttributesEventsListPopper from "components/Poppers/AttributesEventsListPopper";

// styles
import useStyles from "assets/jss/material-dashboard-react/components/inputFieldStyle";
import cardStyles from "assets/jss/material-dashboard-react/views/cardStyle";
import EmojiPopper from "components/Poppers/EmojiPopper";
import BeeComponent from "views/Campaigns/components/content/BeeComponent";
import { inheritColor } from "assets/jss/material-dashboard-react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import LabeledInput from "components/CustomInput/LabeledInput";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import validate from "validate.js";
import { IAttachment } from "interfaces/IAttachment";
import { insertSubstring } from "utils/string";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2)
    },
    divider: {
      height: theme.typography.pxToRem(30)
    },
    container: {
      marginTop: theme.typography.pxToRem(20)
    },
    label: {
      width: theme.typography.pxToRem(200),
      marginRight: theme.typography.pxToRem(30)
    },
    letterWrapper: {
      position: "relative",
      border: "1px solid rgba(0,0,0,.1)",
      minHeight: theme.typography.pxToRem(100),
      padding: theme.spacing(1),
      overflowY: "auto"
    },
    letterCover: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      backgroundColor: inheritColor[0],
      opacity: 0,
      width: "100%",
      fontSize: theme.typography.pxToRem(25),
      fontWeight: "bold",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      "&:hover,&:after": {
        content: "'Open Email Editor...'",
        cursor: "pointer",
        opacity: 0.8
      }
    },
    marginBottom5: {
      marginBottom: theme.typography.pxToRem(5)
    },
    marginTop5: {
      marginTop: theme.typography.pxToRem(5)
    }
  })
);

const EmailFormDialog = (props: {
  open: boolean;
  handleClose: () => void;
  onSend: (email: string) => void;
}) => {
  const constraints = {
    email: {
      presence: {
        message: `^${Dictionary.defValue(
          DictionaryService.keys.cantBeEmpty,
          "Email"
        )}`
      },
      email: {
        message: `^${Dictionary.defValue(
          DictionaryService.keys["auth:invalid-email"]
        )}`
      }
    }
  };

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string } | undefined>(
    undefined
  );
  const { open, handleClose, onSend } = props;

  const onChange = (email: string) => {
    setErrors(validate({ email }, constraints));
    setEmail(email);
  };

  const onSendHandler = () => {
    onSend(email);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {Dictionary.defValue(DictionaryService.keys.sendTo)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {Dictionary.defValue(DictionaryService.keys.sendTestEmailLetter)}.
        </DialogContentText>
        <LabeledInput
          error={errors !== undefined}
          margin="dense"
          onChange={onChange}
          id="name"
          label={Dictionary.defValue(DictionaryService.keys.email)}
          type="email"
          helperText={errors && errors.email}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {Dictionary.defValue(DictionaryService.keys.cancel)}
        </Button>
        <Button
          disabled={errors !== undefined || email.length === 0}
          onClick={onSendHandler}
          color="primary"
        >
          {Dictionary.defValue(DictionaryService.keys.send)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function EmailComponent(props: { store: IContentEmailView }) {
  const store = props.store;
  const [testLetterDialogOpen, setTestLetterDialogOpen] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(0);

  const classes = useStyles();
  const cardClasses = cardStyles();
  const extraClasses = extraStyles();
  const centerNote = classNames(
    classes.note,
    classes.center,
    classes.textToRight,
    extraClasses.label
  );

  const onInput = (key: ContentEmailPropsType) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    store.onInput(
      key,
      typeof e === "string"
        ? insertSubstring(store[key], cursorIndex, e)
        : e.target.value
    );
  };

  const onClear = (key: ContentEmailPropsType | number) => () => {
    typeof key === "number"
      ? store.attachments[key].setUrl("")
      : store.onInput(key, "");
  };

  const onAttachmentInput = (index: number) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    store.attachments[index].setUrl(
      typeof e === "string" ? store.attachments[index].url + e : e.target.value
    );
  };

  const onVariableClick = (key: ContentEmailPropsType | number) => (
    e: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement
  ) => {
    store.variablesPopperStore.handleClick(
      e instanceof HTMLButtonElement ? e : e.currentTarget,
      typeof key === "number" ? onAttachmentInput(key) : onInput(key)
    );
    store.emojiStore.clear();
  };

  const onEmojiClick = (key: ContentEmailPropsType) => (
    e: React.MouseEvent<HTMLButtonElement> | HTMLButtonElement
  ) => {
    store.emojiStore.handleClick(
      e instanceof HTMLButtonElement ? e : e.currentTarget,
      onInput(key)
    );
    store.variablesPopperStore.clear();
  };

  return (
    <div className={extraClasses.root}>
      <Card>
        <CardHeader color="inherit" plain>
          <h4 className={cardClasses.cardTitleBlack}>
            {Dictionary.defValue(DictionaryService.keys.from).toUpperCase()}
          </h4>
        </CardHeader>
        <CardBody>
          <Grid container>
            <Grid
              container
              item
              direction="row"
              className={extraClasses.container}
            >
              <Typography variant="subtitle2" className={centerNote}>
                {Dictionary.defValue(DictionaryService.keys.name)}
              </Typography>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth>
                  <InputWithIcon
                    divider={{ className: extraClasses.divider }}
                    value={store.fromName}
                    onChange={onInput("fromName")}
                    cursorChange={setCursorIndex}
                    endAdornments={[
                      { component: <Clear />, onClick: onClear("fromName") },
                      {
                        component: <Person />,
                        onClick: onVariableClick("fromName")
                      }
                    ]}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction="row"
              className={extraClasses.container}
            >
              <Typography variant="subtitle2" className={centerNote}>
                {Dictionary.defValue(DictionaryService.keys.email)}
              </Typography>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth>
                  <InputWithIcon
                    divider={{ className: extraClasses.divider }}
                    value={store.fromEmail}
                    onChange={onInput("fromEmail")}
                    cursorChange={setCursorIndex}
                    endAdornments={[
                      { component: <Clear />, onClick: onClear("fromEmail") },
                      {
                        component: <Person />,
                        onClick: onVariableClick("fromEmail")
                      }
                    ]}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </CardBody>
      </Card>
      <Card>
        <CardHeader color="inherit" plain>
          <h4 className={cardClasses.cardTitleBlack}>
            {Dictionary.defValue(DictionaryService.keys.message).toUpperCase()}
          </h4>
        </CardHeader>
        <CardBody>
          <Grid container>
            <Grid
              container
              item
              direction="row"
              className={extraClasses.container}
            >
              <Typography variant="subtitle2" className={centerNote}>
                {Dictionary.defValue(DictionaryService.keys.subject)}
              </Typography>
              <Grid item xs={12} sm={12} md={6}>
                <FormControl fullWidth>
                  <InputWithIcon
                    divider={{ className: extraClasses.divider }}
                    value={store.subject}
                    onChange={onInput("subject")}
                    cursorChange={setCursorIndex}
                    endAdornments={[
                      { component: <Clear />, onClick: onClear("subject") },
                      {
                        component: <InsertEmoticon />,
                        onClick: onEmojiClick("subject")
                      },
                      {
                        component: <Person />,
                        onClick: onVariableClick("subject")
                      }
                    ]}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              container
              item
              direction="row"
              className={extraClasses.container}
            >
              <Typography variant="subtitle2" className={centerNote}>
                {Dictionary.defValue(DictionaryService.keys.body)}
              </Typography>
              <Grid item xs={12} sm={12} md={6}>
                {store.htmlFile && (
                  <Button
                    className={extraClasses.marginBottom5}
                    variant="outlined"
                    onClick={() => setTestLetterDialogOpen(true)}
                    color="primary"
                  >
                    {Dictionary.defValue(DictionaryService.keys.sendTestLetter)}
                  </Button>
                )}
                <div className={extraClasses.letterWrapper}>
                  <div dangerouslySetInnerHTML={{ __html: store.htmlFile }} />
                  <div
                    className={extraClasses.letterCover}
                    onClick={store.openEditor}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </CardBody>
      </Card>
      <Card>
        <CardHeader color="inherit" plain>
          <h4 className={cardClasses.cardTitleBlack}>
            {Dictionary.defValue(
              DictionaryService.keys.attachments
            ).toUpperCase()}
          </h4>
        </CardHeader>
        <CardBody>
          <Grid container>
            <Grid
              container
              item
              direction="row"
              className={extraClasses.container}
            >
              <Typography variant="subtitle2" className={centerNote}>
                {Dictionary.defValue(DictionaryService.keys.attach)}
              </Typography>
              <Grid item xs={12} sm={12} md={6}>
                {store.attachments.map((attachment: IAttachment, i: number) => (
                  <FormControl
                    key={i}
                    fullWidth
                    className={extraClasses.marginBottom5}
                  >
                    <InputWithIcon
                      divider={{ className: extraClasses.divider }}
                      value={attachment.url}
                      cursorChange={setCursorIndex}
                      placeholder="http://example.com/document.pdf"
                      onChange={onAttachmentInput(i)}
                      endAdornments={[
                        { component: <Clear />, onClick: onClear(i) },
                        { component: <Person />, onClick: onVariableClick(i) },
                        {
                          component: <Delete />,
                          onClick: () => store.deleteAttachment(i)
                        }
                      ]}
                    />
                  </FormControl>
                ))}
                <Button
                  className={extraClasses.marginTop5}
                  variant="outlined"
                  onClick={store.addAttachment}
                  color="primary"
                >
                  {Dictionary.defValue(DictionaryService.keys.addAttachment)}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </CardBody>
      </Card>
      <AttributesEventsListPopper store={store.variablesPopperStore} />
      <EmojiPopper store={store.emojiStore} />
      <BeeComponent
        open={store.editorOpened}
        handleClose={store.closeEditor}
        onSend={store.onSend}
        onSave={store.onSave}
        onSaveAsTemplate={store.onSaveAsTemplate}
        onError={store.onError}
      />
      <EmailFormDialog
        open={testLetterDialogOpen}
        handleClose={() => setTestLetterDialogOpen(false)}
        onSend={(email: string) => console.log("Sent letter to %s", email)}
      />
    </div>
  );
}

export default observer(EmailComponent);
