import React, { RefObject } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { observer } from 'mobx-react-lite';
import { makeStyles, Theme, Typography, withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import BeforeStartBox from './components/BeforeStartBox';
import Panels from './components/Panels';
import BootstrapInput from 'components/CustomInput/BootstrapInput';
import CardFooter from 'components/Card/CardFooter';
import { Dictionary, DictionaryService } from 'services/Dictionary/Dictionary';
import ContactUsStore from './ContactUsStore';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#555'
  },
  title: {
    color: theme.palette.background.paper,
    marginBottom: 30
  },
  subtitle: {
    color: theme.palette.background.paper,
    marginBottom: 50
  },
  margin: {
    margin: theme.spacing(1),
  }
}));

const CustomButton = withStyles(theme => ({
  root: {
    color: theme.palette.background.paper,
    backgroundColor: '#00BBFF',
    '&:hover': {
      backgroundColor: 'rgba(0,187,255,0.79)',
    }
  }
}))(Button);

const CustomSnack = withStyles(theme => ({
  root: {
    zIndex: 999,
  }
}))(Snackbar)

interface ContactUsProps {
  store: ContactUsStore;
}

const ContactUsComponent: React.FC<ContactUsProps> = ({store}) => {
  const classes = useStyles();
  const recaptchaRef = React.createRef();
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const handleSnackClose = () => setOpenSnack(false)
  const handleOpenSnack = () => setOpenSnack(true);

  return (
    <Container maxWidth="md">
      <Typography variant="h2" align="center" className={classes.title}>
        {Dictionary.defValue(DictionaryService.keys.contactUs)}
      </Typography>
      <Typography variant="h5" align="center" className={classes.subtitle}>
        {Dictionary.defValue(DictionaryService.keys.fillFreeToContactUs)}
      </Typography>
      <div>
        <Card className={classes.root}>
          <CardHeader
            title={
              <Typography variant="h3" align="center">
                {Dictionary.defValue(DictionaryService.keys.whatAreYouLookingFor)}
              </Typography>
            }
          />
          <CardContent>
            <BeforeStartBox />
            <Panels openDialog={openDialog} />
          </CardContent>
        </Card>
      </div>
      <Dialog
        maxWidth="md"
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        scroll="body"
      >
        <Card>
          <CardHeader title={Dictionary.defValue(DictionaryService.keys.sendEmail)}/>
          <CardContent>
            <FormControl fullWidth className={classes.margin} variant="outlined">
              <BootstrapInput
                error={store.hasKeyInError('name')}
                endAdornment={store.errors.name}
                onChange={store.onInput('name')}
                fullWidth
                placeholder={Dictionary.defValue(DictionaryService.keys.type) + ' ' + Dictionary.defValue(DictionaryService.keys.name)}
              />
            </FormControl>
            <FormControl fullWidth className={classes.margin} variant="outlined">
              <BootstrapInput
                error={store.hasKeyInError('email')}
                fullWidth
                endAdornment={store.errors.email}
                onChange={store.onInput('email')}
                placeholder={Dictionary.defValue(DictionaryService.keys.type) + ' ' + Dictionary.defValue(DictionaryService.keys.email)}
              />
            </FormControl>
            <FormControl fullWidth className={classes.margin} variant="outlined">
              <BootstrapInput
                error={store.hasKeyInError('message')}
                endAdornment={store.errors.message}
                onChange={store.onInput('message')}
                fullWidth
                multiline
                rows={8}
                placeholder={Dictionary.defValue(DictionaryService.keys.typeYourMessageHere)}
              />
            </FormControl>
            <CardFooter>
              <ReCAPTCHA
                ref={recaptchaRef as RefObject<ReCAPTCHA>}
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY || ''}
                onChange={store.setCaptchaChecked}
              />
              <CustomButton
                onClick={() => {
                  store.sendEmail(() => {
                    closeDialog();
                    handleOpenSnack();
                  })
                }}
                disabled={!store.readyToSend}
                variant="contained">
                {Dictionary.defValue(DictionaryService.keys.send)}
              </CustomButton>
            </CardFooter>
          </CardContent>
        </Card>
      </Dialog>
      <CustomSnack
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={handleSnackClose} severity="success">
          {Dictionary.defValue(DictionaryService.keys.yourMessageWasSent)}
        </Alert>
      </CustomSnack>
    </Container>
  )
}

const ContactUs = observer(ContactUsComponent);

const Contact = () => {
  const store = new ContactUsStore();
  return <ContactUs store={store} />
}

export default Contact;
