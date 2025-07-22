import * as React from "react";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View, RefreshControl } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLISHABLE_KEY } from "./config/stripe";

import HomeScreen from "./screens/HomeScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CartScreen from "./screens/CartScreen";
import OrdersScreen from "./screens/OrdersScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PaymentMethodScreen from "./screens/AdressManagingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PaymentWithStripeScreen from "./screens/PaymentWithStripeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import UpdatePasswordScreen from "./screens/UpdatePassword";
import AdminHomeScreen from "./screens/AdminHomeScreen";

import { getToken, getUserRole } from "./api/auth";
import AdminOrdersScreen from "./screens/AdminOrderScreen";
import AdminOrderDetailScreen from "./screens/AdminOrderDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator({ onLogout }) {
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
          else if (route.name === "Wishlist") iconName = "heart";
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
      <Tab.Screen name="Wishlist" component={ProductListScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen
        name="Profile"
        children={(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      />
    </Tab.Navigator>
  );
}

function AdminTabNavigator({ onLogout }) {
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
          if (route.name === "AdminHome") iconName = "dashboard";
          else if (route.name === "Orders") iconName = "first-order";
          else if (route.name === "Profile") iconName = "user";
          return (
            <FontAwesome name={iconName} size={size || 22} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="Profile"
        children={(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      />
      <Tab.Screen
        name="AdminOrders"
        component={AdminOrdersScreen} // Đổi component thành của admin
        options={{ title: "Orders" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkTokenAndRole = async () => {
      const token = await getToken();
      const role = await getUserRole();
      setIsLoggedIn(!!token);
      setUserRole(role);
    };
    checkTokenAndRole();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh(); // This is your hook's refresh function
    setRefreshing(false);
  };

  if (isLoggedIn === null) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
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
              initialRouteName={
                isLoggedIn
                  ? userRole === "admin"
                    ? "AdminTabs"
                    : "MainTabs"
                  : "Login"
              }
            >
              {isLoggedIn ? (
                userRole === "admin" ? (
                  <>
                    <Stack.Screen
                      name="AdminTabs"
                      children={(props) => (
                        <AdminTabNavigator {...props} onLogout={handleLogout} />
                      )}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="AdminOrderDetail"
                      component={AdminOrderDetailScreen}
                      options={{ title: "Chi tiết đơn hàng" }}
                    />
                    {/* Add other admin screens here if needed */}
                  </>
                ) : (
                  <>
                    <Stack.Screen
                      name="MainTabs"
                      children={(props) => (
                        <MainTabNavigator {...props} onLogout={handleLogout} />
                      )}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="ProductDetail"
                      component={ProductDetailScreen}
                    />
                    <Stack.Screen name="Payment" component={PaymentScreen} />
                    <Stack.Screen
                      name="PaymentMethod"
                      component={PaymentMethodScreen}
                    />
                    <Stack.Screen
                      name="PaymentWithStripeScreen"
                      component={PaymentWithStripeScreen}
                    />
                    <Stack.Screen
                      name="UpdatePassword"
                      component={UpdatePasswordScreen}
                    />
                    <Stack.Screen
                      name="ForgotPassword"
                      component={ForgotPasswordScreen}
                    />
                  </>
                )
              ) : (
                <>
                  <Stack.Screen name="Login">
                    {(props) => (
                      <LoginScreen
                        {...props}
                        onLoginSuccess={(role) => {
                          setIsLoggedIn(true);
                          setUserRole(role);
                        }}
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
