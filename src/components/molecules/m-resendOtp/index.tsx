import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import {useCountdown} from '../../../lib/hooks/count-down';
import {addToCurrentTime} from '../../../lib/utils/functions';
import {appColors} from '../../../lib/utils/scale';

interface Props {
  resendOTP(): void;
}

const OTPResendCountDown = ({resendOTP}: Props) => {
  const [countdownTime, setCountdownTime] = useState<Date>(new Date());
  const [seconds] = useCountdown(countdownTime);

  const resetCountdown = (): void => {
    const oneMinute = 1000 * 60;
    const newTime = addToCurrentTime(oneMinute);
    setCountdownTime(newTime);
  };

  useEffect(() => {
    resetCountdown();
  }, []);

  const resend = () => {
    resendOTP();
    resetCountdown();
  };

  return seconds && seconds > 0 ? (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        // alignItems:'center',
        backgroundColor: appColors.background,
        height: 40,
        paddingHorizontal: 10,
        marginTop: 24,
        borderRadius: 8,
      }}>
      <Text style={{color: appColors['black-50']}}>
        I didn`t receive a code (0:
        {seconds.toString().length > 1
          ? seconds.toString()
          : `0${seconds.toString()}`}
        )
      </Text>
    </View>
  ) : (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: appColors.background,
        paddingHorizontal: 10,
        height: 40,
        marginTop: 24,
        borderRadius: 8,
      }}>
      <Text>
        I didn`t receive a code.{' '}
        <Text style={{color: appColors.primaryGreen}} onPress={() => resend()}>
          Resend code
        </Text>
      </Text>
    </View>
  );
};

export default OTPResendCountDown;
