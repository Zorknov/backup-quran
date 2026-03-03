import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View, Text, Platform, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4B6B63", // Hijau tema aplikasi
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="alquran"
        options={{
          title: "Al-Quran",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="artikel"
        options={{
          title: "Artikel",
          tabBarIcon: ({ color }) => (
            <Ionicons name="newspaper-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Setelan",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />

      {/* Tombol AI - Fix TypeScript & Interaksi */}
      <Tabs.Screen
        name="ai_chat"
        options={{
          title: "AI",
          tabBarButton: (props) => {
            // Destruktur props untuk menghindari error 'null' pada TypeScript
            const { onPress, style } = props;
            
            return (
              <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                // Menggabungkan style bawaan navigasi dengan custom wrapper
                style={[style, styles.aiButtonWrapper]}
              >
                <View style={styles.aiButton}>
                  <Ionicons name="sparkles" size={16} color="#4B6B63" />
                  <Text style={styles.aiText}>AI</Text>
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    marginHorizontal: 15,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    // Flat design dengan border halus sesuai permintaan sebelumnya
    borderWidth: 1,
    borderColor: "#F2EADD",
    // Shadow sangat tipis agar tetap elegan
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingTop: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
  },
  aiButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    // Memberikan sedikit ruang di kanan agar tidak terlalu mepet
    paddingRight: 10,
  },
  aiButton: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4", // Background hijau pucat
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  aiText: {
    color: "#4B6B63",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
});