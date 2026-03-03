import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Tipe data untuk Menu
interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  path?: string;
}

export default function LainnyaScreen() {
  const router = useRouter();

  // Data Grid Menu (Sudah diperbaiki dari typo spasi)
  const gridMenu: MenuItem[] = [
    { icon: "book", label: "Al-Quran", path: "/alquran" },
    { icon: "heart", label: "Doa Harian", path: "/doa" },
    { icon: "document-text", label: "Dzikir", path: "/dzikir" },
    { icon: "calculator", label: "Zakat" }, 
    { icon: "sparkles", label: "Arah Kiblat", path: "/compass" },
    { icon: "star", label: "Hadits", path: "/hadist" },
    { icon: "moon", label: "Asmaul Husna", path: "/asmaul" },
    { icon: "ribbon", label: "Daftar Doa" },
    { icon: "calendar", label: "Jadwal" },
    { icon: "compass", label: "Kompas" },
    { icon: "cash", label: "Donasi" },
    { icon: "grid", label: "Lainnya" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER 1: Tombol Kembali & Judul */}
      <View style={styles.headerCard}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
          <Ionicons name="arrow-back" size={20} color="#4B6B63" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lainnya</Text>
        <TouchableOpacity>
          <Ionicons name="settings-sharp" size={22} color="#4B6B63" />
        </TouchableOpacity>
      </View>

      {/* HEADER 2: Info Lokasi/Kalender */}
      <View style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="calendar-outline" size={20} color="#4B6B63" />
        </View>
        <Text style={styles.headerTitle}>Lokasi & Jadwal</Text>
        <TouchableOpacity>
          <Ionicons name="settings-sharp" size={22} color="#4B6B63" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* GRID MENU 4 KOLOM */}
        <View style={styles.gridContainer}>
          {gridMenu.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.gridItem}
              activeOpacity={0.7}
              onPress={() => {
                if (item.path) {
                   router.push(item.path as any);
                }
              }}
            >
              <View style={styles.gridIconBox}>
                <Ionicons name={item.icon} size={24} color="#4B6B63" />
              </View>
              <Text style={styles.gridLabel} numberOfLines={1}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECTION LIST BAWAH */}
        <Text style={styles.sectionTitle}>FITUR TAMBAHAN</Text>

        {/* ITEM LIST: Kalender Hijriah */}
        <TouchableOpacity style={styles.listCard} activeOpacity={0.8}>
          <View style={[styles.iconCircle, { backgroundColor: '#E1F2EF', marginRight: 15 }]}>
            <Ionicons name="calendar" size={22} color="#4B6B63" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>Kalender Hijriah</Text>
            <Text style={styles.listSub}>Lihat penanggalan Islam dan info penting hari ini.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
        </TouchableOpacity>

        {/* ITEM LIST: Kajian Online */}
        <TouchableOpacity style={styles.listCard} activeOpacity={0.8}>
          <View style={[styles.iconCircle, { backgroundColor: '#E1F2EF', marginRight: 15 }]}>
            <Ionicons name="videocam" size={22} color="#4B6B63" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>Zakat Online</Text>
            <Text style={styles.listSub}>Hitung dan tunaikan zakatmu dengan mudah dan aman.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6EA', // Sesuai permintaanmu
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 12,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  gridItem: {
    width: '25%', // 4 kolom (100% / 4)
    alignItems: 'center',
    marginBottom: 20,
  },
  gridIconBox: {
    width: 58,
    height: 58,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  gridLabel: {
    fontSize: 11,
    marginTop: 8,
    color: '#4A4A4A',
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#888',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 1,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 15,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  listSub: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
});