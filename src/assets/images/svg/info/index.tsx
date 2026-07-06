import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function InfoSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(20) * size}
      height={scale(20) * size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
        stroke={props.color || '#1B4ACB'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9.375 9.375H10V13.75H10.625"
        stroke={props.color || '#1B4ACB'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9.84375 7.34375C10.2752 7.34375 10.625 6.99397 10.625 6.5625C10.625 6.13103 10.2752 5.78125 9.84375 5.78125C9.41228 5.78125 9.0625 6.13103 9.0625 6.5625C9.0625 6.99397 9.41228 7.34375 9.84375 7.34375Z"
        fill={props.color || '#1B4ACB'}
      />
    </Svg>
  );
}
