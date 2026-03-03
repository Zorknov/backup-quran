import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Share,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DonasiScreen() {
  const router = useRouter();

  // Fungsi untuk fitur Share
  const onShare = async () => {
    try {
      await Share.share({
        message: 'Mari dukung pengembangan aplikasi Quran ini agar tetap gratis dan tanpa iklan!',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCF6EA" />
      
      {/* HEADER DENGAN PADDING AMAN */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.headerIconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#444" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Dukung Developer</Text>
        
        <TouchableOpacity 
          onPress={onShare} 
          style={styles.headerIconBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="share-social-outline" size={24} color="#444" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollArea}
      >
        
        {/* CARD 1: MILESTONE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Milestone Dukungan</Text>
          <Text style={styles.cardSub}>
            Quran Pesat adalah aplikasi gratis tanpa iklan yang dibuat dengan penuh cinta.
          </Text>

          <View style={styles.milestoneBox}>
            <Text style={styles.milestoneLabel}>Bayar server dan akomodasi</Text>
            
            {/* PROGRESS BAR */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '15%' }]} /> 
            </View>
            
            <View style={styles.progressValueRow}>
              <Text style={styles.progressTextBold}>Rp0</Text>
              <Text style={styles.progressTextMuted}> / Rp50.000.000</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>DUKUNGAN VIA SAWERIA</Text>

        {/* CARD 2: SAWERIA / QR */}
        <View style={styles.card}>
          <Text style={styles.cardTitleSmall}>Scan QR atau buka Saweria</Text>
          <Text style={styles.cardSub}>
            Semua dukungan akan masuk langsung ke halaman Saweria.
          </Text>

          <View style={styles.qrWrapper}>
            {/* Ganti dengan URL QR Saweria kamu sendiri */}
            <Image 
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://saweria.co/quranpesat' }} 
              style={styles.qrImage} 
            />
          </View>

          <TouchableOpacity 
            style={styles.saweriaBtn} 
            activeOpacity={0.8}
            onPress={() => console.log('Link Saweria')}
          >
            <Text style={styles.saweriaBtnText}>Buka Saweria</Text>
          </TouchableOpacity>
        </View>

        {/* CARD 3: CATATAN */}
        <View style={styles.card}>
          <Text style={styles.cardTitleSmall}>Catatan Development & Transparansi</Text>
          <View style={styles.noteItem}>
            <Text style={styles.noteText}>1. Ini dukungan untuk developer, bukan kepuasan pribadi developer.</Text>
          </View>
        </View>

        {/* CARD 4: LEADERBOARD */}
        <View style={[styles.card, { marginBottom: 40 }]}>
          <Text style={styles.cardTitleSmall}>Leaderboard Dukungan</Text>
          <Text style={styles.noteText}>
            Terima kasih untuk para pejuang kebaikan para pendukung donasi...
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6EA',
    // Perbaikan padding status bar agar tidak nempel ke atas
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FCF6EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
  },
  headerIconBtn: {
    padding: 8,
  },
  scrollArea: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 12,
    marginTop: 5,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EDE7D9',
    marginBottom: 16,
    // Shadow halus untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Elevation untuk Android
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
  },
  cardTitleSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 12,
    color: '#7B8FA1',
    lineHeight: 18,
    marginBottom: 15,
  },
  milestoneBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#444',
  },
  milestoneLabel: {
    fontSize: 18,
    // Memperbaiki perbandingan tipe data yang error sebelumnya
    fontFamily: Platform.select({
      android: 'serif',
      ios: 'Georgia',
      default: 'System'
    }),
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  progressBarBg: {
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#444',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C9C92',
    borderRightWidth: 1.5,
    borderColor: '#444',
  },
  progressValueRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressTextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  progressTextMuted: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  qrImage: {
    width: width * 0.55,
    height: width * 0.55,
    resizeMode: 'contain',
  },
  saweriaBtn: {
    backgroundColor: '#7C9C92',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saweriaBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  noteItem: {
    marginTop: 5,
  },
  noteText: {
    fontSize: 13,
    color: '#7B8FA1',
    lineHeight: 20,
  },
});