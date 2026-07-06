import {Controller} from 'react-hook-form';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {scale, wp} from '../../../lib/utils/scale';
import MailSvg from '../../../assets/images/svg/mail';
import {useState} from 'react';

interface CustomInputProps {
  control: any;
  name: string;
  rules?: any;
  styles?: any;
  textAlignVertical?: 'top' | 'center' | 'bottom' | 'auto';
  placeholder: string;
  secureTextEntry?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  SvgComponent?: React.FC<any>;
}

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  styles,
  secureTextEntry,
  maxLength,
  multiline = false,
  numberOfLines,
  textAlignVertical = 'center',
  SvgComponent,
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View
            style={[
              style.inputContainer,
              {
                borderColor: isFocused ? '#059669' : error ? 'red' : '#e8e8e8',
                shadowColor: isFocused ? '#059669' : error ? 'red' : '#e8e8e8',
              },
            ]}>
            {SvgComponent && <SvgComponent />}
            <TextInput
              value={value}
              style={styles}
              textAlignVertical={textAlignVertical}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setIsFocused(false);
              }}
              onFocus={() => setIsFocused(true)}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              maxLength={maxLength}
              multiline={multiline}
              numberOfLines={numberOfLines}
              autoCapitalize="none"
            />
          </View>
          {error && (
            <Text style={style.errorText}>{error.message || 'Error'}</Text>
          )}
        </>
      )}
    />
  );
};

const style = StyleSheet.create({
  inputContainer: {
    overflow: 'hidden',
    paddingHorizontal: wp(1.8),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    // borderTopWidth: 1,
    // borderStartWidth: 3,
    // borderEndWidth: 1,

    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },

  errorText: {
    color: 'red',
    alignSelf: 'stretch',
    position: 'absolute',
    fontSize: scale(9),
    bottom: scale(-12),
  },
});
export default CustomInput;
