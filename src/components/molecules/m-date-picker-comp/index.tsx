import {Pressable, View, Text, StyleSheet} from 'react-native'; // Assuming you're using React Native
import UpArrSvg from '../../../assets/images/svg/up-arr';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {appColors, hp} from '../../../lib/utils/scale';

interface DatePickerCompProps {
  open: boolean;
  date: any;
  setOpen: any;
  setDate: any;
}

const DatePickerComp = ({
  date,
  open,
  setOpen,
  setDate,
}: DatePickerCompProps) => {
  return (
    <Pressable style={styles.container} onPress={() => setOpen(true)}>
      <View style={styles.iconContainer2}>
        <Text style={styles.dateText}>{dayjs(date).format('DD-MM-YYYY')}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Pressable onPress={() => setOpen(true)} style={styles.rightIcon}>
          <UpArrSvg />
        </Pressable>
      </View>
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => setOpen(false)}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: appColors['grayBorder'],
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#707070',
    fontFamily: 'MabryRegular', // Assuming MabryRegular is a custom font
    fontSize: hp(1.7),
    lineHeight: 19, // Adjust if needed based on font size
  },
  iconContainer2: {},
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 2,
  },
  leftIcon: {
    top: 4,
    left: 3,
  },
  rightIcon: {
    top: 20,
    right: 3,
  },
});

export default DatePickerComp;
