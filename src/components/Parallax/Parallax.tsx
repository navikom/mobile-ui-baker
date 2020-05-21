import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set property for components
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import styles from "assets/jss/material-kit-react/components/parallaxStyle";

const useStyles = makeStyles(styles);

interface ParallaxProps {
  className?: string;
  filter?: boolean;
  style?: React.CSSProperties;
  image?: string;
  small?: boolean;
}

const Parallax: React.FC<ParallaxProps> = (
  { filter,
    className,
    children,
    style,
    image,
    small }
) => {
  let windowScrollTop;
  if (window.innerWidth >= 768) {
    windowScrollTop = window.pageYOffset / 3;
  } else {
    windowScrollTop = 0;
  }
  const [transform, setTransform] = React.useState(
    "translate3d(0," + windowScrollTop + "px,0)"
  );
  React.useEffect(() => {
    const resetTransform = () => {
      const windowScrollTop = window.pageYOffset / 3;
      setTransform("translate3d(0," + windowScrollTop + "px,0)");
    };
    if (window.innerWidth >= 768) {
      window.addEventListener("scroll", resetTransform);
    }
    return function cleanup() {
      if (window.innerWidth >= 768) {
        window.removeEventListener("scroll", resetTransform);
      }
    };
  });

  const classes = useStyles();
  const parallaxClasses = classNames({
    [classes.parallax]: true,
    [classes.filter]: filter,
    [classes.small]: small,
    [className as string]: className !== undefined
  });
  return (
    <div
      className={parallaxClasses}
      style={{
        ...style,
        backgroundImage: "url(" + image + ")",
        transform: transform
      }}
    >
      {children}
    </div>
  );
};

export default Parallax;
