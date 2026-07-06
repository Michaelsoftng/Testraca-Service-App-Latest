import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import OTPInput from '../../molecules/m-otp-input';
import OTPResendCountDown from '../../molecules/m-resendOtp';

interface Props {
  confirmPhoneNumber(code: string): void;
  sendOTP(): void;
  // phoneNumber: string;
  // loading: boolean;
}

const OTPForm = ({sendOTP, confirmPhoneNumber}: Props) => {
  const [value, setValue] = useState<string[]>([]);

  const resendOTP = (): void => {
    sendOTP();
  };

  const handleChange = (value$: string[]) => {
    setValue(value$);
  };

  useEffect(() => {
    confirmPhoneNumber(value.join(''));
  }, [value]);

  const handleResendOTP = () => {
    resendOTP();
  };

  return (
    <View style={{marginTop: 20}}>
      <View style={{marginTop: 16}}>
        <OTPInput
          emittedOTP={handleChange}
          loading={false}
          length={6}
          value={value}
        />
        <View style={{flexWrap: 'wrap'}}>
          <OTPResendCountDown resendOTP={handleResendOTP} />
        </View>
      </View>
    </View>
  );
};

export default OTPForm;
