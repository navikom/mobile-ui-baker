import React from "react";
import { whiteColor } from "assets/jss/material-dashboard-react";
import { Mode } from "enums/ModeEnum";

interface AndroidInnerProps {
  mode: Mode;
  background: string;
  statusBarColor: string;
  style: React.CSSProperties;
  width: number;
}

const AndroidPixelNavBar: React.FC<AndroidInnerProps> = (
  {mode, background, statusBarColor, style, width}) => {
  const fill = mode === Mode.WHITE ? "#030303" : whiteColor;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height="35" viewBox={`0 0 ${width} 35`} version="1.1" style={style}>
      <g id="nav_bar" transform={`translate(0.745146, 0.0)`}>
        <polygon id="nav_bckgr" fill={statusBarColor} points={`${width} 0 ${width} 35.7756224 -2.84217094e-14 35.7756224 -2.84217094e-14 0`}/>
        <g transform={`translate(${width / 2 - (width - 90) / 2}, 0.000000)`}>
          <path d="M214.005841,23.8504149 L203.350258,23.8504149 C202.977685,23.8504149 202.754141,23.5522848 202.754141,23.2541546 L202.754141,12.5960004 C202.754141,12.2233377 203.0522,11.99974 203.350258,11.99974 L214.005841,11.99974 C214.378414,11.99974 214.601958,12.2978702 214.601958,12.5960004 L214.601958,23.2541546 C214.601958,23.5522848 214.303899,23.8504149 214.005841,23.8504149 L214.005841,23.8504149 Z M203.946374,22.5833616 L213.33521,22.5833616 L213.33521,13.1922608 L203.946374,13.1922608 L203.946374,22.5833616 L203.946374,22.5833616 Z" id="Shape" fill={fill}/>
          <path d="M134.126224,24.5957404 C130.400495,24.5957404 127.419912,21.6144385 127.419912,17.8878112 C127.419912,14.1611839 130.400495,11.179882 134.126224,11.179882 C137.851952,11.179882 140.832535,14.1611839 140.832535,17.8878112 C140.832535,21.6144385 137.851952,24.5957404 134.126224,24.5957404 L134.126224,24.5957404 Z M134.126224,12.4469353 C131.145641,12.4469353 128.68666,14.9065093 128.68666,17.8878112 C128.68666,20.8691131 131.145641,23.3286871 134.126224,23.3286871 C137.106806,23.3286871 139.565787,20.8691131 139.565787,17.8878112 C139.565787,14.9065093 137.106806,12.4469353 134.126224,12.4469353 L134.126224,12.4469353 Z" id="Shape" fill={fill}/>
          <path d="M65.5728204,11.0308169 L65.5728204,23.99948 C65.5728204,24.2230777 65.4983059,24.3721428 65.2747622,24.5212079 C65.125733,24.5957404 64.9021893,24.5957404 64.7531602,24.5212079 L53.8740331,18.0368763 C53.5759749,17.8132787 53.5759749,17.2915508 53.8740331,17.0679532 L64.7531602,10.5836216 C64.9021893,10.5090891 65.125733,10.5090891 65.2747622,10.5836216 C65.4983059,10.5836216 65.5728204,10.8072193 65.5728204,11.0308169 L65.5728204,11.0308169 Z M64.5296165,23.0305569 L64.5296165,11.99974 L55.28981,17.5151485 L64.5296165,23.0305569 L64.5296165,23.0305569 Z" id="Shape" fill={fill}/>
        </g>
      </g>
    </svg>
  );
};

export default AndroidPixelNavBar;
