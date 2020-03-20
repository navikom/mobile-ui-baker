import React, {ReactNode} from "react";
import PropTypes from "prop-types";

// @material-ui/core
import {createStyles, IconButton, InputAdornment, makeStyles, OutlinedInput, Theme} from "@material-ui/core";
import Popper from "@material-ui/core/Popper";

// @material-ui/icons
import {ArrowDropDown} from "@material-ui/icons";

// components
import {ThemedInput} from "components/CustomInput/BootstrapInput";

import useStyles from "assets/jss/material-dashboard-react/responsiveTypeStyles";
import {blackOpacity} from "assets/jss/material-dashboard-react";
import classNames from "classnames";

const extraStyles = makeStyles((theme: Theme) =>
  createStyles({
   popper: {
    width: theme.typography.pxToRem(50),
    backgroundColor: theme.palette.background.paper,
    border: "1px solid " + blackOpacity(.15),
    zIndex: 4
   },
   container: {
    padding: "18px 0"
   },
   wrapper: {
    position: "absolute",
    height: "100%"
   },
   right: {
    transform: "translateX(-100%)",
    borderLeft: "1px solid " + blackOpacity(.15)
   },
   left: {
    borderRight: "1px solid " + blackOpacity(.15)
   },
   button: {
    padding: theme.typography.pxToRem(7)
   }
  }));

const Adornment = ({...props}) => {
 const {component, ...rest} = props;
 const classes = extraStyles();
 return (
   <IconButton
     className={classes.button}
     {...rest}
   >
    {component}
   </IconButton>
 );
};

const InputWithIcon = ({...props}) => {
 const classes = useStyles();
 const extraClasses = extraStyles();
 const adornmentEl = React.useRef<HTMLDivElement>(null);
 const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
 const [adornments, setAdornments] = React.useState<{component: ReactNode; onClick: () => void}[]>([]);
 const [adornmentWidth, setAdornmentWidth] = React.useState(0);
 const {
  startAdornment,
  startAdornments,
  endAdornment,
  endAdornments,
  startAdornmentClick,
  endAdornmentClick,
  cursorChange,
  ...rest
 } = props;

 const input = props.input || {};

 React.useEffect(() => {
  setAdornmentWidth(adornmentEl.current!.offsetWidth);
 }, []);

 const handlePopperOpen = (list: {component: ReactNode; onClick: () => void}[]) => (event: React.MouseEvent<HTMLElement>) => {
  setAdornments(list);
  setAnchorEl(event.currentTarget === anchorEl ? null : event.currentTarget);
 };

 const isPopperOpen = Boolean(anchorEl);

 const popperClose = () => {
  setAnchorEl(null);
 };

 const container = classNames({
  [extraClasses.container]: props.multiline !== undefined
 });

 if (input.onClick === undefined && input.onKeyUp === undefined) {
  input.onKeyUp = (e: React.BaseSyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => cursorChange && cursorChange(e.target.selectionStart);
  input.onClick = (e: React.BaseSyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => cursorChange && cursorChange(e.target.selectionStart);
 }

 if(startAdornments) {
  input.inputProps = {style: {paddingLeft: `${adornmentWidth}px`}}
 }

 if(endAdornments) {
  input.inputProps = {style: {paddingRight: `${adornmentWidth}px`}}
 }

 return (
   <React.Fragment>
    <OutlinedInput
      className={container}
      {...rest}
      {...input}
      labelWidth={0}
      startAdornment={startAdornment ?
        <InputAdornment position="start">
         <Adornment onClick={startAdornmentClick} component={startAdornment} />
        </InputAdornment>
        :
        startAdornments && (
          <InputAdornment position="start">
           <div className={classNames(extraClasses.wrapper, extraClasses.left)} ref={adornmentEl}>
            <div className={classes.sectionMobile}>
             <Adornment onClick={handlePopperOpen(startAdornments)} component={<ArrowDropDown />} />
            </div>
            <div className={classes.sectionDesktop}>
             {startAdornments.map((prop: any, i: number) => <Adornment {...prop} key={i} />)}
            </div>
           </div>
          </InputAdornment>
        )
      }
      endAdornment={endAdornment ?
        <InputAdornment position="end">
         <Adornment onClick={endAdornmentClick} component={endAdornment} />
        </InputAdornment>
        :
        endAdornments && (
          <InputAdornment position="end">
           <div className={classNames(extraClasses.wrapper, extraClasses.right)} ref={adornmentEl}>
            <div className={classes.sectionMobile}>
             <Adornment onClick={handlePopperOpen(endAdornments)} component={<ArrowDropDown />} />
            </div>
            <div className={classes.sectionDesktop}>
             {endAdornments.map((prop: any, i: number) => <Adornment {...prop} key={i} />)}
            </div>
           </div>
          </InputAdornment>
        )
      }
    />
    <Popper
      className={extraClasses.popper}
      open={isPopperOpen}
      anchorEl={anchorEl}
      placement="bottom-end"
      transition>
     {adornments && adornments.map((prop: any, i: number) =>
       <Adornment key={i} {...prop} onClick={() => {
        popperClose();
        prop.onClick(anchorEl);
       }} />)}
    </Popper>
   </React.Fragment>
 );
};

InputWithIcon.propTypes = {
 classes: PropTypes.object.isRequired,
 input: PropTypes.object,
 endAdornments: PropTypes.array,
 endAdornment: PropTypes.node,
 startAdornments: PropTypes.array,
 startAdornment: PropTypes.node,
 startAdornmentClick: PropTypes.func,
 endAdornmentClick: PropTypes.func,
 divider: PropTypes.object,
 cursorChange: PropTypes.func
};

export default ThemedInput(InputWithIcon);
