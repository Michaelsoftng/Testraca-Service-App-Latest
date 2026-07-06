import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function NavSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(24) * size}
      height={scale(24) * size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M19.29 9.1698L7.7 3.0698C4.95 1.6198 1.96 4.5498 3.35 7.3298L4.97 10.5698C5.42 11.4698 5.42 12.5298 4.97 13.4298L3.35 16.6698C1.96 19.4498 4.95 22.3698 7.7 20.9298L19.29 14.8298C21.57 13.6298 21.57 10.3698 19.29 9.1698Z"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
