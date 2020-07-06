import React from 'react';
import Typography from '@material-ui/core/Typography';
import useStyles from './privacyStyles';

const Support = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography>Here at FacetsUI we strive to create great products and top-notch quality above everything.
        Our Support System follows the same belief.</Typography>
      <br />
      <Typography variant="subtitle1"><b>{`WE OFFER SUPPORT FOR`.toUpperCase()}:</b></Typography>
      <ul>
        {
          [
            'Helping you use the features within our product',
            'Bug fixes – if you discovered bug in our product we will fix it',
            'Functionalities which do not work as advertised — we will fix them as soon as we find out from you that there might be something wrong'
          ].map((prop, i) => <Typography key={i.toString()} component="li">{prop}</Typography>)
        }
      </ul>
      <Typography variant="subtitle1"><b>{`WE DO NOT`.toUpperCase()}:</b></Typography>
      <ul>
        {
          [
            'Offer Support for third party plugins compatibility – We try our best to make our themes compatible with most of the popular plugins but it’s not always possible to make it compatible with every plugin or update out there.',
            'Fix hosting, server environment, or software issues.',
            'Schedule a specific time to offer support and use screen sharing applications'
          ].map((prop, i) => <Typography key={i.toString()} component="li">{prop}</Typography>)
        }
      </ul>
      <Typography>
        <b>We do not offer human-based support for our free products.</b>{' '}
        If you have a custom question as a user of our free products, first you{'\''}l need to subscribe to one of our plans. However, we aim to keep all our users satisfied with the quality of our products, therefore, we have created extensive documentations to guide you through installing and using our products.
      </Typography>
    </div>
  )
}

export default Support;
