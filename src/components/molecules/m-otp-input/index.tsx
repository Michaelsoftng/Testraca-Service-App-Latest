import React, {useEffect, createRef, useState, useRef} from 'react';
import type {FC} from 'react';
import {View, TextInput} from 'react-native';
import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
} from 'react-native';

import {styles} from './styles';
import {appColors} from '../../../lib/utils/scale';

interface Props {
  length?: number;
  loading?: boolean;
  value?: string[];
  emittedOTP(otp: string[]): void;
}

const OTPInput: FC<Props> = ({
  length = 6,
  emittedOTP,
  value,
  loading = false,
}) => {
  const [otps, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeOtpIndex, setActiveOtpindex] = useState<number>(0);
  const currentOTPIndex = useRef(0);

  const inputRef = createRef<TextInput>();

  const getOnlyLengthCharacters = (text = '') => text.substring(0, length);
  const handlePaste = (text: string) => {
    const formattedOTP = Array.from(
      {length},
      (_, k) => getOnlyLengthCharacters(text)[k] || '',
    );
    setActiveOtpindex(text.length);
    currentOTPIndex.current = text.length - 1;
    emittedOTP(formattedOTP);
    setOtp(formattedOTP);
  };

  const handleChange = ({
    nativeEvent: {text: value},
  }: NativeSyntheticEvent<TextInputChangeEventData>) => {
    if (value.length > 2) return handlePaste(value);
    const newOtp: string[] = [...otps];
    newOtp[currentOTPIndex.current] = value.substring(value.length - 1);

    if (!value) setActiveOtpindex(currentOTPIndex.current - 1);
    else {
      setActiveOtpindex(currentOTPIndex.current + 1);
      currentOTPIndex.current = currentOTPIndex.current + 1;
    }

    setOtp(newOtp);
    emittedOTP(newOtp);
  };

  const handleKeyDown = (
    {nativeEvent: {key}}: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    currentOTPIndex.current = index;
    if (key === 'Backspace') setActiveOtpindex(currentOTPIndex.current - 1);
  };

  useEffect(() => {
    if (value?.length) setOtp(value);
  }, [value]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <View style={styles.container}>
      {otps.map((_, index) => (
        <TextInput
          id={`otp${index}`}
          key={index}
          style={[
            styles.input,
            {
              borderColor:
                index === activeOtpIndex
                  ? appColors.primaryGreen
                  : 'transparent',
            },
          ]}
          autoComplete="off"
          ref={index === activeOtpIndex ? inputRef : null}
          value={otps[index]}
          keyboardType="numeric"
          maxLength={1}
          onChange={handleChange}
          onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
            handleKeyDown(e, index)
          }
          editable={!loading}
        />
      ))}
    </View>
  );
};

export default OTPInput;
