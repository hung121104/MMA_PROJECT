import * as React from "react";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from './config/stripe';

import HomeScreen from "./screens/HomeScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CartScreen from "./screens/CartScreen";
import OrdersScreen from "./screens/OrdersScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PaymentMethodScreen from "./screens/AdressManagingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PaymentComponentScreen from "./screens/PaymentWithStripeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

import { getToken } from "./api/auth";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2a6ef7',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Wishlist') iconName = 'heart';
          else if (route.name === 'Cart') iconName = 'shopping-cart';
          else if (route.name === 'Orders') iconName = 'list-alt';
          else if (route.name === 'Profile') iconName = 'user';
          return <FontAwesome name={iconName} size={size || 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wishlist" component={ProductListScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreen onLogout={onLogout} />}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <NavigationContainer>
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
              initialRouteName={isLoggedIn ? "MainTabs" : "Login"}
            >
              {isLoggedIn ? (
                <>
                  <Stack.Screen
                    name="MainTabs"
                    options={{ headerShown: false }}
                    children={() => <MainTabNavigator onLogout={handleLogout} />}
                  />
                  <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                  <Stack.Screen name="Payment" component={PaymentScreen} />
                  <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
                  <Stack.Screen name="PaymentComponent" component={PaymentComponentScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login">
                    {(props) => (
                      <LoginScreen
                        {...props}
                        onLoginSuccess={() => setIsLoggedIn(true)}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPasswordScreen}
                  />
                  <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordScreen}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </StripeProvider>
  );
}
