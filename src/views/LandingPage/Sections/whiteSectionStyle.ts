import { cardTitle, title } from 'assets/jss/material-kit-react';
import { createStyles } from '@material-ui/core';
import { whiteColor } from '../../../assets/jss/material-dashboard-react';

const whiteSectionStyle = createStyles({
  section: {
    padding: "70px 0",
    textAlign: "center"
  },
  title: {
    ...title,
    marginBottom: "1rem",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  subTitle: {
    ...cardTitle
  },
  description: {
    color: "#999"
  },
  bigIcon: {
    fontSize: 280,
    opacity: 0.5
  },
  group: {
    marginTop: 30
  },
  share: {
    margin: 5,
    borderRadius: 20
  },
  white: {
    borderColor: whiteColor,
    color: whiteColor
  },
  twitter: {
    boxShadow: '0 14px 26px -12px rgba(85, 172, 238, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(85, 172, 238, 0.2)',
    backgroundColor: '#55acee',
    color: whiteColor,
    opacity: 1,
    '&:hover': {
      backgroundColor: 'rgba(85,172,238,0.73)',
    }
  },
  facebook: {
    boxShadow: '0 2px 2px 0 rgba(59, 89, 152, 0.14), 0 3px 1px -2px rgba(59, 89, 152, 0.2), 0 1px 5px 0 rgba(59, 89, 152, 0.12)',
    backgroundColor: '#3b5998',
    color: whiteColor,
    opacity: 1,
    '&:hover': {
      backgroundColor: 'rgba(59,89,152,0.8)',
    }
  },
  email: {
    backgroundColor: whiteColor,
    color: '#666666',
    opacity: 1,
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.8)',
    }
  }
});

export default whiteSectionStyle;
