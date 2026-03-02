import React, { useEffect, useState, type ComponentProps } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  ImageBackground,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PrayerTimings = {
  Fajr?: string;
  Dhuhr?: string;
  Asr?: string;
  Maghrib?: string;
  Isha?: string;
};

type DoaType = {
  name: string;
  time: string;
  text: string;
  count: number;
  liked: boolean;
};

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimings>({});
  const [nextPrayer, setNextPrayer] = useState("");
  const [countdown, setCountdown] = useState("");

  const [doaList, setDoaList] = useState<DoaType[]>([
    {
      name: "suiaoa",
      time: "2 jam lalu",
      text: "Ya Allah, sembuhkanlah ibuku dari segala penyakitnya dan angkat rasa sakitnya. Aamiin.",
      count: 124,
      liked: false,
    },
    {
      name: "rahmat23",
      time: "5 jam lalu",
      text: "Ya Rabb, mudahkan rezekiku dan jauhkan aku dari kesulitan hidup.",
      count: 87,
      liked: false,
    },
    {
      name: "aisyah",
      time: "1 hari lalu",
      text: "Semoga Ramadhan ini menjadi jalan hijrahku menuju pribadi yang lebih baik.",
      count: 203,
      liked: false,
    },
    {
      name: "farhan",
      time: "3 hari lalu",
      text: "Ya Allah, jadikan keluargaku keluarga yang sakinah dan selalu dalam lindungan-Mu.",
      count: 65,
      liked: false,
    },
  ]);

  const handleAamiin = (index: number) => {
    const updated = [...doaList];

    if (updated[index].liked) {
      updated[index].count -= 1;
    } else {
      updated[index].count += 1;
    }

    updated[index].liked = !updated[index].liked;
    setDoaList(updated);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Bogor&country=Indonesia&method=11"
    )
      .then((res) => res.json())
      .then((data) => {
        setPrayerTimes(data.data.timings);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!prayerTimes.Fajr) return;

    const prayers = [
      { name: "Subuh", time: prayerTimes.Fajr },
      { name: "Dzuhur", time: prayerTimes.Dhuhr },
      { name: "Ashar", time: prayerTimes.Asr },
      { name: "Maghrib", time: prayerTimes.Maghrib },
      { name: "Isya", time: prayerTimes.Isha },
    ];

    const now = new Date();

    for (let i = 0; i < prayers.length; i++) {
      if (!prayers[i].time) continue;

      const [hour, minute] = prayers[i].time!.split(":");

      const prayerDate = new Date();
      prayerDate.setHours(parseInt(hour));
      prayerDate.setMinutes(parseInt(minute));
      prayerDate.setSeconds(0);

      if (prayerDate > now) {
        setNextPrayer(prayers[i].name);

        const diff = prayerDate.getTime() - now.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
        break;
      }
    }
  }, [currentTime, prayerTimes]);

  const prayerList = [
    { label: "Subuh", value: prayerTimes.Fajr },
    { label: "Dzuhur", value: prayerTimes.Dhuhr },
    { label: "Ashar", value: prayerTimes.Asr },
    { label: "Maghrib", value: prayerTimes.Maghrib },
    { label: "Isya", value: prayerTimes.Isha },
  ];

  type IoniconsName = ComponentProps<typeof Ionicons>["name"];

  const menuItems: { icon: IoniconsName; label: string }[] = [
    { icon: "book-outline", label: "Al-Quran" },
    { icon: "heart-outline", label: "Doa Harian" },
    { icon: "sparkles-outline", label: "Dzikir Duha" },
    { icon: "document-text-outline", label: "Hadits" },
    { icon: "compass-outline", label: "Arah Kiblat" },
    { icon: "cash-outline", label: "Donasi" },
    { icon: "star-outline", label: "Asmaul Husna" },
    { icon: "grid-outline", label: "Lainnya" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.headerWrapper}>
          <ImageBackground
            source={require("../../assets/images/element.png")}
            style={styles.header}
            resizeMode="cover"
          >
            <View style={styles.overlay} />

            <Text style={styles.hijri}>12 Ramadhan 1447 H</Text>

            <Text style={styles.date}>
              {currentTime.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>

            <Text style={styles.location}>Bogor, Indonesia</Text>

            <View style={styles.timeWrapper}>
              <Text style={styles.time}>
                {currentTime.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <Text style={styles.countdown}>
              {nextPrayer} dalam {countdown}
            </Text>

            <View style={styles.prayerRow}>
              {prayerList.map((item, index) => (
                <View key={index} style={styles.prayerItem}>
                  <Text style={styles.prayerName}>{item.label}</Text>
                  <Text style={styles.prayerTime}>
                    {item.value?.slice(0, 5) || "--:--"}
                  </Text>
                </View>
              ))}
            </View>
          </ImageBackground>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Cari surat, doa, artikel, hadits ..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={22} color="#4B6B63" />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BANNER */}
        <View style={styles.banner}>
          <Ionicons name="moon-outline" size={22} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.bannerTitle}>Ramadhan Mubarak!</Text>
            <Text style={styles.bannerSub}>
              Selamat menjalankan ibadah puasa
            </Text>
          </View>
        </View>

        {/* DOA SECTION */}
        <View style={styles.doaSection}>
          <Text style={styles.doaTitle}>Aminkan doa saudaramu</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {doaList.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.doaCard}
                activeOpacity={0.9}
              >
                <View style={styles.userRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.doaUser}>{item.name}</Text>
                    <Text style={styles.doaTime}>{item.time}</Text>
                  </View>
                </View>

                <Text style={styles.doaContent}>{item.text}</Text>

                <TouchableOpacity
                  style={[
                    styles.aamiinSmall,
                    item.liked && { backgroundColor: "#4B6B63" },
                  ]}
                  activeOpacity={0.6}
                  onPress={() => handleAamiin(index)}
                >
                  <Text
                    style={[
                      styles.aamiinSmallText,
                      item.liked && { color: "#fff" },
                    ]}
                  >
                    🤲 {item.count}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 5,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FCF6EA" },

  headerWrapper: {
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  header: {
    paddingTop:
      Platform.OS === "android"
        ? (StatusBar.currentHeight || 0) + 20
        : 60,
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  hijri: { color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  date: { color: "#E5E7EB", fontSize: 14, marginBottom: 4 },
  location: { color: "#E5E7EB", fontSize: 12, marginBottom: 22 },

  timeWrapper: {
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 10,
  },

  time: { fontSize: 50, fontWeight: "700", color: "#fff" },

  countdown: {
    textAlign: "center",
    color: "#E5E7EB",
    marginBottom: 28,
    fontSize: 13,
  },

  prayerRow: { flexDirection: "row", justifyContent: "space-between" },
  prayerItem: { alignItems: "center" },
  prayerName: { color: "#E5E7EB", fontSize: 12 },
  prayerTime: { color: "#fff", fontSize: 12, fontWeight: "600", marginTop: 3 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 25,
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 14,
    ...shadowStyle,
  },

  input: { marginLeft: 8, flex: 1, fontSize: 14 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 30,
  },

  menuItem: { width: "22%", alignItems: "center", marginBottom: 28 },

  iconBox: {
    width: 58,
    height: 58,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...shadowStyle,
  },

  menuText: { fontSize: 12, marginTop: 8, textAlign: "center" },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7C9C92",
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 18,
    borderRadius: 16,
  },

  bannerTitle: { color: "#fff", fontWeight: "700", fontSize: 14 },
  bannerSub: { color: "#E5E7EB", fontSize: 12, marginTop: 2 },

  doaSection: { marginBottom: 40 },

  doaTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 20,
    marginBottom: 15,
  },

  doaCard: {
    width: 260,
    backgroundColor: "#fff",
    marginLeft: 20,
    padding: 18,
    borderRadius: 18,
    ...shadowStyle,
  },

  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4B6B63",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: { color: "#fff", fontWeight: "bold" },
  doaUser: { fontSize: 14, fontWeight: "700" },
  doaTime: { fontSize: 11, color: "#6B7280" },
  doaContent: { fontSize: 13, lineHeight: 18, marginBottom: 12 },

  aamiinSmall: {
    alignSelf: "flex-start",
    backgroundColor: "#E6F2EF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  aamiinSmallText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B6B63",
  },
});