import {
  drawerWidth,
  transition,
  boxShadow,
  defaultFont,
  primaryColor,
  primaryBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor,
  blackColor,
  hexToRgb,
  whiteOpacity
} from "assets/jss/material-dashboard-react.ts";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    drawerPaper: {
      border: "none",
      position: "fixed",
      top: "0",
      bottom: "0",
      left: "0",
      zIndex: 1,
      ...boxShadow,
      width: drawerWidth,
      [theme.breakpoints.up("md")]: {
        width: drawerWidth,
        position: "fixed",
        height: "100%"
      },
      [theme.breakpoints.down("sm")]: {
        width: drawerWidth,
        ...boxShadow,
        position: "fixed",
        display: "block",
        top: "0",
        height: "100vh",
        right: "0",
        left: "auto",
        zIndex: "1032",
        visibility: "visible",
        overflowY: "visible",
        borderTop: "none",
        textAlign: "left",
        paddingRight: "0px",
        paddingLeft: "0",
        transform: `translate3d(${drawerWidth}px, 0, 0)`,
        ...transition
      }
    },
    drawerPaperRTL: {
      [theme.breakpoints.up("md")]: {
        left: "auto !important",
        right: "0 !important"
      },
      [theme.breakpoints.down("sm")]: {
        left: "0  !important",
        right: "auto !important"
      }
    },
    logo: {
      position: "relative",
      padding: "15px 15px",
      zIndex: 4,
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: "0",

        height: theme.typography.pxToRem(1),
        right: theme.typography.pxToRem(15),
        width: "calc(100% - 30px)",
        backgroundColor: "rgba(" + hexToRgb(grayColor[6]) + ", 0.3)"
      }
    },
    logoLink: {
      ...defaultFont,
      textTransform: "uppercase",
      padding: "5px 0",
      display: "block",
      fontSize: theme.typography.pxToRem(18),
      textAlign: "left",
      fontWeight: 400,
      lineHeight: theme.typography.pxToRem(30),
      textDecoration: "none",
      backgroundColor: "transparent",
      "&,&:hover": {
        color: whiteColor
      }
    },
    logoLinkRTL: {
      textAlign: "right"
    },
    logoImage: {
      width: "30px",
      display: "inline-block",
      maxHeight: theme.typography.pxToRem(30),
      marginLeft: theme.typography.pxToRem(10)
    },
    img: {
      width: theme.typography.pxToRem(35),
      top: theme.typography.pxToRem(22),
      position: "absolute",
      verticalAlign: "middle",
      border: "0"
    },
    logoText: {
      marginLeft: theme.typography.pxToRem(35),
      marginTop: theme.typography.pxToRem(8)
    },
    background: {
      position: "absolute",
      zIndex: 1,
      height: "100%",
      width: "100%",
      display: "block",
      top: "0",
      left: "0",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      "&:after": {
        position: "absolute",
        zIndex: 3,
        width: "100%",
        height: "100%",
        content: '""',
        display: "block",
        background: blackColor,
        opacity: ".8"
      }
    },
    list: {
      marginTop: theme.typography.pxToRem(20),
      paddingLeft: "0",
      paddingTop: "0",
      paddingBottom: "0",
      marginBottom: "0",
      listStyle: "none",
      position: "unset"
    },
    item: {
      position: "relative",
      display: "block",
      textDecoration: "none",
      "&:hover,&:focus,&:visited,&": {
        color: whiteColor
      }
    },
    itemLink: {
      width: "100%",
      transition: "all 300ms linear",
      margin: "10px 15px 0",
      borderRadius: theme.typography.pxToRem(3),
      position: "relative",
      display: "block",
      padding: "10px 15px",
      backgroundColor: "transparent",
      ...defaultFont,
      "&:hover": {
        backgroundColor: whiteOpacity(0.2)
      }
    },
    itemIcon: {
      width: theme.typography.pxToRem(24),
      height: theme.typography.pxToRem(30),
      fontSize: theme.typography.pxToRem(24),
      lineHeight: theme.typography.pxToRem(30),
      float: "left",
      marginRight: theme.typography.pxToRem(15),
      textAlign: "center",
      verticalAlign: "middle",
      color: "rgba(" + hexToRgb(whiteColor) + ", 0.8)"
    },
    itemIconRTL: {
      marginRight: theme.typography.pxToRem(3),
      marginLeft: theme.typography.pxToRem(15),
      float: "right"
    },
    itemText: {
      ...defaultFont,
      margin: "0",
      lineHeight: theme.typography.pxToRem(30),
      fontSize: theme.typography.pxToRem(14),
      color: whiteColor
    },
    categoryText: {
      opacity: 0.6,
      textAlign: "center"
    },
    itemTextRTL: {
      textAlign: "right"
    },
    whiteFont: {
      color: whiteColor
    },
    purple: {
      backgroundColor: primaryColor[0],
      ...primaryBoxShadow,
      "&:hover": {
        backgroundColor: primaryColor[0],
        ...primaryBoxShadow
      }
    },
    blue: {
      backgroundColor: `${infoColor[0]} !important`,
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(infoColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb(blackColor) +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(infoColor[0]) +
        ",.2)",
      "&:hover": {
        backgroundColor: infoColor[0]
      }
    },
    green: {
      backgroundColor: successColor[0],
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(successColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb(blackColor) +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(successColor[0]) +
        ",.2)",
      "&:hover": {
        backgroundColor: successColor[0],
        boxShadow:
          "0 12px 20px -10px rgba(" +
          hexToRgb(successColor[0]) +
          ",.28), 0 4px 20px 0 rgba(" +
          hexToRgb(blackColor) +
          ",.12), 0 7px 8px -5px rgba(" +
          hexToRgb(successColor[0]) +
          ",.2)"
      }
    },
    orange: {
      backgroundColor: warningColor[0],
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(warningColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb(blackColor) +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(warningColor[0]) +
        ",.2)",
      "&:hover": {
        backgroundColor: warningColor[0],
        boxShadow:
          "0 12px 20px -10px rgba(" +
          hexToRgb(warningColor[0]) +
          ",.28), 0 4px 20px 0 rgba(" +
          hexToRgb(blackColor) +
          ",.12), 0 7px 8px -5px rgba(" +
          hexToRgb(warningColor[0]) +
          ",.2)"
      }
    },
    red: {
      backgroundColor: dangerColor[0],
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(dangerColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb(blackColor) +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(dangerColor[0]) +
        ",.2)",
      "&:hover": {
        backgroundColor: dangerColor[0],
        boxShadow:
          "0 12px 20px -10px rgba(" +
          hexToRgb(dangerColor[0]) +
          ",.28), 0 4px 20px 0 rgba(" +
          hexToRgb(blackColor) +
          ",.12), 0 7px 8px -5px rgba(" +
          hexToRgb(dangerColor[0]) +
          ",.2)"
      }
    },
    sidebarWrapper: {
      position: "relative",
      height: "calc(100vh - 75px)",
      overflow: "auto",
      width: theme.typography.pxToRem(260),
      zIndex: 4,
      overflowScrolling: "touch"
    },
    activePro: {
      [theme.breakpoints.up("md")]: {
        position: "absolute",
        width: "100%",
        bottom: theme.typography.pxToRem(13)
      }
    }
  })
);
