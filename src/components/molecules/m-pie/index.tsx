import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import PieChart from "react-native-pie-chart";
import { appFonts, hp } from "../../../lib/utils/scale";

interface TestChartProps {}

interface TestChartState {}

export default class TestChart extends Component<TestChartProps, TestChartState> {
  render() {
    const widthAndHeight = 175;
    const series = [120, 80];
    const sliceColor = [ "#2561ED" ,"#FF9783"]; 

    return (
      <ScrollView>
        <View style={styles.container}>
            <View>

          <PieChart widthAndHeight={widthAndHeight} series={series} sliceColor={sliceColor} />
            </View>
          <View style={styles.labelContainer}>
            <View style={styles.boxDisplay}>
            <View style={[styles.box, { backgroundColor: sliceColor[1] }]}></View>
            <View>
            <Text style={[styles.label]}>Cash payment</Text>
            <Text style={styles.labelPrice}>NGN 96,500</Text>  
            </View>
          
            </View>
            <View style={styles.boxDisplay}>
            <View style={[styles.box, { backgroundColor: sliceColor[0] }]}></View>
            <View>
            <Text style={[styles.label]}>Online payment</Text>
            <Text style={styles.labelPrice}>NGN 53,500</Text>  
            </View>
          
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#E2E4E8',
    padding: 20,
    gap: 10,
    backgroundColor: '#FAFAFB',
    borderRadius: 8,
  },
  labelContainer: {
 marginTop: 90,
 gap: 10,
  },
  label: {
    fontSize: hp(1.4),
    color: '#8C93A3'
  },
  labelPrice: {
    fontSize: hp(2.5),
    fontFamily: appFonts.semiBoldText.fontFamily,
  },
  box: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  boxDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
}
});
