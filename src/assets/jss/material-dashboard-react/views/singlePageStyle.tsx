import { createStyles } from "@material-ui/core/styles";

const styles = createStyles({
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
  }
});

export default styles;
