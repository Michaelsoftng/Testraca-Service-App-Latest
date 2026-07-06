import React, { useEffect, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

import AlertStyle from '../../../assets/styles/AlertStyle';
import { wp } from '../../../lib/utils/scale';
import { useAlert } from '../../../lib/utils/functions';

type AlertAction = {
  text: string;
  action?: () => void;
  color?: string;
  style?: object;
};

interface AlertProps {
  type: 'success' | 'warning' | 'error';
  message?: string;
  singleOption?: AlertAction;
  acceptOption?: AlertAction;
  declineOption?: AlertAction;
  children?: React.ReactNode;
  dismissable?: boolean;
}

const Alert = ({
  type,
  message,
  children,
  singleOption,
  acceptOption,
  declineOption,
  dismissable = true,
}: AlertProps) => {
  const { hideAlert } = useAlert();

  const closeAlert = () => {
    hideAlert();
  };

  const options = useMemo(() => {
    if (singleOption) {
      return [singleOption];
    }

    return [acceptOption, declineOption].filter(Boolean) as AlertAction[];
  }, [singleOption, acceptOption, declineOption]);

  const onActionPress = (option?: AlertAction) => {
    if (option?.action) {
      option.action();
    }
    closeAlert();
  };

  useEffect(() => {
    if (type !== 'success') {
      return;
    }

    const timeout = setTimeout(() => {
      closeAlert();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [type]);

  return (
    <Modal
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackButtonPress={dismissable ? closeAlert : undefined}
      onBackdropPress={dismissable ? closeAlert : undefined}
      isVisible
      backdropOpacity={0.85}
      statusBarTranslucent
      backdropTransitionOutTiming={0}
      swipeDirection={dismissable ? ['down'] : []}
      hideModalContentWhileAnimating={false}
      animationInTiming={600}
      animationOutTiming={600}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <View style={AlertStyle.container}>
        <View style={AlertStyle.messageContainer}>
          {type === 'success' ? (
            <View style={{ alignItems: 'center', paddingVertical: wp(12) }}>
              {!!message && <Text style={AlertStyle.boldMessage}>{message}</Text>}
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: wp(12) }}>
              {!!message && <Text style={AlertStyle.boldMessage}>{message}</Text>}
              {children}
            </View>
          )}

          {!!options.length && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: wp(3) }}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.text}
                  onPress={() => onActionPress(option)}
                  style={option.style}
                >
                  <Text style={{ color: option.color || '#0F1D40', fontWeight: '600' }}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default Alert;
