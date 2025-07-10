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

export default function AdressManagingScreen({ navigation, route }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("Vietnam");

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

  const handleAddAddress = async () => {
    if (!newAddress || !newCity || !newCountry) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const updated = [
      ...addresses,
      { address: newAddress, city: newCity, country: newCountry },
    ];
    await AsyncStorage.setItem("userAddresses", JSON.stringify(updated));
    setAddresses(updated);
    setShowAddModal(false);
    setNewAddress("");
    setNewCity("");
    setNewCountry("Vietnam");
    setIsEditMode(false);
    setSelectedIdx(updated.length - 1);
  };

  const handleEditAddress = (idx) => {
    setNewAddress(addresses[idx].address);
    setNewCity(addresses[idx].city || "");
    setNewCountry(addresses[idx].country || "Vietnam");
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
            const updated = addresses.filter((_, i) => i !== idx);
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

  const handleSelectConfirm = () => {
    if (addresses.length === 0) return;
    navigation.navigate("Payment", {
      selectedAddressIdx: selectedIdx,
      selectedCartItems: route.params?.selectedCartItems,
    });
  };

  const handleSaveEdit = async () => {
    if (!newAddress || !newCity || !newCountry) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const updated = addresses.map((addr, idx) =>
      idx === selectedIdx
        ? { address: newAddress, city: newCity, country: newCountry }
        : addr
    );
    await AsyncStorage.setItem("userAddresses", JSON.stringify(updated));
    setAddresses(updated);
    setShowAddModal(false);
    setNewAddress("");
    setNewCity("");
    setNewCountry("Vietnam");
    setIsEditMode(false);
  };

  const handleShowAddModal = () => {
    setNewAddress("");
    setNewCity("");
    setNewCountry("Vietnam");
    setShowAddModal(true);
    setIsEditMode(false);
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
                  {item.name}
                </Text>
                <Text style={{ color: "#888", marginLeft: 8, fontSize: 14 }}>
                  | {item.phone}
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
              minHeight: 320,
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
              <TextInput
                placeholder="Address"
                value={newAddress}
                onChangeText={setNewAddress}
                style={[AdressManagingScreenStyles.input, { width: "100%" }]}
              />
              <TextInput
                placeholder="City"
                value={newCity}
                onChangeText={setNewCity}
                style={[AdressManagingScreenStyles.input, { width: "100%" }]}
              />
              <TextInput
                placeholder="Country"
                value={newCountry}
                onChangeText={setNewCountry}
                style={[AdressManagingScreenStyles.input, { width: "100%" }]}
              />
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
                <TouchableOpacity
                  onPress={isEditMode ? handleSaveEdit : handleAddAddress}
                >
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
