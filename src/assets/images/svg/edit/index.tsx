import * as React from 'react';
import Svg, {G, Path, Rect} from 'react-native-svg';
import {scale} from '../../../../lib/utils/scale';

export default function EditSvg({size = 1, ...props}) {
  return (
    <Svg
      width={scale(32) * size}
      height={scale(32) * size}
      viewBox="0 0 32 32"
      fill="none"
      {...props}>
      <G opacity="0.3">
        <Rect
          width={scale(32) * size}
          height={scale(32) * size}
          rx="3"
          fill="#E2E4E8"
        />
        <Path
          d="M17.05 9.00002L10.2083 16.2417C9.94996 16.5167 9.69996 17.0584 9.64996 17.4334L9.34162 20.1334C9.23329 21.1084 9.93329 21.775 10.9 21.6084L13.5833 21.15C13.9583 21.0834 14.4833 20.8084 14.7416 20.525L21.5833 13.2834C22.7666 12.0334 23.3 10.6084 21.4583 8.86668C19.625 7.14168 18.2333 7.75002 17.05 9.00002Z"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M15.9082 10.2083C16.2665 12.5083 18.1332 14.2666 20.4499 14.5"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M8.5 24.3333H23.5"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </G>
    </Svg>
  );
}
