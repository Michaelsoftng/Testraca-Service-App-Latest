import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {appColors, appFonts, hp, wp} from '../../../lib/utils/scale';
import {useEffect, useRef} from 'react';
import {ROUTE_NAMES} from '../../../lib/constants';

function OnboardingComp({navigation}: any) {
  const bounceValue = useRef(new Animated.Value(0)).current;

  const bounceVal = {
    transform: [
      {
        scale: bounceValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1], // Adjust the values for the bouncing effect
        }),
      },
    ],
  };
  useEffect(() => {
    Animated.loop(
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 2,
        tension: 40,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        <Image
          style={styles.imageStyle}
          source={require('../../../assets/images/webp/Home.webp')}
        />
        <Image
          style={styles.imageStyleShadow}
          source={require('../../../assets/images/webp/shadow.webp')}
        />
        <Image
          style={styles.imageStyleBigCircle}
          source={require('../../../assets/images/png/bigCircle.png')}
        />
      </View>
      <View style={styles.textView}>
        <Text style={styles.textStyle}>Get a Lab test in minutes</Text>
      </View>

      <Pressable onPress={() => navigation.navigate(ROUTE_NAMES.SIGNIN)}>
        <Animated.View style={[styles.btnView, bounceVal]}>
          <Image
            style={styles.vectorImageStyle}
            source={require('../../../assets/images/png/Vector.png')}
          />
        </Animated.View>
      </Pressable>

      <Image
        style={styles.imageStyleSmallCircle}
        source={require('../../../assets/images/png/smallCircle.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: appColors.primaryGreen,
  },
  textView: {
    marginHorizontal: wp(10),
  },
  btnView: {
    backgroundColor: appColors.white,
    borderRadius: 50,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(23),
    height: wp(23),
    marginTop: wp(10),
  },

  imageStyle: {
    height: hp(52),
    width: wp(83),
    resizeMode: 'stretch',
  },
  vectorImageStyle: {
    height: hp(5),
    marginHorizontal: wp(2),
    borderRadius: 50,
    borderWidth: 1,
    width: wp(10.9),
    resizeMode: 'stretch',
  },
  textStyle: {
    color: appColors.white,
    fontSize: hp(4),
    fontFamily: appFonts.boldText.fontFamily,
    textAlign: 'center',
    marginTop: hp(5),
  },

  imageStyleShadow: {
    position: 'absolute',
    height: hp(52),
    width: wp(100),
    bottom: -hp(22),
    zIndex: -1,
    opacity: 0.9,
  },
  imageStyleBigCircle: {
    position: 'absolute',
    height: hp(72),
    width: wp(70),
    left: wp(50),
    top: hp(10),
    bottom: hp(0),
    zIndex: -1,
    opacity: 0.9,
    resizeMode: 'stretch',
  },
  imageStyleSmallCircle: {
    position: 'absolute',
    height: hp(22),
    width: wp(34),
    bottom: -hp(0),
    left: 0,
    zIndex: -1,
    opacity: 0.9,
    resizeMode: 'stretch',
  },
  imageView: {
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    height: hp(52),
  },
});

export default OnboardingComp;
