import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { loginUser, setToken } from "../api/auth";
import styles from "../styles/LoginScreenStyles";
import GlobalStyles from "../styles/GlobalStyles";
import * as yup from "yup";
import useFormValidation from "../hook/useFormValidation";
import FormError from "../components/common/FormError";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const form = useFormValidation(
    { email: "", password: "" },
    loginSchema,
    async (values) => {
      try {
        const res = await loginUser(values.email, values.password);
        console.log("Login API response:", res);

        if (res && res.token) {
          await setToken(res.token);
          onLoginSuccess();
        } else {
          Alert.alert("Login Failed", res.message || "Invalid credentials");
        }
      } catch (err) {
        const message = err?.response?.data?.message;
        if (message && message.includes("NOT verify")) {
          Alert.alert(
            "Account not verified",
            "Please verify your account.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("Register", { email: values.email })
              }
            ]
          );
        } else {
          Alert.alert(
            "Login Failed",
            message || "Invalid credentials"
          );
        }
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, GlobalStyles.textPrimary]}>
        Welcome{"\n"}Back!
      </Text>
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <FontAwesome
          name="user"
          size={20}
          color="#888"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={form.values.email}
          onChangeText={(text) => form.handleChange("email", text)}
          autoCapitalize="none"
          onBlur={() => form.validate()}
        />
        <FormError error={form.errors.email} />
      </View>
      {/* Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome
          name="lock"
          size={20}
          color="#888"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={form.values.password}
          onChangeText={(text) => form.handleChange("password", text)}
          secureTextEntry={!showPassword}
          onBlur={() => form.validate()}
        />
        <FormError error={form.errors.password} />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={GlobalStyles.textError}>Forgot Password?</Text>
      </TouchableOpacity>
      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={form.handleSubmit}
        disabled={form.submitting}
      >
        {form.submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={GlobalStyles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text style={GlobalStyles.textMuted}>Create An Account </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={GlobalStyles.textError}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
