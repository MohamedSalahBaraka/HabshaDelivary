import { ActivityIndicator, Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import Home from "../screens/Home";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from "@react-navigation/stack";
import DelivareyFormerOrders from "../screens/DelivareyFormerOrders";
import OrderDetails from "../modals/OrderDetails";
import Setting from "../screens/Setting";
import UpdateInfo from "../modals/UpdateInfo";
import UpdatePassword from "../modals/UpdatePassword";
import { AuthContext } from "../context/AuthContext";
import Login from "../screens/Login";


const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();
function Drawernavigator({ navigation }) {
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerPosition: 'right',
      }}>
      <Drawer.Screen name="Home" component={Home} options={{ title: "الرئيسية" }} />
      <Drawer.Screen name="DelivareyFormerOrders" component={DelivareyFormerOrders} options={{ title: "طلبات التوصيل السابقة" }} />
      <Drawer.Screen name="Setting" component={Setting} options={{ title: "الإعدادات" }} />
    </Drawer.Navigator>
  );
}

export default function Appwraper() {

  const { userToken } = useContext(AuthContext);


  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName='drawer'
        screenOptions={{
          headerShown: false,
        }}>
        {userToken !== null ? <>
          <RootStack.Group>
            <RootStack.Screen name="drawer" component={Drawernavigator} />
          </RootStack.Group>
          <RootStack.Group screenOptions={{ presentation: 'transparentModal' }}>
            <RootStack.Screen name="OrderDetails" component={OrderDetails} />
            <RootStack.Screen name="UpdateInfo" component={UpdateInfo} />
            <RootStack.Screen name="UpdatePassword" component={UpdatePassword} />
          </RootStack.Group>
        </> :
          <RootStack.Group>
            <RootStack.Screen name="Login" component={Login} />
          </RootStack.Group>}
      </RootStack.Navigator>

    </NavigationContainer>
  );
}
