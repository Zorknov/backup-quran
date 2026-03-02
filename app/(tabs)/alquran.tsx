import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TextInput, 
  ActivityIndicator, SafeAreaView, Platform, TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Import context tema
// Local fallback theme hook replacing missing '../../context/ThemeContext'
const useTheme = () => ({
  colors: {
    bg: '#FFFFFF',
    text: '#111827',
    card: '#F9FAFB',
    border: '#E5E7EB'
  },
  isDark: false
});

export default function AlQuranScreen() {
  const [loading, setLoading] = useState(true);
  const [surahs, setSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();
  // Ambil warna dinamis
  const { colors, isDark } = useTheme();

  useEffect(() => {
    fetch('https://equran.id/api/v2/surat')
      .then((res) => res.json())
      .then((json) => {
        setSurahs(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err);
        setLoading(false);
      });
  }, []);

  const filteredSurahs = surahs.filter((s: any) => 
    s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSurah = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.surahItem} 
      activeOpacity={0.7}
      onPress={() => router.push({
        pathname: '/detail-surah',
        params: { nomor: item.nomor }
      })}
    >
      <View style={styles.numberWrapper}>
        <View style={[styles.starFrame, { backgroundColor: colors.card, borderColor: '#C5A358' }]}>
          <Text style={[styles.numberText, { color: colors.text }]}>{item.nomor}</Text>
        </View>
      </View>

      <View style={styles.infoWrapper}>
        <Text style={[styles.surahName, { color: colors.text }]}>{item.namaLatin}</Text>
        <Text style={styles.surahDetail}>{item.arti} • {item.jumlahAyat} Ayat</Text>
      </View>

      <View style={styles.arabicWrapper}>
        <Text style={[styles.arabicTitle, { color: isDark ? '#C5A358' : '#7B8FA1' }]}>{item.nama}</Text>
        <Text style={styles.locationText}>{item.tempatTurun.toLowerCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <View style={styles.mainContainer}>
        
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Ionicons name="book" size={26} color="#7B8FA1" />
            <Text style={[styles.appTitle, { color: colors.text }]}>Al-Quran</Text>
          </View>
          <View style={styles.headerIcons}>
            <Ionicons name="bookmark-outline" size={24} color="#7B8FA1" style={{ marginRight: 15 }} />
            <Ionicons name="settings-outline" size={24} color="#7B8FA1" />
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Cari surah..." 
            style={[styles.input, { color: colors.text }]}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#C5A358" />
          </View>
        ) : (
          <FlatList
            data={filteredSurahs}
            keyExtractor={(item) => item.nomor.toString()}
            renderItem={renderSurah}
            ItemSeparatorComponent={() => <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  mainContainer: { flex: 1, paddingTop: Platform.OS === 'android' ? 45 : 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15, alignItems: 'center' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 12 },
  headerIcons: { flexDirection: 'row' },
  searchBar: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, paddingHorizontal: 15, 
    borderRadius: 12, alignItems: 'center', height: 48, elevation: 3, shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  surahItem: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  numberWrapper: { width: 45, justifyContent: 'center' },
  starFrame: {
    width: 32, height: 32, borderWidth: 1.5, borderRadius: 6, 
    transform: [{ rotate: '45deg' }], justifyContent: 'center', alignItems: 'center'
  },
  numberText: { transform: [{ rotate: '-45deg' }], fontSize: 11, fontWeight: 'bold' },
  infoWrapper: { flex: 1, marginLeft: 18 },
  surahName: { fontSize: 17, fontWeight: 'bold' },
  surahDetail: { fontSize: 12, color: '#9CA3AF', marginTop: 3 },
  arabicWrapper: { alignItems: 'flex-end' },
  arabicTitle: { fontSize: 22, fontWeight: 'bold' },
  locationText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textTransform: 'capitalize' },
  divider: { height: 1, marginHorizontal: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});