import React from "react";
import { Mode } from "views/Editor/store/EditorViewStore";
import { whiteColor } from "assets/jss/material-dashboard-react";

interface AndroidInnerProps {
  mode: Mode;
  background: string;
  statusBarColor: string;
  style: React.CSSProperties;
  width?: number;
}

const AndroidPixelInner: React.FC<AndroidInnerProps> = (
  {mode, background, statusBarColor, style, width = 274}) => {
  const fill = mode === Mode.WHITE ? "#030303" : whiteColor;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height="21" viewBox={`0 0 ${width} 21`} version="1.1" style={style}>
      <g id="Status_bar" transform="translate(0.745146, 0.000000)">
        <polygon id="bg" fill={statusBarColor} points={`${width} 0 ${width} 18.6331367 -2.84217094e-14 18.6331367 -2.84217094e-14 0`}/>
        <g transform={`translate(${width - 275}, 0.000000)`}>
          <path d="M181.442975,4.84461553 C178.685936,4.84461553 176.375984,7.08059193 176.375984,9.83829616 C176.375984,12.5960004 178.685936,14.8319768 181.442975,14.8319768 C184.274528,14.8319768 186.509965,12.5960004 186.509965,9.83829616 C186.509965,7.08059193 184.274528,4.84461553 181.442975,4.84461553 L181.442975,4.84461553 Z M181.442975,13.639456 C179.356567,13.639456 177.642732,11.99974 177.642732,9.91282871 C177.642732,7.8259174 179.356567,6.18620137 181.442975,6.18620137 C183.529383,6.18620137 185.243218,7.8259174 185.243218,9.91282871 C185.243218,11.9252075 183.529383,13.639456 181.442975,13.639456 Z M181.815548,6.33526647 L180.772344,6.33526647 L180.5488,9.83829616 L180.5488,9.91282871 L180.623314,10.360024 L183.305839,12.7450655 L184.050985,11.99974 L181.890062,9.68923107 L181.815548,6.33526647 Z M186.435451,7.90044995 L186.509965,8.12404759 L187.776713,7.67685231 L187.702198,7.45325467 C187.031567,5.88807119 185.839334,4.54648535 184.200014,3.87569243 L183.97647,3.72662733 L183.529383,4.99368063 L183.752926,5.06821317 C184.945159,5.66447355 185.913849,6.63339665 186.435451,7.90044995 Z M179.207538,5.06821317 L179.431081,4.99368063 L178.983994,3.72662733 L178.76045,3.87569243 C177.195644,4.62101789 175.854382,5.96260373 175.258266,7.52778721 L175.183751,7.75138485 L176.450499,8.19858013 L176.525013,7.97498249 C176.972101,6.7079292 177.94079,5.66447355 179.207538,5.06821317 Z" id="clock_icon" fill={fill}/>
          <polygon id="signal" fill={fill} points="217.582541 3.72662733 217.582541 14.9065093 205.66021 14.9065093"/>
          <path d="M191.523974,6.25916756 L198.581326,14.9065093 L205.638677,6.25916756 C205.638677,6.25916756 199.110627,0.523685775 191.523974,6.25916756 L191.523974,6.25916756 Z" id="wifi_ico" fill={fill}/>
          <g id="battery_icon" transform={`translate(223.543706, 3.726627)`} fill={fill}>
            <path d="M4.9924761,1.1179882 L4.9924761,0 L1.93737879,0 L1.93737879,1.1179882 L0.223543706,1.1179882 L0.223543706,11.179882 L6.63179661,11.179882 L6.63179661,1.1179882 L4.9924761,1.1179882 L4.9924761,1.1179882 Z M2.3844662,9.98736126 L3.12961188,6.85699429 L1.78834965,6.85699429 L2.75703904,2.90676932 L5.29053438,2.90676932 L4.32184498,5.589941 L5.81213636,5.589941 L2.3844662,9.98736126 L2.3844662,9.98736126 Z" id="Shape" opacity="0.5"/>
            <polygon id="Shape" points="6.70631118 6.26073392 6.70631118 11.179882 0.223543706 11.179882 0.223543706 6.26073392 1.86286422 6.26073392 1.78834965 6.85699429 3.12961188 6.85699429 2.3844662 9.98736126 5.21601981 6.26073392"/>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default AndroidPixelInner;