import React from 'react';
import useStyles from './Privacy';
import Typography from '@material-ui/core/Typography/Typography';

const Privacy = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {
        [
          'Webinsolut, Muiditor or any of their affiliates doing business as Muiditor (each "Muiditor," "We," "Us" or "Our") is committed to safeguarding your privacy and ensuring that you continue to trust Us with Your personal information.',
          'Customarily, We collect personal information only directly from you (contact data, payment, delivery details etc.). We will tell You what personal information is mandatory when placing an Order.',
          'In specific cases, personal information about You is collected by Us automatically.',
          'You may also provide personal information about others. If so, You are responsible for the entire data You provide to Us (and We assume that You are authorized to give such data).',
          'We will collect Your personal information only with specific purpose in mind (processing an Order, sending You marketing communication etc.).',
          'You must be older than 16 years in order to purchase a subscription with Us if you reside in EU. Otherwise, children\'s personal information is cautiously processed (only with specific safeguards).',
          'In order to process Your Purchase, We will share Your personal information with our partners.',
          'You have specific rights in respect of data protection and We foster an environment facilitating their exercise (right to access, rectify, object, delete, receive your personal information or to complaint).',
          'If you are residing in the European Union, Your Personal information may be transferred outside the European Union or the European Economic Area.',
          'We installed adequate safeguards to secure Your personal information and We also implemented specific time periods so that to ensure that Your data is not retained longer than necessary for the stated purpose.',
          'We have a dedicated point for you to contact us in any privacy matters (support@webinsolut.com).',
          'Any question you might have on the topic of personal information, we have a dedicated address (support@webinsolut.com). Forms to help you articulate your query are available at (support@webinsolut.com).',
          'All your options and messages will be responded as provided by law (delays in implementing your options may occur due to technical reasons).'
        ].map((prop, i) => (
          <Typography key={i.toString()}>{prop}</Typography>
        ))
      }
    </div>
  )
}

export default Privacy;
