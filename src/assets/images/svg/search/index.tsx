import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function SearchSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(20) * size}
      height={scale(20) * size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M9.0625 15.625C12.6869 15.625 15.625 12.6869 15.625 9.0625C15.625 5.43813 12.6869 2.5 9.0625 2.5C5.43813 2.5 2.5 5.43813 2.5 9.0625C2.5 12.6869 5.43813 15.625 9.0625 15.625Z"
        stroke={props.color || '#8C93A3'}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M13.7032 13.7031L17.5001 17.5"
        stroke={props.color || '#8C93A3'}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
