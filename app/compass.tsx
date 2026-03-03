import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function CompassScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* APP BAR */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#4B6B63" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Arah Kiblat</Text>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#4B6B63" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* INFO LOKASI & INSTRUKSI */}
        <View style={styles.infoSection}>
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={16} color="#4B6B63" />
            <Text style={styles.locationText}>Bogor, Indonesia</Text>
          </View>
          <Text style={styles.instructionText}>Putar ke kiri 161°</Text>
        </View>

        {/* VISUAL KOMPAS GIMMICK */}
        <View style={styles.compassCard}>
          {/* Background Ka'bah (Gimmick) */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1000' }} 
            style={styles.kabahImage}
          />
          
          {/* Layer Overlay agar teks tetap terbaca */}
          <View style={styles.overlay} />

          {/* Marker Titik Penjuru */}
          <View style={[styles.markerDot, { top: 15 }]} />
          <View style={[styles.markerDot, { bottom: 15 }]} />
          <View style={[styles.markerDot, { left: 15 }]} />
          <View style={[styles.markerDot, { right: 15 }]} />

          {/* Jarum Kompas Statis (Rotate Gimmick) */}
          <View style={[styles.needleWrapper, { transform: [{ rotate: '335deg' }] }]}>
            <View style={styles.needleRed} />
            <View style={styles.needleBlue} />
            
            {/* Titik Tengah */}
            <View style={styles.centerHole}>
              <View style={styles.centerCore} />
            </View>

            {/* Icon Ka'bah di Ujung Jarum (Sesuai Gambar) */}
            <View style={styles.miniKabahIcon}>
              <Ionicons name="cube" size={22} color="#1A1A1A" />
            </View>
          </View>
        </View>

        {/* TOMBOL AKSI */}
        <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
          <Text style={styles.cameraBtnText}>Tentukan Kiblat Pakai Kamera</Text>
        </TouchableOpacity>

        {/* FOOTER NOTE */}
        <View style={styles.footerContainer}>
           <Text style={styles.footerText}>
             Jauhkan ponsel dari benda logam agar kompas stabil.
           </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FCF6EA' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: Platform.OS === 'android' ? 30 : 0
  },
  backBtn: { padding: 5 },
  menuBtn: { padding: 5 },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#4A4A4A' 
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F2EF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  locationText: { 
    color: '#4B6B63', 
    fontWeight: '700', 
    marginLeft: 6 
  },
  instructionText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  compassCard: {
    width: width * 0.82,
    height: width * 0.82,
    backgroundColor: '#fff',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.9)'
  },
  kabahImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  markerDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#BDC3C7',
  },
  needleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 220,
  },
  needleRed: {
    width: 6,
    height: 95,
    backgroundColor: '#E74C3C',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  needleBlue: {
    width: 6,
    height: 95,
    backgroundColor: '#3498DB',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  centerHole: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  centerCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4B6B63',
  },
  miniKabahIcon: {
    position: 'absolute',
    top: -35,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  cameraBtn: {
    backgroundColor: '#638A80',
    width: '85%',
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 45,
    alignItems: 'center',
    elevation: 3,
  },
  cameraBtnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  footerContainer: {
    marginTop: 25,
    paddingHorizontal: 50,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18
  }
});