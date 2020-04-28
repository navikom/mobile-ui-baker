import { createStyles } from "@material-ui/core/styles";
import { defaultFont, whiteColor } from 'assets/jss/material-dashboard-react';

const styles = createStyles({
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  title: {
    ...defaultFont,
    lineHeight: '30px',
    fontSize: '24px',
    borderRadius: '3px',
    color: whiteColor,
    opacity: 0.5,
    margin: '0',
    '&:hover,&:focus': {
      background: 'transparent',
      color: whiteColor,
      opacity: 0.7
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: 300,
    fontFamily: "'Josefin Sans', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  small: {
    color: "#777",
    fontSize: "65%",
    fontWeight: 400,
    lineHeight: "1"
  },
  titleWhite: {
    fontWeight: 700,
    textAlign: "center"
  },
  helper: {
    textAlign: "center"
  },
  button: {
    marginTop: 40,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: whiteColor
  },
  paragraph: {
    margin: "15px 0"
  }
});

export default styles;
