import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";

// Tab Screens
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Stack Screens
import ProductDetailScreen from "../screens/ProductDetailScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PaymentMethodScreen from "../screens/AdressManagingScreen";
import PaymentWithStripeScreen from "../screens/PaymentWithStripeScreen";
import UpdatePasswordScreen from "../screens/UpdatePassword";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator Component
function TabNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2a6ef7",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Cart") iconName = "shopping-cart";
          else if (route.name === "Orders") iconName = "list-alt";
          else if (route.name === "Profile") iconName = "user";
          return (
            <FontAwesome name={iconName} size={size || 22} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen
        name="Profile"
        children={(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      />
    </Tab.Navigator>
  );
}

// Main Navigator Component (Tab + Stack)
function MainTabNavigator({ onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: "#111",
          fontWeight: "bold",
          fontSize: 20,
          letterSpacing: 0.5,
        },
        headerTitleAlign: "center",
        headerTintColor: "#111",
      }}
    >
      <Stack.Screen
        name="MainTabs"
        children={(props) => <TabNavigator {...props} onLogout={onLogout} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen
        name="PaymentWithStripeScreen"
        component={PaymentWithStripeScreen}
      />
      <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

export default MainTabNavigator;
