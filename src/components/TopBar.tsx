import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography } from '../theme';

export function TopBar({titleData=''}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titleData}</Text>
      {/* <View style={styles.toggle}>
        <Pressable style={[styles.tab, styles.tabActive]}> 
          <Text style={[styles.tabText, {color: '#fff'}]}>Pending</Text>
        </Pressable>
        <Pressable style={[styles.tab, styles.tabInactive]}> 
          <Text style={[styles.tabText, {color: colors.subtext}]}>Completed</Text>
        </Pressable>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#EEF0F3',
    borderRadius: 12,
    padding: 4,
    alignSelf: 'flex-start'
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontWeight: '700',
  }
});
