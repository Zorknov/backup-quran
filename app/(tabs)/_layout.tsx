import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4C6793", // Biru sesuai gambar
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarShowLabel: true, // Pastikan label muncul
      }}
    >
      <Tabs.Screen
        name="index" // Pastikan ada file index.tsx
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="alquran" // PASTIKAN nama file kamu: alquran.tsx atau alquran/index.tsx
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

      {/* Tambahan Tombol AI agar persis seperti gambar */}
      <Tabs.Screen
        name="ai_chat"
        options={{
          title: "AI",
          tabBarButton: (props) => (
            <View style={styles.aiButtonWrapper}>
              <View style={styles.aiButton}>
                <MaterialCommunityIcons name={"sparkles" as any} size={18} color="#4C6793" />
                  <Text style={styles.aiText}>AI</Text>
              </View>
            </View>
          ),
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
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    // Shadow untuk efek floating
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    paddingBottom: Platform.OS === "ios" ? 0 : 10,
    paddingTop: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 5,
  },
  aiButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 15, // Biar mepet kanan seperti di gambar
  },
  aiButton: {
    flexDirection: "row",
    backgroundColor: "#F3F6F9",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  aiText: {
    color: "#4C6793",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 5,
  },
});