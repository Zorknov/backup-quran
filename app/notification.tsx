import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifSettings, setNotifSettings] = useState({
    sholat: true,
    dzikirPagi: true,
    dzikirPetang: false,
    ayatHariIni: true,
  });

  const toggleSwitch = (key: keyof typeof notifSettings) => {
    setNotifSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const NotifRow = ({ icon, title, sub, value, onToggle, color = "#4B6B63" }: any) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subText}>{sub}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: "#D1D5DB", true: "#7C9C92" }}
        thumbColor={value ? "#4B6B63" : "#F4F3F4"}
        ios_backgroundColor="#D1D5DB"
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Memastikan Status Bar terlihat bersih */}
      <StatusBar barStyle="dark-content" backgroundColor="#FCF6EA" />
      
      {/* HEADER dengan Padding Aman */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backBtn}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#444" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollArea}
      >
        <Text style={styles.sectionLabel}>PENGINGAT IBADAH</Text>

        <NotifRow
          icon="notifications-outline"
          title="Waktu Sholat"
          sub="Ingatkan saat masuk waktu Adzan"
          value={notifSettings.sholat}
          onToggle={() => toggleSwitch("sholat")}
        />

        <NotifRow
          icon="sunny-outline"
          title="Dzikir Pagi"
          sub="Pengingat dzikir jam 05:00"
          value={notifSettings.dzikirPagi}
          onToggle={() => toggleSwitch("dzikirPagi")}
          color="#EAB308"
        />

        <NotifRow
          icon="moon-outline"
          title="Dzikir Petang"
          sub="Pengingat dzikir jam 17:30"
          value={notifSettings.dzikirPetang}
          onToggle={() => toggleSwitch("dzikirPetang")}
          color="#6366F1"
        />

        <Text style={[styles.sectionLabel, { marginTop: 25 }]}>KONTEN HARIAN</Text>

        <NotifRow
          icon="book-outline"
          title="Ayat Hari Ini"
          sub="Dapatkan 1 ayat Al-Quran setiap pagi"
          value={notifSettings.ayatHariIni}
          onToggle={() => toggleSwitch("ayatHariIni")}
          color="#EC4899"
        />

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color="#7C9C92" />
          <Text style={styles.infoText}>
            Notifikasi membantu kamu tetap istiqomah dalam beribadah setiap hari.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FCF6EA",
    // Tambahkan padding atas khusus untuk iOS/Android agar tidak nempel status bar
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EDE7D9",
    backgroundColor: "#FCF6EA",
  },
  backBtn: { 
    padding: 5,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#444" 
  },
  scrollArea: { 
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: "700", 
    color: "#9CA3AF", 
    letterSpacing: 1, 
    marginBottom: 15,
    marginLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE7D9",
    marginBottom: 12,
  },
  cardLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1 
  },
  iconBox: { 
    width: 42, 
    height: 42, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 15 
  },
  textContainer: { 
    flex: 1 
  },
  titleText: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#444" 
  },
  subText: { 
    fontSize: 12, 
    color: "#9CA3AF", 
    marginTop: 2 
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9F6",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  infoText: { 
    fontSize: 12, 
    color: "#4B6B63", 
    marginLeft: 10, 
    flex: 1, 
    lineHeight: 18 
  },
});