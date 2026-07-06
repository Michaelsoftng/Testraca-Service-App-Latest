import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function PersonSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(20) * size}
      height={scale(20) * size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
        stroke={props.color || '#8C93A3'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M10 12.5C11.7259 12.5 13.125 11.1009 13.125 9.375C13.125 7.64911 11.7259 6.25 10 6.25C8.27411 6.25 6.875 7.64911 6.875 9.375C6.875 11.1009 8.27411 12.5 10 12.5Z"
        stroke={props.color || '#8C93A3'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M4.98413 15.5781C5.45437 14.6519 6.17191 13.874 7.05721 13.3306C7.94251 12.7872 8.96099 12.4995 9.99976 12.4995C11.0385 12.4995 12.057 12.7872 12.9423 13.3306C13.8276 13.874 14.5451 14.6519 15.0154 15.5781"
        stroke={props.color || '#8C93A3'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
