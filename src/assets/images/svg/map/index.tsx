import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function MapSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(16) * size}
      height={scale(16) * size}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <Path
        d="M1.52661 5.18667V11.6733C1.52661 12.94 2.42661 13.46 3.51994 12.8333L5.08661 11.94C5.42661 11.7467 5.99328 11.7267 6.34661 11.9067L9.84661 13.66C10.1999 13.8333 10.7666 13.82 11.1066 13.6267L13.9933 11.9733C14.3599 11.76 14.6666 11.24 14.6666 10.8133V4.32667C14.6666 3.06 13.7666 2.54 12.6733 3.16667L11.1066 4.06C10.7666 4.25334 10.1999 4.27334 9.84661 4.09334L6.34661 2.34667C5.99328 2.17334 5.42661 2.18667 5.08661 2.38L2.19994 4.03334C1.82661 4.24667 1.52661 4.76667 1.52661 5.18667Z"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M5.70667 2.66669V11.3334"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M10.4867 4.41333V13.3333"
        stroke={props.color || '#292D32'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
