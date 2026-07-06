import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function SadFaceSvg({size = 1, ...props}) {
  return (
    // <Svg
    //   width={scale(20) * size}
    //   height={scale(20) * size}
    //   viewBox="0 0 20 20"
    //   fill="none"
    //   {...props}>
    //   <Path
    //     d="M7.50002 18.3333H12.5C16.6667 18.3333 18.3334 16.6666 18.3334 12.5V7.49996C18.3334 3.33329 16.6667 1.66663 12.5 1.66663H7.50002C3.33335 1.66663 1.66669 3.33329 1.66669 7.49996V12.5C1.66669 16.6666 3.33335 18.3333 7.50002 18.3333Z"
    //     stroke={props.color || '#525C76'}
    //     stroke-width="1.5"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    //   <Path
    //     d="M7.49998 12.8167H11.6C13.0166 12.8167 14.1666 11.6667 14.1666 10.25C14.1666 8.83335 13.0166 7.68335 11.6 7.68335H5.95831"
    //     stroke={props.color || '#525C76'}
    //     stroke-width="1.5"
    //     stroke-miterlimit="10"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    //   <Path
    //     d="M7.14165 8.97497L5.83331 7.65831L7.14165 6.34998"
    //     stroke={props.color || '#525C76'}
    //     stroke-width="1.5"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    // </Svg>
    <Svg
      width={scale(20) * size}
      height={scale(20) * size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M7.5 18.3333H12.5C16.6667 18.3333 18.3333 16.6667 18.3333 12.5V7.49999C18.3333 3.33332 16.6667 1.66666 12.5 1.66666H7.5C3.33333 1.66666 1.66666 3.33332 1.66666 7.49999V12.5C1.66666 16.6667 3.33333 18.3333 7.5 18.3333Z"
        stroke={props.color || '#930F35'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M5.83334 7.29166C6.66667 6.45832 8.025 6.45832 8.86667 7.29166"
        stroke={props.color || '#930F35'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M11.1333 7.29166C11.9667 6.45832 13.325 6.45832 14.1667 7.29166"
        stroke={props.color || '#930F35'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M7 14.75H13C13.4167 14.75 13.75 14.4167 13.75 14C13.75 11.925 12.075 10.25 10 10.25C7.925 10.25 6.25 11.925 6.25 14C6.25 14.4167 6.58333 14.75 7 14.75Z"
        stroke={props.color || '#930F35'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
