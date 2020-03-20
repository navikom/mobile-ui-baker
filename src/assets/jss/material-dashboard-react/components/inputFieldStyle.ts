import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    container: {
      marginBottom: theme.typography.pxToRem(20)
    },
    note: {
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.typography.pxToRem(20),
      width: theme.typography.pxToRem(150),
      opacity: 0.4
    },
    bottom: {
      alignSelf: "flex-end"
    },
    center: {
      alignSelf: "center"
    },
    textToRight: {
      textAlign: "right"
    },
    divider: {
      marginTop: theme.typography.pxToRem(10),
      marginBottom: theme.typography.pxToRem(10)
    },
    typography: {
      padding: theme.spacing(1),
      marginLeft: theme.typography.pxToRem(5)
    }
  })
);
