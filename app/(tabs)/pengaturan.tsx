import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Switch, 
  TouchableOpacity, SafeAreaView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- TEMA WARNA CUSTOM ---
type Colors = {
  bg: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  accent: string;
};

const lightColors: Colors = {
  bg: '#fcf6ea',    // Warna Krem Gading pilihanmu
  card: '#FFFFFF',  // Putih bersih untuk kontainer
  text: '#4A4A4A',  // Abu-abu gelap agar nyaman dibaca
  subText: '#9CA3AF',
  border: '#F3F4F6',
  accent: '#C5A358', // Warna Emas Premium
};

const darkColors: Colors = {
  bg: '#1A1A1A',
  card: '#262626',
  text: '#F9FAFB',
  subText: '#9CA3AF',
  border: '#333333',
  accent: '#C5A358',
};

// Hook Tema Lokal
export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = useCallback(() => setIsDark(v => !v), []);
  const colors = isDark ? darkColors : lightColors;
  return { isDark, toggleTheme, colors };
};

export default function PengaturanScreen() {
  const { isDark, toggleTheme, colors } = useTheme();

  // Komponen Reusable untuk List Item
  const SettingItem = ({ icon, title, subtitle, onPress, toggle = false, value = false, onValueChange = () => {} }: any) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={onPress} 
      disabled={toggle}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#333' : '#fcf6ea' }]}>
        <Ionicons name={icon} size={22} color={colors.accent} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.itemSubtitle, { color: colors.subText }]}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: "#D1D5DB", true: colors.accent }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pengaturan</Text>

        {/* Section: Akun / Profil */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.profileContainer}>
            <View style={[styles.avatar, { backgroundColor: isDark ? '#333' : '#fcf6ea' }]}>
              <Ionicons name="person" size={30} color={colors.accent} />
            </View>
            <View style={styles.profileText}>
              <Text style={[styles.loginTitle, { color: colors.text }]}>Masuk Akun</Text>
              <Text style={[styles.loginSubtitle, { color: colors.subText }]}>Simpan bookmark di cloud</Text>
              <View style={[styles.badge, { backgroundColor: isDark ? '#444' : '#FFF9E6' }]}>
                <Text style={[styles.badgeText, { color: colors.accent }]}>PRO VERSION</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.accent }]}>
              <Text style={styles.loginButtonText}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Fitur */}
        <Text style={styles.sectionLabel}>PREFERENSI</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <SettingItem 
            icon="moon-outline" 
            title="Mode Gelap" 
            subtitle="Ganti tema aplikasi"
            toggle={true}
            value={isDark} 
            onValueChange={toggleTheme} 
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem 
            icon="notifications-outline" 
            title="Notifikasi" 
            subtitle="Ayat harian & pengingat" 
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem 
            icon="text-outline" 
            title="Ukuran Huruf" 
            subtitle="Atur besar kecilnya teks Arab" 
          />
        </View>

        {/* Section: Lainnya */}
        <Text style={styles.sectionLabel}>LAINNYA</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <SettingItem icon="star-outline" title="Beri Rating" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem icon="share-social-outline" title="Bagikan Aplikasi" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem icon="shield-checkmark-outline" title="Kebijakan Privasi" />
        </View>

        {/* Info Versi */}
        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: colors.subText }]}>Quran App v1.0.0</Text>
          <Text style={[styles.footerText, { color: colors.subText }]}>Zorknov</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  headerTitle: { 
    fontSize: 28, fontWeight: 'bold', 
    marginTop: Platform.OS === 'android' ? 60 : 20, marginBottom: 25 
  },
  sectionLabel: { 
    fontSize: 11, fontWeight: 'bold', color: '#9CA3AF', 
    marginTop: 30, marginBottom: 12, letterSpacing: 1.5 
  },
  card: { 
    borderRadius: 20, overflow: 'hidden', 
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 15, 
    shadowOffset: { width: 0, height: 5 } 
  },
  profileContainer: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  avatar: { 
    width: 60, height: 60, borderRadius: 30, 
    justifyContent: 'center', alignItems: 'center' 
  },
  profileText: { flex: 1, marginLeft: 15 },
  loginTitle: { fontSize: 18, fontWeight: 'bold' },
  loginSubtitle: { fontSize: 12, marginTop: 2 },
  badge: { 
    alignSelf: 'flex-start', paddingHorizontal: 8, 
    paddingVertical: 3, borderRadius: 6, marginTop: 6 
  },
  badgeText: { fontSize: 9, fontWeight: 'bold' },
  loginButton: { 
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, justifyContent: 'center' 
  },
  loginButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconWrapper: { 
    width: 42, height: 42, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center' 
  },
  textWrapper: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSubtitle: { fontSize: 12, marginTop: 3 },
  divider: { height: 1, marginHorizontal: 20 },
  footer: { marginTop: 40, alignItems: 'center' },
  versionText: { fontSize: 12, fontWeight: '600' },
  footerText: { fontSize: 11, marginTop: 5 }
});