import React, { useRef, useState } from "react";
import classNames from "classnames";
import {
  drawerWidth,
  transition
} from "assets/jss/material-dashboard-react.ts";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.tsx";
import Icon from "@material-ui/core/Icon";
import RootRef from "@material-ui/core/RootRef";
import { createStyles } from "@material-ui/core";
import { ScrollService } from "services/ScrollService";
import { useIsomorphicLayoutEffect } from "utils/isomorphicEffect";

const styles = (theme: any) => createStyles({
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    overflow: "auto",
    position: "relative",
    float: "right",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch",
    scrollBehavior: "smooth"
  },
  rtl: {
    float: "left"
  },
  toTop: {
    position: "fixed",
    bottom: "10px",
    opacity: .8
  },
  right: {
    right: "10px"
  },
  left: {
    left: "10px"
  }
});

const ScrollContainer = ({ classes, rtl, children }: any) => {

  const containerRef = useRef<null | HTMLElement>(null);
  const [showedTop, switchShowedTop] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const onscroll = (e: Event) => {
      if (containerRef.current!.scrollTop > 400 && !showedTop) {
        switchShowedTop(true);
      } else if (containerRef.current!.scrollTop <= 400 && showedTop) {
        switchShowedTop(false);
      }
      ScrollService.listener(containerRef.current!.scrollTop,
        containerRef.current!.scrollHeight - containerRef.current!.clientHeight);
    };
    containerRef.current!.addEventListener("scroll", onscroll, false);

    return () => {
      containerRef.current!.removeEventListener("scroll", onscroll, false);
    };

  });

  const toTop = () => {
    containerRef.current!.scrollTop = 0;
  };

  return (
    <RootRef rootRef={containerRef}>
      <div className={classNames(classes.mainPanel, { [classes.rtl]: rtl })}>
        {children}
        {
          showedTop && (
            <Button
              className={classNames(classes.toTop, { [classes.right]: !rtl, [classes.left]: rtl })}
              variant="contained"
              onClick={toTop}>
              <Icon>keyboard_arrow_up</Icon>
            </Button>
          )
        }
      </div>
    </RootRef>
  );
};

export default withStyles(styles)(ScrollContainer);
