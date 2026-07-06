import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Button, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

export default function BottomSheets() {
  const bottomSheetRef = React.useRef(null);

  
  const snapPoints = ['25%', '50%', '100%'];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button title="Open Bottom Sheet" onPress={() => bottomSheetRef.current.expand()} />

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          initialSnapIndex={1} 
        >
          <View style={styles.sheetContent}>
            <Text style={styles.sheetText}>This is a Bottom Sheet</Text>
            <Button title="Close" onPress={() => bottomSheetRef.current.close()} />
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetText: {
    fontSize: 18,
  },
});


























































































































































































































































































































    













      





























