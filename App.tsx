import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "./global.css";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { registerBackgroundFCMHandler } from "./src/core/fcmNotifications";

// Keep the native splash up until Splashscreen.tsx mounts and takes over.
SplashScreen.preventAutoHideAsync().catch(() => {});
registerBackgroundFCMHandler();

// ─── Diagnostic: surface startup JS errors on screen ────────────────────────
// A production build aborts on an unhandled JS error before any message is
// visible. Capture the global handler's error so the boundary below can show
// it (and always hide the native splash so the screen is visible).
let __startupError: { message: string; stack: string } | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const EU: any = (global as any).ErrorUtils;
  if (EU?.setGlobalHandler) {
    const previous = EU.getGlobalHandler?.();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EU.setGlobalHandler((error: any, isFatal?: boolean) => {
      __startupError = {
        message: String(error?.message ?? error),
        stack: String(error?.stack ?? "").slice(0, 1500),
      };
      SplashScreen.hideAsync().catch(() => {});
      if (!isFatal && typeof previous === "function") {
        try { previous(error, isFatal); } catch { /* ignore */ }
      }
    });
  }
} catch { /* ignore */ }

class StartupErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch() {
    SplashScreen.hideAsync().catch(() => {});
  }
  render() {
    const err = this.state.error || __startupError;
    if (err) {
      return (
        <View style={styles.errorScreen}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.errorTitle}>Startup error (diagnostic build)</Text>
            <Text selectable style={styles.errorMessage}>
              {String((err as any).message)}
            </Text>
            <Text selectable style={styles.errorStack}>
              {String((err as any).stack ?? "")}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

import Splashscreen from "./src/screen/Splashscreen";
import Signup from "./src/screen/login/Signup";
import ForgetPassword from "./src/screen/login/ForgetPassword";
import Login from "./src/screen/login/Login";
import Menu from "./src/screen/cabinet/Menu";
import Verify from "./src/screen/login/Verify";
import VeiwOrder from "./src/screen/order/VeiwOrder.tsx";
import Subscribtion from "./src/screen/package/Subscribtion";
import BankCardPage from "./src/screen/my_profile/BankCardPage";
import EditProfile from "./src/screen/my_profile/EditProfile.tsx";
import ChangePassword from "./src/screen/my_profile/ChangePassword";
import RequestTestPage from "./src/screen/ward/RequestTest";
import SelectPaymentType from "./src/screen/ward/SelectPaymentType";
import FacilityPage from "./src/screen/ward/Facility";
import Pays from "./src/screen/ward/Pays";
import Successful from "./src/screen/ward/Successful";
import Failed from "./src/screen/ward/Failed";
import ListOfPriceConsutation from "./src/screen/ward/doctor/ListOfPriceConsutation";
import Summary from "./src/screen/ward/doctor/Summary";
import MapPage from "./src/screen/ward/map/MapPage";
import PatientDetails from "./src/screen/ward/PatientDetails";
import ConsultForm from "./src/screen/doctor/ConsultForm";
import RequestsPage from "./src/screen/ward/map/Requests";
import Activity from "./src/screen/ward/activity/Activity";
import Earning from "./src/screen/ward/earnings/Earning.tsx";
import RequestEarn from "./src/screen/ward/earnings/RequestEarn";
import WithdrawEarns from "./src/screen/ward/earnings/WithdrawEarns";
import UploadResult from "./src/screen/result/UploadResult";
import PaymentRecord from "./src/screen/account/PaymentRecord";
import RemitPayment from "./src/screen/account/RemitPayment";
import PaymentHistory from "./src/screen/account/PaymentHistory";
import TodoList from "./src/screen/account/TodoList";
import AddEditTodo from "./src/screen/account/AddEditTodo";
import TrackRequest from "./src/screen/order/TrackRequest";
import AuditScreen from "./src/screen/audit/AuditScreen";
import HistoryScreen from "./src/screen/audit/history";
import UpdateScreen from "./src/screen/audit/inventory";
import RequestScreen from "./src/screen/audit/request";
import AcceptedRequests from "./src/screen/ward/map/AcceptedRequests";
import DeliveryChoiceScreen from "./src/screen/ward/map/DeliveryChoiceScreen";
import DropOffScreen from "./src/screen/ward/map/DropOffScreen";
import HelpAndSupport from "./src/screen/my_profile/HelpAndSupport";
import PatientRequestScreen from "./src/screen/ward/map/PatientRequestScreen";
import StartConsultationScreen from "./src/screen/ward/map/consulations/StartConsulation";
import ChatScreen from "./src/screen/ward/map/consulations/ChatScreen";
import AppointmentsScreen from "./src/screen/ward/map/consulations/AppointmentsScreen";
import ConsultationHistoryScreen from "./src/screen/ward/map/consulations/ConsultationHistoryScreen";
import PrescriptionModal from "./src/screen/ward/map/(modals)/prescription";
import ReviewResult from "./src/screen/ward/map/consulations/ReviewResult";
import ReviewRequestScreen from "./src/screen/ward/map/ReviewRequestScreen";
import OnboardingScreen from "./src/screen/login/Onboarding.tsx";
import Dispatcher from "./src/screen/cabinet/Dispatcher";
import RequestDetailsScreen from "./src/screen/cabinet/RequestDetails";
import RiderLogisticsListScreen from "./src/(logistics)/list.tsx";
import DropOffLocationsScreen from "./src/screen/ward/map/logistics/DropOffLocationsScreen";
import SampleDeliveryScreen from "./src/screen/ward/map/logistics/SampleDeliveryScreen";
import LogisticsInTransitScreen from "./src/screen/ward/map/logistics/LogisticsInTransitScreen";
import DeliveryCompleteScreen from "./src/screen/ward/map/logistics/DeliveryCompleteScreen";
import PreferredRequestsScreen from "./src/screen/ward/map/PreferredRequests";
import PreferredConsultationsScreen from "./src/screen/ward/map/consultations/PreferredConsultations";
import NotificationInboxScreen from "./src/screen/notifications/NotificationInboxScreen";
import NotificationCenterBridge from "./src/components/organisms/o-notificationCenterBridge";
import { ApolloProvider } from "@apollo/client";
import client from "./src/schema/apolloClient";
import { persistor, store } from "./src/my-store/redux/store";

const Stack = createNativeStackNavigator();

const defaultHeaderOptions = {
  headerTitleAlign: "center" as const,
  headerShadowVisible: false,
  freezeOnBlur: false,
};

function FullScreenLoader() {
  return (
    <View style={styles.fullScreenLoader} pointerEvents="none">
      <View style={styles.loaderCard}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    </View>
  );
}

export default function App() {
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safety net: the native splash is normally hidden from Splashscreen.tsx once
  // it mounts. If anything upstream (persist rehydration, a slow module import)
  // delays that mount, the native splash would otherwise stay up forever — which
  // is exactly the "stuck on splash screen" App Store reviewers reported. Force-
  // hide after a short delay so the rendered tree is always revealed.
  useEffect(() => {
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const startRouteLoader = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsRouteLoading(true);
    timeoutRef.current = setTimeout(() => {
      setIsRouteLoading(false);
    }, 350);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <StartupErrorBoundary>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
          <NotificationCenterBridge />
          <GestureHandlerRootView style={styles.flexOne}>
            <NavigationContainer onStateChange={startRouteLoader}>
              <Stack.Navigator
                initialRouteName="Splashscreen"
                screenOptions={defaultHeaderOptions}
              >
                <Stack.Screen
                  name="Splashscreen"
                  component={Splashscreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="sign_up"
                  component={Signup}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="cabinet_page"
                  component={Menu}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Dispatcher"
                  component={Dispatcher}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="verify_page"
                  component={Verify}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="forget_password"
                  component={ForgetPassword}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="onboarding_screen"
                  component={OnboardingScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="login"
                  component={Login}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="veiw_order"
                  component={VeiwOrder}
                  options={{ title: "Order Details" }}
                />
                <Stack.Screen
                  name="subscribtion_order"
                  component={Subscribtion}
                  options={{ title: "Order Details" }}
                />
                <Stack.Screen
                  name="bank_card"
                  component={BankCardPage}
                  options={{ title: "Add a Bank Card" }}
                />
                <Stack.Screen
                  name="edit_profile"
                  component={EditProfile}
                  options={{ title: "Edit Profile" }}
                />
                <Stack.Screen
                  name="change_password"
                  component={ChangePassword}
                  options={{ title: "Change password" }}
                />
                <Stack.Screen
                  name="select_slot"
                  component={FacilityPage}
                  options={{ title: "Select Facility" }}
                />
                <Stack.Screen
                  name="request_test"
                  component={RequestTestPage}
                  options={{ title: "Request test" }}
                />
                <Stack.Screen
                  name="select_payment_type"
                  component={SelectPaymentType}
                  options={{ title: "Payment Type" }}
                />
                <Stack.Screen
                  name="select_payment_screen"
                  component={Pays}
                  options={{ title: "Payment Screen" }}
                />
                <Stack.Screen
                  name="successfull_page"
                  component={Successful}
                  options={{ title: "" }}
                />
                <Stack.Screen
                  name="rider_logistics_list_screen"
                  component={RiderLogisticsListScreen}
                  options={{ title: "" }}
                />
                <Stack.Screen
                  name="failed_page"
                  component={Failed}
                  options={{ title: "" }}
                />
                <Stack.Screen
                  name="list_of_price_consutation"
                  component={ListOfPriceConsutation}
                  options={{ title: "Consultaion Price(s)" }}
                />
                <Stack.Screen
                  name="summary_page"
                  component={Summary}
                  options={{ title: "Consultaion Summary" }}
                />
                <Stack.Screen
                  name="home_page"
                  component={MapPage}
                  options={{ title: "Select a Test" }}
                />
                <Stack.Screen
                  name="patient_details"
                  component={PatientDetails}
                  options={{ title: "Patient Details" }}
                />
                <Stack.Screen
                  name="consult_form"
                  component={ConsultForm}
                  options={{ title: "Consultation details" }}
                />
                <Stack.Screen
                  name="request"
                  component={RequestsPage}
                  options={{ title: "Requests" }}
                />
                <Stack.Screen
                  name="preferred_requests_screen"
                  component={PreferredRequestsScreen}
                  options={{ headerShown: false, title: "Preferred Requests" }}
                />
                <Stack.Screen
                  name="accepted_request"
                  component={AcceptedRequests}
                  options={{ title: "Accepted Request" }}
                />
                <Stack.Screen
                  name="delivery_choice_screen"
                  component={DeliveryChoiceScreen}
                  options={{ title: "Delivery choice" }}
                />
                <Stack.Screen
                  name="dropoff_location_screen"
                  component={DropOffScreen}
                  options={{ title: "Drop-off" }}
                />
                <Stack.Screen
                  name="drop_off_locations_screen"
                  component={DropOffLocationsScreen}
                  options={{ headerShown: false, title: "Drop-off Locations" }}
                />
                <Stack.Screen
                  name="notification_inbox_screen"
                  component={NotificationInboxScreen}
                  options={{ headerShown: false, title: "Notifications" }}
                />
                <Stack.Screen
                  name="sample_delivery_screen"
                  component={SampleDeliveryScreen}
                  options={{ headerShown: false, title: "Sample Delivery" }}
                />
                <Stack.Screen
                  name="request_details_screen"
                  component={RequestDetailsScreen}
                  options={{ headerShown: false, title: "Request Details" }}
                />
                <Stack.Screen
                  name="logistics_in_transit_screen"
                  component={LogisticsInTransitScreen}
                  options={{ headerShown: false, title: "In Transit" }}
                />
                <Stack.Screen
                  name="delivery_complete_screen"
                  component={DeliveryCompleteScreen}
                  options={{ headerShown: false, title: "Delivery Complete" }}
                />
                <Stack.Screen
                  name="activity"
                  component={Activity}
                  options={{ title: "Activities" }}
                />
                <Stack.Screen
                  name="earning"
                  component={Earning}
                  options={{ title: "Earnings" }}
                />
                <Stack.Screen
                  name="request_earning"
                  component={RequestEarn}
                  options={{ title: "Request earnings" }}
                />
                <Stack.Screen
                  name="withdraw_earning_history"
                  component={WithdrawEarns}
                  options={{ headerShown: false, title: "Earnings history" }}
                />
                <Stack.Screen
                  name="upload_result"
                  component={UploadResult}
                  options={{ title: "Upload Result" }}
                />
                <Stack.Screen
                  name="payment_record"
                  component={PaymentRecord}
                  options={{ title: "Payment record" }}
                />
                <Stack.Screen
                  name="remit_payment"
                  component={RemitPayment}
                  options={{ title: "Remit Payment" }}
                />
                <Stack.Screen
                  name="payment_history"
                  component={PaymentHistory}
                  options={{ title: "Payment history" }}
                />
                <Stack.Screen
                  name="TodoList"
                  component={TodoList}
                  options={{ title: "Todo List" }}
                />
                <Stack.Screen
                  name="track_request"
                  component={TrackRequest}
                  options={{ title: "Track request" }}
                />
                <Stack.Screen
                  name="audit_screen"
                  component={AuditScreen}
                  options={{ title: "Audit" }}
                />
                <Stack.Screen
                  name="history_screen"
                  component={HistoryScreen}
                  options={{ title: "History" }}
                />
                <Stack.Screen
                  name="update_screen"
                  component={UpdateScreen}
                  options={{ title: "Update Inventry" }}
                />
                <Stack.Screen
                  name="request_screen"
                  component={RequestScreen}
                  options={{ title: "Item request" }}
                />
                <Stack.Screen
                  name="doctor_request_screen"
                  component={PatientRequestScreen}
                  options={{ title: "Patient Request" }}
                />
                <Stack.Screen
                  name="start_consultation_screen"
                  component={StartConsultationScreen}
                  options={{ title: "Start Consultation" }}
                />
                <Stack.Screen
                  name="chat_screen"
                  component={ChatScreen}
                  options={{ title: "Chat" }}
                />
                <Stack.Screen
                  name="appointments_screen"
                  component={AppointmentsScreen}
                  options={{ title: "Appointments" }}
                />
                <Stack.Screen
                  name="preferred_consultations_screen"
                  component={PreferredConsultationsScreen}
                  options={{ headerShown: false, title: "Preferred Consultations" }}
                />
                <Stack.Screen
                  name="consultation_history_screen"
                  component={ConsultationHistoryScreen}
                  options={{ title: "Consultation History" }}
                />
                <Stack.Screen
                  name="audit_history_screen"
                  component={HistoryScreen}
                  options={{ title: "Audit history" }}
                />
                <Stack.Screen
                  name="help_and_support_screen"
                  component={HelpAndSupport}
                  options={{ title: "Help and support" }}
                />
                <Stack.Screen
                  name="review_result_screen"
                  component={ReviewResult}
                  options={{ title: "Review Result" }}
                />
                <Stack.Screen
                  name="review_main_result_screen"
                  component={ReviewRequestScreen}
                  options={{ title: "Review Result Request" }}
                />

                <Stack.Group
                  screenOptions={{ presentation: "modal", headerShown: false }}
                >
                  <Stack.Screen
                    name="PrescriptionModal"
                    component={PrescriptionModal}
                  />
                </Stack.Group>

                <Stack.Screen
                  name="AddEditTodo"
                  component={AddEditTodo}
                  options={{ title: "Add/Edit Todo" }}
                />
                <Stack.Screen
                  name="Edit_Profile_Screen"
                  component={EditProfile}
                  options={{ title: "Edit Todo" }}
                />
              </Stack.Navigator>
            </NavigationContainer>

            {isRouteLoading && <FullScreenLoader />}
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </ApolloProvider>
    </StartupErrorBoundary>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  errorScreen: {
    flex: 1,
    backgroundColor: "#0b1d1d",
    paddingTop: 60,
  },
  errorTitle: {
    color: "#ffd5d5",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  errorMessage: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  errorStack: {
    color: "#9fb4b4",
    fontSize: 11,
    fontFamily: "Courier",
  },
  fullScreenLoader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  loaderCard: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
