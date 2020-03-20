import {
  defaultFont,
  whiteColor,
  primaryColor
} from "assets/jss/material-dashboard-react";

import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    search: {
      "& > div": {
        marginTop: 0
      },
      [theme.breakpoints.down("sm")]: {
        margin: "10px 15px",
        float: "none",
        paddingTop: theme.typography.pxToRem(1),
        paddingBottom: theme.typography.pxToRem(1),
        padding: "0!important",
        width: "60%",
        marginTop: theme.typography.pxToRem(40),
        "& input": {
          color: whiteColor
        }
      }
    },
    linkText: {
      zIndex: 4,
      ...defaultFont,
      fontSize: theme.typography.pxToRem(14),
      marginLeft: theme.typography.pxToRem(20)
    },
    buttonLink: {
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        margin: "10px 15px 0",
        width: "-webkit-fill-available",
        "& svg": {
          width: theme.typography.pxToRem(24),
          height: theme.typography.pxToRem(30),
          marginRight: theme.typography.pxToRem(15),
          marginLeft: theme.typography.pxToRem(-15)
        },
        "& .fab,& .fas,& .far,& .fal,& .material-icons": {
          fontSize: theme.typography.pxToRem(24),
          lineHeight: theme.typography.pxToRem(30),
          width: theme.typography.pxToRem(24),
          height: theme.typography.pxToRem(30),
          marginRight: theme.typography.pxToRem(15),
          marginLeft: theme.typography.pxToRem(-15)
        },
        "& > span": {
          justifyContent: "flex-start",
          width: "100%"
        }
      }
    },
    searchButton: {
      [theme.breakpoints.down("sm")]: {
        top: "-50px !important",
        marginRight: theme.typography.pxToRem(22),
        float: "right"
      }
    },
    margin: {
      zIndex: 4,
      margin: "0"
    },
    searchIcon: {
      width: "17px",
      zIndex: 4
    },
    notifications: {
      zIndex: 4,
      [theme.breakpoints.up("md")]: {
        position: "absolute",
        top: theme.typography.pxToRem(2),
        border: "1px solid " + whiteColor,
        right: theme.typography.pxToRem(4),
        fontSize: theme.typography.pxToRem(9),
        background: primaryColor[0],
        color: whiteColor,
        minWidth: theme.typography.pxToRem(16),
        height: theme.typography.pxToRem(16),
        borderRadius: theme.typography.pxToRem(10),
        textAlign: "center",
        lineHeight: theme.typography.pxToRem(16),
        verticalAlign: "middle",
        display: "block"
      },
      [theme.breakpoints.down("sm")]: {
        ...defaultFont,
        fontSize: theme.typography.pxToRem(14),
        marginRight: theme.typography.pxToRem(8)
      }
    },
    whiteFont: {
      color: "rgba(255,255,255,.8)"
    },
    manager: {
      [theme.breakpoints.down("sm")]: {
        width: "100%"
      },
      display: "inline-block"
    },
    searchWrapper: {
      [theme.breakpoints.down("sm")]: {
        width: "-webkit-fill-available",
        margin: "10px 15px 0"
      },
      display: "inline-block"
    }
  })
);
