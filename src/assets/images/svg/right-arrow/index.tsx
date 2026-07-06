import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function RightArrowSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(25) * size}
      height={scale(25) * size}
      viewBox="0 0 25 25"
      fill="none"
      {...props}>
      <Path
        d="M9.40997 20.4201L15.93 13.9001C16.7 13.1301 16.7 11.8701 15.93 11.1001L9.40997 4.58008"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
