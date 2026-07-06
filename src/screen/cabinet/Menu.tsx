import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Account from './Account';
import Chat from './Chat';
import Ward from './Ward';
import useAuth from '../../schema/UseAuth';
import GetUserDetails from '../../schema/GetUserDetails';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Dispatcher from './Dispatcher';
import Earning from '../ward/earnings/Earning';
import { Clock } from 'lucide-react-native';

type IconArgs = {
  focused?: boolean;
  color: string;
  size: number;
};

type TabItem = {
  name: string;
  title?: string;
  component: React.ComponentType<any>;
  icon: (props: IconArgs) => React.ReactNode;
};

const Tab = createBottomTabNavigator();
const TAB_CONFIG: Record<string, TabItem[]> = {
  DISPATCHER: [
    {
      name: 'Dispatcher',
      title: 'Logistics',
       component: Dispatcher,
      icon: ({ color, size }) => (
        <MaterialIcons name="local-shipping" color={color} size={size} />
      ),
    },
    // {
    //   name: 'routes',
    //   title: 'Requests',
    //   component:RoutesScreen,
    //   icon: ({ color, size }) => (
    //     <MaterialIcons name="route" color={color} size={size} />
    //   ),
    // },

    {
      name: 'earning',
      title: 'Earnings',
      component: Earning,
      icon: ({ color, size }) => <Clock size={size} color={color} />,
    },    {
      name: 'account',
      title: 'Account',
      component: Account,
      icon: ({ color, size }) => (
        <MaterialIcons name="person-4" color={color} size={size} />
      ),
    },
  ],

  PHLEBOTOMIST: [
    {
      name: 'Ward',
      component: Ward,
      icon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? 'home' : 'home-outline'}
          size={size}
          color={color}
        />
      ),
    },
    {
      name: 'Activities',
      component: Chat,
      icon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? 'chatbubble' : 'chatbubble-outline'}
          size={size}
          color={color}
        />
      ),
    },
    
    {
      name: 'earning',
      title: 'Earnings',
      component: Earning,
      icon: ({ color, size }) => <Clock size={size} color={color} />,
    },
    {
      name: 'Account',
      component: Account,
      icon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? 'person' : 'person-outline'}
          size={size}
          color={color}
        />
      ),
    },
  ],

  DEFAULT: [
    {
      name: 'Ward',
      component: Ward,
      icon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? 'home' : 'home-outline'}
          size={size}
          color={color}
        />
      ),
    },
    
    {
      name: 'earning',
      title: 'Earnings',
      component: Earning,
      icon: ({ color, size }) => <Clock size={size} color={color} />,
    },
    {
      name: 'Account',
      component: Account,
      icon: ({ focused, color, size }) => (
        <Ionicons
          name={focused ? 'person' : 'person-outline'}
          size={size}
          color={color}
        />
      ),
    },
  ],
};

const Menu = ({ route }: { route: any }) => {
  const navigation = useNavigation();

  const { userType } = useAuth(navigation);

  // useEffect(() => {
  //   setRole(userType?.toLowerCase() || '');
  //   console.log('Role:', role);
  // }, [userType]);


const { fetchDataUserDetails } = GetUserDetails(navigation);

//   const roleTabs =
//     TAB_CONFIG[role.toUpperCase()] || TAB_CONFIG.DEFAULT;
// console.error('RSRSRSRRS :::::: ', roleTabs);
// ✅ Normalize userType safely
  const normalizedRole = userType?.toUpperCase().trim() || 'DEFAULT';

  // ✅ Resolve tabs directly from userType
  const roleTabs = TAB_CONFIG[normalizedRole] || TAB_CONFIG.DEFAULT;


  
  return (
    <Tab.Navigator
      key={normalizedRole}
      initialRouteName={route?.params?.screen || roleTabs[0]?.name}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#8C93A3',
        tabBarLabelStyle: { marginTop: -2, paddingBottom: 16, fontSize: 10 },
        tabBarIconStyle: { marginTop: 2, marginBottom: 4 },
        tabBarItemStyle: { paddingVertical: 2 },
        tabBarStyle: { height: 78, paddingTop: 4, paddingBottom: 8 },
      }}
    >
      {roleTabs.map((tab: TabItem) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab.title ?? tab.name,
            tabBarIcon: tab.icon,
          }}
          listeners={
            tab.name === 'Ward'
              ? { tabPress: fetchDataUserDetails }
              : undefined
          }
        />
      ))}
    </Tab.Navigator>
  );
};


export default Menu;





  // const { fetchDataUserDetails } = GetUserDetails();
  //   const {   
  //   email,
  //   firstName,
  //   lastName,
  //   streetAddress,
  //   city,
  //   state,
  //   country, 
  //   postal,
    
    
  //   dateOfBirth,    
  // pId,
  // bankInfomation,
  // online,
  // phlebotomistEarning_,fetchDataUserDetails} = GetUserDetails(navigation);

//   return (
//     if(userType === "DISPATCHER"){
//               <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: "#059669",
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Logistics",
//           tabBarIcon: ({ color, size }) => (
//             <MaterialIcons name="local-shipping" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="routes"
//         options={{
//           title: "Routes",
//           tabBarIcon: ({ color, size }) => (
//             <MaterialIcons name="route" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="account"
//         options={{
//           title: "Account",
//           tabBarIcon: ({ color, size }) => (
//             <MaterialIcons name="person-4" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tabs>
// }else{
//     <Tab.Navigator
//       initialRouteName={route?.params?.screen || wardName}
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === wardName) {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === chatName) {
//             iconName = focused ? 'chatbubble' : 'chatbubble-outline';
//           } else if (route.name === accountName) {
//             iconName = focused ? 'person' : 'person-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#059669',
//         tabBarInactiveTintColor: '#8C93A3',
//         tabBarLabelStyle: { paddingBottom: 5, fontSize: 12 },
//         tabBarStyle: { height: 100 },
//       })}
//     >
//       <Tab.Screen
//         name={wardName}
//         component={Ward}
//         options={{ headerShown: false, unmountOnBlur: true }}
//         listeners={{
//           tabPress: () => fetchDataUserDetails(),
//         }}
//       />
//       {role === 'phlebotomist' && (
//         <Tab.Screen
//           name={chatName}
//           component={Chat}
//           options={{ headerShown: false, unmountOnBlur: true }}
//         />
//       )}
//       <Tab.Screen
//         name={accountName}
//         component={Account}
//         options={{ headerShown: false, unmountOnBlur: true }}
//       />
//     </Tab.Navigator>
// }
//   );
// };

