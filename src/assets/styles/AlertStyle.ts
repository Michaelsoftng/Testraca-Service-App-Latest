import {StyleSheet} from 'react-native';
import {appColors, appFonts, scale, scaleVertical} from '../../lib/utils/scale';

export default StyleSheet.create({
  container: {
    minWidth: scale(250),
    backgroundColor: '#10B981',
    alignItems: 'center',
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
  },
  messageContainer: {
    justifyContent: 'center',
    minHeight: scaleVertical(80),
  },
  message: {
    textAlign: 'center',
    paddingVertical: scale(10),
    fontSize: scale(14),
    color: appColors.primaryGreen,
  },
  boldMessage: {
    textAlign: 'center',
    paddingVertical: scale(10),
    fontSize: scale(14),
    fontWeight: 'bold',
    color: '#fff',
  },
  error: {
    color: appColors.error,
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
    borderTopWidth: 2,
    borderStyle: 'solid',
  },
  leftButton: {
    flex: 1,
    paddingTop: scale(20),
    paddingBottom: scale(20),
    justifyContent: 'center',
    borderRightColor: 'rgba(0, 0, 0, 0.12)',
    borderRightWidth: 2,
    borderStyle: 'solid',
  },
  acceptText: {
    fontSize: scale(14),
    textAlign: 'center',
    color: appColors.success,
  },
  declineText: {
    fontSize: scale(14),
    textAlign: 'center',
    color: appColors.error,
  },
  rightButton: {
    flex: 1,
    fontSize: scale(14),
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: appColors.primaryGreen,
    fontFamily: appFonts.boldText.fontFamily,
    fontSize: scale(14),
  },
});
