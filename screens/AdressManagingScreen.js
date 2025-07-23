import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import AdressManagingScreenStyles from "../styles/AdressManagingScreenStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import * as yup from "yup";
import useFormValidation from "../hook/useFormValidation";
import FormError from "../components/common/FormError";

// Enhanced validation schema with phone number validation
const addressSchema = yup.object().shape({
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
});

export default function AdressManagingScreen({ navigation, route }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Custom phone number formatter
  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters except +
    const cleaned = value.replace(/[^\d+]/g, "");

    // Don't allow multiple + signs
    if (cleaned.indexOf("+") !== cleaned.lastIndexOf("+")) {
      return cleaned.substring(0, cleaned.lastIndexOf("+"));
    }

    // Ensure + is only at the beginning
    if (cleaned.includes("+") && cleaned.indexOf("+") !== 0) {
      return cleaned.replace(/\+/g, "");
    }

    return cleaned;
  };

  const form = useFormValidation(
    { address: "", city: "", country: "Vietnam", phone: "" },
    addressSchema,
    async (values) => {
      if (isEditMode) {
        const updated = addresses.map((addr, idx) =>
          idx === selectedIdx
            ? {
                address: values.address,
                city: values.city,
                country: values.country,
                phone: values.phone,
              }
            : addr
        );
        await AsyncStorage.setItem("userAddresses", JSON.stringify(updated));
        setAddresses(updated);
      } else {
        const updated = [
          ...addresses,
          {
            address: values.address,
            city: values.city,
            country: values.country,
            phone: values.phone,
          },
        ];
        await AsyncStorage.setItem("userAddresses", JSON.stringify(updated));
        setAddresses(updated);
        setSelectedIdx(updated.length - 1);
      }
      setShowAddModal(false);
      form.setValues({ address: "", city: "", country: "Vietnam", phone: "" });
      setIsEditMode(false);
    }
  );

  // Custom phone change handler
  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    form.handleChange("phone", formatted);
  };

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const saved = await AsyncStorage.getItem("userAddresses");
        if (saved) setAddresses(JSON.parse(saved));
        else setAddresses([]);
      } catch (e) {
        setAddresses([]);
      }
    };
    loadAddresses();
  }, []);

  const handleSelect = (idx) => setSelectedIdx(idx);

  const handleEditAddress = (idx) => {
    form.setValues({
      address: addresses[idx].address,
      city: addresses[idx].city || "",
      country: addresses[idx].country || "Vietnam",
      phone: addresses[idx].phone || "",
    });
    setShowAddModal(true);
    setIsEditMode(true);
    setSelectedIdx(idx);
  };

  const handleDeleteAddress = async (idx) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = addresses.filter((_, i) => i !== idx); //dup the address array without the address in the idx
            await AsyncStorage.setItem(
              "userAddresses",
              JSON.stringify(updated)
            );
            setAddresses(updated);
            if (selectedIdx >= updated.length)
              setSelectedIdx(Math.max(0, updated.length - 1));
          },
        },
      ]
    );
  };

  const handleShowAddModal = () => {
    form.setValues({ address: "", city: "", country: "Vietnam", phone: "" });
    setShowAddModal(true);
    setIsEditMode(false);
  };

  const handleSelectConfirm = () => {
    if (addresses.length === 0) return;
    navigation.navigate("Payment", {
      selectedAddressIdx: selectedIdx,
      selectedCartItems: route.params?.selectedCartItems,
    });
  };

  return (
    <View style={AdressManagingScreenStyles.container}>
      <Text style={AdressManagingScreenStyles.title}>Address Selection</Text>
      <FlatList
        data={addresses}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
          >
            <TouchableOpacity
              onPress={() => handleSelect(index)}
              style={{ marginRight: 12, marginTop: 6 }}
            >
              <FontAwesome
                name={index === selectedIdx ? "dot-circle-o" : "circle-o"}
                size={22}
                color={index === selectedIdx ? "#2563eb" : "#bbb"}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontWeight: index === selectedIdx ? "bold" : "normal",
                    fontSize: 16,
                    color: index === selectedIdx ? "#111" : "#333",
                  }}
                >
                  Phone: {item.phone}
                </Text>
                <TouchableOpacity
                  onPress={() => handleEditAddress(index)}
                  style={{ marginLeft: 12 }}
                >
                  <Text
                    style={{
                      color: "#2563eb",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(index)}
                  style={{ marginLeft: 8 }}
                >
                  <FontAwesome name="trash" size={18} color="#e53950" />
                </TouchableOpacity>
              </View>
              <Text style={{ color: "#444", fontSize: 14, marginTop: 2 }}>
                {item.address}, {item.city}, {item.country}
              </Text>
              {index === 0 && (
                <Text
                  style={{
                    color: "#e53950",
                    borderWidth: 1,
                    borderColor: "#e53950",
                    borderRadius: 4,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    fontSize: 12,
                    alignSelf: "flex-start",
                    marginTop: 4,
                  }}
                >
                  Default
                </Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#888", marginTop: 32, textAlign: "center" }}>
            No addresses found.
          </Text>
        }
      />

      {/* Add Address Button */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 24,
        }}
        onPress={handleShowAddModal}
      >
        <FontAwesome
          name="plus-circle"
          size={22}
          color="#2563eb"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: "#2563eb", fontWeight: "bold", fontSize: 16 }}>
          Add a new address
        </Text>
      </TouchableOpacity>

      {/* Select Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#2563eb",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 24,
        }}
        onPress={handleSelectConfirm}
        disabled={addresses.length === 0}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Select
        </Text>
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 400,
              minHeight: 380,
              maxHeight: Dimensions.get("window").height * 0.9,
            }}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}
              >
                {isEditMode ? "Edit Address" : "Add Address"}
              </Text>

              {/* Enhanced Phone Input */}
              <View style={{ marginBottom: 16 }}>
                <View
                  style={[
                    AdressManagingScreenStyles.input,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 12,
                    },
                  ]}
                >
                  <FontAwesome
                    name="phone"
                    size={16}
                    color="#666"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    placeholder="Phone Number (e.g., +1234567890)"
                    value={form.values.phone}
                    onChangeText={handlePhoneChange}
                    style={{ flex: 1, fontSize: 16 }}
                    onBlur={() => form.validate()}
                    keyboardType="phone-pad"
                    autoCompleteType="tel"
                  />
                </View>
                <FormError error={form.errors.phone} />
                {form.values.phone && !form.errors.phone && (
                  <Text
                    style={{
                      color: "#28a745",
                      fontSize: 12,
                      marginTop: 4,
                      marginLeft: 12,
                    }}
                  >
                    ✓ Valid phone number
                  </Text>
                )}
              </View>

              <TextInput
                placeholder="Address"
                value={form.values.address}
                onChangeText={(text) => form.handleChange("address", text)}
                style={[AdressManagingScreenStyles.input, { width: "100%" }]}
                onBlur={() => form.validate()}
              />
              <FormError error={form.errors.address} />

              <TextInput
                placeholder="City"
                value={form.values.city}
                onChangeText={(text) => form.handleChange("city", text)}
                style={[AdressManagingScreenStyles.input, { width: "100%" }]}
                onBlur={() => form.validate()}
              />
              <FormError error={form.errors.city} />

              <TextInput
                placeholder="Country"
                value={form.values.country}
                onChangeText={(text) => form.handleChange("country", text)}
                style={[AdressManagingScreenStyles.input, { width: "100%" }]}
                onBlur={() => form.validate()}
              />
              <FormError error={form.errors.country} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    setIsEditMode(false);
                  }}
                  style={{ marginRight: 16 }}
                >
                  <Text style={{ color: "#888", fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={form.handleSubmit}>
                  <Text
                    style={{
                      color: "#2563eb",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
