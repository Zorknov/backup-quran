import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Switch, 
  TouchableOpacity, SafeAreaView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import context tema
// Simple local useTheme fallback (replaces missing ../context/ThemeContext)
type Colors = {
  bg: string;
  card: string;
  text: string;
  border: string;
};

type ThemeResult = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: Colors;
};

const lightColors: Colors = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  text: '#111827',
  border: '#E5E7EB',
};

const darkColors: Colors = {
  bg: '#0B1220',
  card: '#0F1724',
  text: '#F9FAFB',
  border: '#1F2937',
};

export const useTheme = (): ThemeResult => {
  const [isDark, setIsDark] = React.useState(false);
  const toggleTheme = React.useCallback(() => setIsDark(v => !v), []);
  const colors = isDark ? darkColors : lightColors;
  return { isDark, toggleTheme, colors };
};

export default function PengaturanScreen() {
  // Mengambil state dan warna dari Context
  const { isDark, toggleTheme, colors } = useTheme();

  // Komponen Helper untuk Baris Pengaturan
  const SettingItem = ({ icon, title, subtitle, onPress, toggle = false, value = false, onValueChange = () => {} }: any) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={onPress} 
      disabled={toggle}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#333' : '#F9FAFB' }]}>
        <Ionicons name={icon} size={22} color="#7B8FA1" />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: "#D1D5DB", true: "#C5A358" }}
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

        {/* Section: Akun */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.profileContainer}>
            <View style={[styles.avatar, { backgroundColor: isDark ? '#333' : '#F3F4F6' }]}>
              <Ionicons name="person" size={30} color="#7B8FA1" />
            </View>
            <View style={styles.profileText}>
              <Text style={[styles.loginTitle, { color: colors.text }]}>Masuk Akun</Text>
              <Text style={styles.loginSubtitle}>Sync bookmark & progress</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>DEVELOP</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.loginButton}>
              <Ionicons name="log-in-outline" size={18} color="white" />
              <Text style={styles.loginButtonText}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Notifikasi */}
        <Text style={styles.sectionLabel}>NOTIFIKASI</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <SettingItem 
            icon="notifications-outline" 
            title="Pengaturan Notifikasi" 
            subtitle="Waktu sholat, ayat harian" 
          />
        </View>

        {/* Section: Tampilan */}
        <Text style={styles.sectionLabel}>TAMPILAN</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <SettingItem 
            icon="moon-outline" 
            title="Mode Gelap" 
            subtitle="Tampilan lebih nyaman di malam hari"
            toggle={true}
            value={isDark} 
            onValueChange={toggleTheme} 
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem 
            icon="text-outline" 
            title="Ukuran Font Arab" 
            subtitle="Sedang" 
          />
        </View>

        {/* Section: Dukungan */}
        <Text style={styles.sectionLabel}>DUKUNGAN</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <SettingItem icon="cash-outline" title="Dukung Developer" subtitle="Kontribusi untuk biaya maintenance" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem icon="star-outline" title="Beri Rating" subtitle="Bantu kami memberikan rating" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem icon="share-social-outline" title="Bagikan Aplikasi" subtitle="Ajak teman menggunakan aplikasi ini" />
        </View>

        {/* Section: Tentang */}
        <Text style={styles.sectionLabel}>TENTANG</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <SettingItem icon="shield-checkmark-outline" title="Kebijakan Privasi" />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  headerTitle: { 
    fontSize: 26, fontWeight: 'bold', 
    marginTop: Platform.OS === 'android' ? 55 : 20, marginBottom: 20 
  },
  sectionLabel: { 
    fontSize: 12, fontWeight: 'bold', color: '#9CA3AF', 
    marginTop: 25, marginBottom: 10, letterSpacing: 1 
  },
  card: { 
    borderRadius: 16, overflow: 'hidden', elevation: 2, 
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 } 
  },
  profileContainer: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  avatar: { 
    width: 55, height: 55, borderRadius: 27.5, 
    justifyContent: 'center', alignItems: 'center' 
  },
  profileText: { flex: 1, marginLeft: 15 },
  loginTitle: { fontSize: 17, fontWeight: 'bold' },
  loginSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  badge: { 
    backgroundColor: '#FDE68A', alignSelf: 'flex-start', 
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 5 
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#B45309' },
  loginButton: { 
    backgroundColor: '#7B8FA1', flexDirection: 'row', 
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' 
  },
  loginButtonText: { color: 'white', fontWeight: 'bold', fontSize: 13, marginLeft: 5 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  iconWrapper: { 
    width: 38, height: 38, borderRadius: 10, 
    justifyContent: 'center', alignItems: 'center' 
  },
  textWrapper: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 15, fontWeight: '600' },
  itemSubtitle: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  divider: { height: 1, marginLeft: 65 }
});