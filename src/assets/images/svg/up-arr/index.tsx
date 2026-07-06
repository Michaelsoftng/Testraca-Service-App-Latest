import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function UpArrSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(16) * size}
      height={scale(9) * size}
      viewBox="0 0 16 9"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15 1L8 8L1 1"
        stroke="#96959A"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
