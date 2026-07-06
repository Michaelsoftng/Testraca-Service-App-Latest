import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function ClockSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(16) * size}
      height={scale(17) * size}
      viewBox="0 0 16 17"
      fill="none"
      {...props}>
      <Path
        d="M8 5.83331V9.16665"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M7.99996 15.1667C4.77996 15.1667 2.16663 12.5533 2.16663 9.33333C2.16663 6.11333 4.77996 3.5 7.99996 3.5C11.22 3.5 13.8333 6.11333 13.8333 9.33333"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M6 1.83331H10"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9.93335 12.8333V12.06C9.93335 11.1066 10.6133 10.7133 11.44 11.1933L12.1067 11.58L12.7733 11.9666C13.6 12.4466 13.6 13.2266 12.7733 13.7066L12.1067 14.0933L11.44 14.48C10.6133 14.96 9.93335 14.5666 9.93335 13.6133V12.8333Z"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
