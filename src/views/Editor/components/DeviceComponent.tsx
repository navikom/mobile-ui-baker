import React from 'react';
import { Mode } from 'enums/ModeEnum';
import { DeviceEnum } from 'enums/DeviceEnum';

import { IBackgroundColor } from 'interfaces/IProject';
import DeviceComponentOld from './DeviceComponentOld';
import DeviceComponentNew from './DeviceComponentNew';

export interface DeviceComponentProps {
  ios?: boolean;
  mode: Mode;
  statusBarEnabled: boolean;
  statusBarColor: string;
  background: IBackgroundColor;
  portrait: boolean;
  device?: DeviceEnum;
  scale?: number;
}

const DeviceComponent: React.FC<DeviceComponentProps> = ({ children, device, ...rest }) => {
  const old = device && [DeviceEnum.IPHONE_6, DeviceEnum.PIXEL_5].includes(device);
  const Component = old ? DeviceComponentOld : DeviceComponentNew;
  return (
    <React.Fragment>
      <Component {...rest}>{children}</Component>
    </React.Fragment>
  );
};

export default DeviceComponent;
