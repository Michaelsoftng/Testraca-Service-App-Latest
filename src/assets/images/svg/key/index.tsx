import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function KeySvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(20) * size}
      height={scale(20) * size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M16.4916 12.4417C14.775 14.15 12.3166 14.675 10.1583 14L6.23331 17.9167C5.94998 18.2083 5.39165 18.3833 4.99165 18.325L3.17498 18.075C2.57498 17.9917 2.01665 17.425 1.92498 16.825L1.67498 15.0083C1.61665 14.6083 1.80831 14.05 2.08331 13.7667L5.99998 9.85C5.33331 7.68333 5.84998 5.225 7.56665 3.51666C10.025 1.05833 14.0166 1.05833 16.4833 3.51666C18.95 5.975 18.95 9.98333 16.4916 12.4417Z"
        stroke={props.color || '#8C93A3'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M5.74164 14.575L7.6583 16.4917"
        stroke={props.color || '#8C93A3'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M12.0833 9.16666C12.7737 9.16666 13.3333 8.60701 13.3333 7.91666C13.3333 7.2263 12.7737 6.66666 12.0833 6.66666C11.393 6.66666 10.8333 7.2263 10.8333 7.91666C10.8333 8.60701 11.393 9.16666 12.0833 9.16666Z"
        stroke={props.color || '#8C93A3'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
