import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { blackOpacity } from "assets/jss/material-dashboard-react";

const cardTitle = {
  color: "#FFFFFF",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: 300,
  fontFamily: "'Josefin Sans', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
};

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.typography.pxToRem(20)
    },
    cardCategoryWhite: {
      "&,& a,& a:hover,& a:focus": {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
      },
      "& a,& a:hover,& a:focus": {
        color: "#FFFFFF"
      }
    },
    cardTitleWhite: cardTitle,
    cardTitleBlack: {
      ...cardTitle,
      color: blackOpacity(0.5)
    },
    cardTitleBlackBold: {
      ...cardTitle,
      color: blackOpacity(0.35),
      fontWeight: "bold"
    },
    small: {
      color: "#777",
      fontSize: "65%",
      fontWeight: 400,
      lineHeight: "1"
    },
    form: {
      "& > *": {
        margin: theme.spacing(1),
        width: 200
      }
    },
    center: {
      alignItems: "center"
    }
  })
);
