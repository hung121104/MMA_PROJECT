import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";

// Config
import { STRIPE_PUBLISHABLE_KEY } from "./config/stripe";

// API
import { getToken, getUserRole } from "./api/auth";

// Navigation
import AuthNavigator from "./navigation/AuthNavigator";
import AdminTabNavigator from "./navigation/AdminTabNavigator";
import MainTabNavigator from "./navigation/MainTabNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);

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

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
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

  const getInitialRouteName = () => {
    if (!isLoggedIn) return "Auth";
    return userRole === "admin" ? "Admin" : "User";
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={getInitialRouteName()}
            >
              {isLoggedIn ? (
                userRole === "admin" ? (
                  <Stack.Screen name="Admin">
                    {(props) => (
                      <AdminTabNavigator {...props} onLogout={handleLogout} />
                    )}
                  </Stack.Screen>
                ) : (
                  <Stack.Screen name="User">
                    {(props) => (
                      <MainTabNavigator {...props} onLogout={handleLogout} />
                    )}
                  </Stack.Screen>
                )
              ) : (
                <Stack.Screen name="Auth">
                  {(props) => (
                    <AuthNavigator
                      {...props}
                      onLoginSuccess={handleLoginSuccess}
                    />
                  )}
                </Stack.Screen>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </StripeProvider>
  );
}
