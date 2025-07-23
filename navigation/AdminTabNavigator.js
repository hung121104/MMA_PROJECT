import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";

// Tab Screens
import AdminHomeScreen from "../screens/AdminHomeScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import ProductsScreen from "../screens/ProductsScreen";
import AdminOrdersScreen from "../screens/AdminOrderScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Stack Screens
import CreateCategoryScreen from "../screens/CreateCategoryScreen";
import CreateProductScreen from "../screens/CreateProductScreen";
import EditProductScreen from "../screens/EditProductScreen";
import AdminOrderDetailScreen from "../screens/AdminOrderDetailScreen";
import UpdatePasswordScreen from "../screens/UpdatePassword";

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
          if (route.name === "AdminHome") iconName = "dashboard";
          else if (route.name === "Categories") iconName = "list";
          else if (route.name === "Products") iconName = "shopping-bag";
          else if (route.name === "AdminOrders") iconName = "list-alt";
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
        name="Categories"
        component={CategoriesScreen}
        options={{ title: "Categories" }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: "Products" }}
      />
      <Tab.Screen
        name="AdminOrders"
        component={AdminOrdersScreen}
        options={{ title: "Orders" }}
      />
      <Tab.Screen
        name="Profile"
        children={(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      />
    </Tab.Navigator>
  );
}

// Admin Navigator Component (Tab + Stack)
function AdminTabNavigator({ onLogout }) {
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
        name="AdminTabs"
        children={(props) => <TabNavigator {...props} onLogout={onLogout} />}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateCategory"
        component={CreateCategoryScreen}
        options={{ title: "Create Category" }}
      />
      <Stack.Screen
        name="CreateProduct"
        component={CreateProductScreen}
        options={{ title: "Create Product" }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ title: "Edit Product" }}
      />
      <Stack.Screen
        name="AdminOrderDetail"
        component={AdminOrderDetailScreen}
        options={{ title: "Order detail" }}
      />
      <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
    </Stack.Navigator>
  );
}

export default AdminTabNavigator;
