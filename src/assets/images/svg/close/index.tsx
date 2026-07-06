import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function CloseSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(24) * size}
      height={scale(24) * size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M9.16992 14.83L14.8299 9.16998"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M14.8299 14.83L9.16992 9.16998"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
