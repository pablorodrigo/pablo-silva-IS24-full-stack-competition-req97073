/**
 * Created by Pablo Silva
 * Date: 2023/03/27
 * Time: 10:34 PM
 */

import React from 'react';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

interface IProps {
  src: string;
  height: string;
  width: string;
}

export default function MyLottieAnimation({ src, height, width }: IProps) {
  return (
    <div className='flex justify-content-center align-items-center mb-5'>
      <Player autoplay speed={3} loop src={src} style={{ height: height, width: width }}>
        <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
      </Player>
    </div>
  );
}
