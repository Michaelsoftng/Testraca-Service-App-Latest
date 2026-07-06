import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography } from '@/theme';

export function Header({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#fff',
  },
  title: {
    ...typography.h2,
  },
  right: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.xl,
  }
});
