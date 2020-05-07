import { cardTitle, title } from 'assets/jss/material-kit-react';
import { createStyles } from '@material-ui/core';

const productStyle = createStyles({
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
  }
});

export default productStyle;
