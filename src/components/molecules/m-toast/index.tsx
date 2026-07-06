import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';

import {
  appColors,
  appFonts,
  scale,
  scaleVertical,
} from '../../../lib/utils/scale';
import IconGenerator from '../../atoms/a-icon-gen';
import {useToast} from '../../../lib/utils/functions';


const Toast = (props: {
  type: string | number;
  title:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
  message:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
}) => {
  const {hideToast} = useToast();

  useEffect(() => {
    // if (props.dismissable) {
    let timeout = setTimeout(() => {
      hideToast();
    }, 5000);
    return () => clearTimeout(timeout);
    // }
  }, []);

  return (
    <View
      // duration={500}
      style={[toastStyles.container, toastStyles[props.type]]}>
      <View
        style={{
          padding: scale(10),
        }}>
        {props.title ? (
          <View style={toastStyles.headerContainer}>
            <Text style={[toastStyles.text, toastStyles.title]}>
              {props.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                hideToast();
              }}
              style={{
                alignSelf: 'flex-end',
                paddingRight: scale(10),
                paddingLeft: scale(10),
              }}>
              <IconGenerator tagName="Cancel" color={appColors.white} />
            </TouchableOpacity>
          </View>
        ) : null}
        <Text style={[toastStyles.text]}>{props.message}</Text>
      </View>
    </View>
  );
};

export const toastStyles = StyleSheet.create({
  container: {
    marginTop: scaleVertical(40),
    backgroundColor: 'red',
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 99999,
    top: 0,
    alignSelf: 'center',
    width: '90%',
    minHeight: scale(50),
    borderRadius: scale(10),
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: {
      width: 0,
      height: scale(2),
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 2,
  },
  headerContainer: {
    flex: 1,
    width: scale(300),
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  leftLine: {
    backgroundColor: 'white',
    height: '100%',
    width: scale(10),
    borderBottomLeftRadius: scale(5),
    borderTopLeftRadius: scale(5),
    marginRight: scale(5),
  },
  text: {
    fontSize: scale(15),
    color: appColors.white,
    maxWidth: scale(300),
  },
  success: {
    backgroundColor: appColors.success,
  },
  title: {
    color: appColors.white,
    fontFamily: appFonts.boldText.fontFamily,
  },
  warn: {
    backgroundColor: appColors.warn,
  },
  error: {
    backgroundColor: appColors.error,
  },
  info: {
    backgroundColor: appColors.info,
  },
});

export default Toast;
