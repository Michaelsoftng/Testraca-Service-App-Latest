import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function MailSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(20) * size}
      height={scale(20) * size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M14.1667 17.0833H5.83335C3.33335 17.0833 1.66669 15.8333 1.66669 12.9167V7.08332C1.66669 4.16666 3.33335 2.91666 5.83335 2.91666H14.1667C16.6667 2.91666 18.3334 4.16666 18.3334 7.08332V12.9167C18.3334 15.8333 16.6667 17.0833 14.1667 17.0833Z"
        stroke={props.color || '#8C93A3'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M14.1666 7.5L11.5583 9.58333C10.7 10.2667 9.29164 10.2667 8.43331 9.58333L5.83331 7.5"
        stroke={props.color || '#8C93A3'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
