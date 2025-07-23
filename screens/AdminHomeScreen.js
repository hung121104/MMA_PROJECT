import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrders } from "../api/orders";
import OptimizedImage from "../components/OptimizedImage"; // Add this import

const screenWidth = Dimensions.get("window").width;

export default function AdminHomeScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [dailyOrderCounts, setDailyOrderCounts] = useState({
    labels: [],
    data: [],
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("token");
          const orderList = await getOrders(token);
          setOrders(orderList);

          let totalRevenue = 0;
          orderList.forEach((order) => {
            if (
              order.paymentStatus === "paid" ||
              order.orderStatus === "delivered"
            ) {
              totalRevenue += order.totalAmount || 0;
            }
          });

          const productMap = {};
          orderList.forEach((order) => {
            order.orderItems.forEach((item) => {
              if (!item._id) return;
              if (!productMap[item._id]) {
                productMap[item._id] = {
                  _id: item._id,
                  name: item.name,
                  sold: 0,
                  image: item.image,
                };
              }
              productMap[item._id].sold += item.quantity || 0;
            });
          });
          const topProductsData = Object.values(productMap)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);

          const recentOrdersData = [...orderList]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

          const counts = {};
          const labels = [];
          for (let i = 6; i >= 0; i--) {
            const day = moment().subtract(i, "days").format("DD/MM");
            labels.push(day);
            counts[day] = 0;
          }
          orderList.forEach((order) => {
            const day = moment(order.createdAt).format("DD/MM");
            if (counts.hasOwnProperty(day)) {
              counts[day] += 1;
            }
          });
          const dataSet = labels.map((label) => counts[label]);

          setOrderStats({
            totalOrders: orderList.length,
            totalRevenue,
          });
          setTopProducts(topProductsData);
          setRecentOrders(recentOrdersData);
          setDailyOrderCounts({ labels, data: dataSet });
        } catch (e) {
          setOrderStats({ totalOrders: 0, totalRevenue: 0 });
          setTopProducts([]);
          setRecentOrders([]);
          setDailyOrderCounts({ labels: [], data: [] });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2980ef" />
      </View>
    );
  }

  const barData = {
    labels: dailyOrderCounts.labels,
    datasets: [{ data: dailyOrderCounts.data }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recentOrders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AdminOrderDetail", { orderId: item._id })
            }
            style={styles.orderCard}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                #{item._id.slice(-6).toUpperCase()}
              </Text>
              <Text style={{ color: "#888" }}>
                {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
            <Text style={{ fontSize: 18 }}>
              Customer: {item.user?.name || "Unknown"}
            </Text>
            <Text style={{ fontSize: 18 }}>
              Status:{" "}
              {item.orderStatus.charAt(0).toUpperCase() +
                item.orderStatus.slice(1)}
            </Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 18, color: "#D32F2F" }}
            >
              Total: {item.totalAmount?.toLocaleString()}$
            </Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Admin Dashboard</Text>
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: "#2a6ef7" }]}>
                <Text style={styles.statNumber}>{orderStats.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: "#27ae60" }]}>
                <Text style={styles.statNumber}>
                  {orderStats.totalRevenue.toLocaleString("en-US")}$
                </Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
            </View>

            <Text style={styles.chartTitle}>Orders in last 7 days</Text>
            <BarChart
              data={barData}
              width={screenWidth - 32}
              height={260}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(42, 110, 247, ${opacity})`,
                labelColor: () => "#222",
                barPercentage: 0.5,
              }}
              verticalLabelRotation={45}
              fromZero
              showValuesOnTopOfBars
              style={styles.chart}
            />

            <Text style={styles.chartTitle}>Top Best-selling Products</Text>
            {topProducts.length > 0 ? (
              <FlatList
                data={topProducts}
                horizontal
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingLeft: 6, paddingBottom: 6 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.topProductBox}>
                    {item.image ? (
                      <OptimizedImage
                        source={{ uri: item.image }}
                        style={styles.topProductImage}
                        width={56}
                        height={56}
                        quality="70"
                        fallbackText="📦"
                      />
                    ) : (
                      <View style={styles.topProductImgPlaceholder} />
                    )}
                    <Text numberOfLines={1} style={styles.topProductName}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: "#2a6ef7",
                        fontWeight: "bold",
                        marginTop: 3,
                      }}
                    >
                      Sold: {item.sold}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text
                style={{ textAlign: "center", color: "#888", marginBottom: 20 }}
              >
                No product sales data available.
              </Text>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f8fc" },
  centered: { justifyContent: "center", alignItems: "center", flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#2a6ef7",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    paddingVertical: 24,
    marginHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  statLabel: { fontSize: 18, color: "#fff", marginTop: 8 },
  chartTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
    marginTop: 12,
  },
  chart: { borderRadius: 12, marginBottom: 8 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    marginTop: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  topProductBox: {
    width: 110,
    backgroundColor: "#fff",
    borderRadius: 11,
    marginRight: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  topProductImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  topProductImgPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
    backgroundColor: "#ccc",
  },
  topProductName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#13161A",
    textAlign: "center",
  },
});
