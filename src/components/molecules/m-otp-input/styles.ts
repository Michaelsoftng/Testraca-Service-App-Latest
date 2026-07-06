import {StyleSheet} from 'react-native';
import {appColors} from '../../../lib/utils/scale';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    width: 45,
    height: 45,
    marginRight: 16,
    textAlign: 'center',
    paddingLeft: 0,
    borderRadius: 8,
    backgroundColor: appColors['gray-20'],
    borderColor: appColors['gray-20'],
    borderWidth: 1,
  },
});
