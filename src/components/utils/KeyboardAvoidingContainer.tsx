import { SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from "./styles";

const { height: deviceHeight } = Dimensions.get('window');
const KeyboardAvoidingContainer = ({children, style})=>{
    const insets = useSafeAreaInsets();
    return <SafeAreaView style={[styles.keyboardAvoidingContainerStyle, { flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                >
        <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
            styles.keyboardAvoidingContainerStyleContent,
            style
        ]}
        >
             <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {children}
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>;
};

export default KeyboardAvoidingContainer;