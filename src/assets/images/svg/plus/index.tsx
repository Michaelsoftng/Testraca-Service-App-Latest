import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function PlusSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(20) * size}
      height={scale(20) * size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M5 10H15"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M10 15V5"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
