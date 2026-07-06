import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function ThunderSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(20) * size}
      height={scale(20) * size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}>
      <Path
        d="M5.07498 11.0667H7.64998V17.0667C7.64998 18.4667 8.40832 18.75 9.33332 17.7L15.6417 10.5333C16.4167 9.65835 16.0917 8.93335 14.9167 8.93335H12.3417V2.93335C12.3417 1.53335 11.5833 1.25002 10.6583 2.30002L4.34998 9.46668C3.58332 10.35 3.90832 11.0667 5.07498 11.0667Z"
        stroke={props.color || 'white'}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}
