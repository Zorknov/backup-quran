import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, FlatList, ActivityIndicator, 
  SafeAreaView, TouchableOpacity, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
// Fallback useTheme hook (remove broken import if ../context/ThemeContext is missing)
const useTheme = () => ({
  colors: { bg: '#FFFFFF', text: '#111827', border: '#E5E7EB' },
  isDark: false,
});

export default function DetailSurah() {
  const { nomor } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const [isFullPlaying, setIsFullPlaying] = useState(false);
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const isStopPressed = useRef(false);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/surat/${nomor}`)
      .then((res) => res.json())
      .then((json) => {
        setDetail(json.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));

    return () => { stopAudioGlobal(); };
  }, [nomor]);

  const stopAudioGlobal = async () => {
    isStopPressed.current = true;
    setIsFullPlaying(false);
    setPlayingAyat(null);
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch (e) { console.log(e); }
    }
  };

  const playAyatSync = async (url: string, nomorAyat: number) => {
    return new Promise(async (resolve) => {
      try {
        if (soundRef.current) await soundRef.current.unloadAsync();
        setPlayingAyat(nomorAyat);
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
        soundRef.current = newSound;
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingAyat(null);
            resolve(true); 
          }
        });
      } catch (error) { resolve(false); }
    });
  };

  async function handleFullSurahPlay() {
    if (isFullPlaying) { await stopAudioGlobal(); return; }
    isStopPressed.current = false;
    setIsFullPlaying(true);
    for (const ayat of detail.ayat) {
      if (isStopPressed.current) break; 
      await playAyatSync(ayat.audio['05'], ayat.nomorAyat);
    }
    setIsFullPlaying(false);
  }

  const renderAyat = ({ item }: { item: any }) => (
    <View style={[styles.ayatCard, { borderBottomColor: colors.border }]}>
      <View style={styles.ayatHeader}>
        <View style={[styles.ayatNumberBadge, { backgroundColor: playingAyat === item.nomorAyat ? '#C5A358' : '#7B8FA1' }]}>
          <Text style={styles.ayatNumberText}>{item.nomorAyat}</Text>
        </View>
        <View style={styles.ayatActions}>
          <TouchableOpacity style={{ marginRight: 20 }} onPress={() => playAyatSync(item.audio['05'], item.nomorAyat)}>
            <Ionicons 
              name={playingAyat === item.nomorAyat ? "pause-circle" : "play-outline"} 
              size={26} 
              color={playingAyat === item.nomorAyat ? "#C5A358" : "#7B8FA1"} 
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={22} color="#7B8FA1" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.arabicText, { color: colors.text }]}>{item.teksArab}</Text>
      <Text style={[styles.latinText, { color: isDark ? '#C5A358' : '#7B8FA1' }]}>{item.teksLatin}</Text>
      <Text style={[styles.translationText, { color: isDark ? '#9CA3AF' : '#4A4A4A' }]}>{item.teksIndonesia}</Text>
    </View>
  );

  if (loading) return <View style={[styles.loader, { backgroundColor: colors.bg }]}><ActivityIndicator size="large" color="#C5A358" /></View>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={async () => { await stopAudioGlobal(); router.back(); }}>
          <Ionicons name="arrow-back" size={24} color="#7B8FA1" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{detail.namaLatin}</Text>
          <Text style={styles.headerSubtitle}>{detail.arti} • {detail.jumlahAyat} Ayat</Text>
        </View>
        <Text style={[styles.headerArabic, { color: isDark ? '#C5A358' : '#7B8FA1' }]}>{detail.nama}</Text>
      </View>

      <FlatList
        data={detail.ayat}
        keyExtractor={(item) => item.nomorAyat.toString()}
        renderItem={renderAyat}
        ListHeaderComponent={
          <TouchableOpacity 
            style={[styles.playAllButton, { backgroundColor: isFullPlaying ? '#C5A358' : '#7B8FA1' }]}
            onPress={handleFullSurahPlay}
          >
            <Ionicons name={isFullPlaying ? "stop-circle" : "volume-medium-outline"} size={20} color="white" />
            <Text style={styles.playAllText}>{isFullPlaying ? "Berhenti" : "Putar Full Surah"}</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: Platform.OS === 'android' ? 45 : 20, borderBottomWidth: 1 },
  headerTitleContainer: { flex: 1, marginLeft: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 11, color: '#9CA3AF' },
  headerArabic: { fontSize: 20, fontWeight: 'bold' },
  playAllButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 20, padding: 12, borderRadius: 10 },
  playAllText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  ayatCard: { padding: 20, borderBottomWidth: 1 },
  ayatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  ayatNumberBadge: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  ayatNumberText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  ayatActions: { flexDirection: 'row', alignItems: 'center' },
  arabicText: { fontSize: 26, textAlign: 'right', fontWeight: 'bold', lineHeight: 45, marginBottom: 15 },
  latinText: { fontSize: 14, fontStyle: 'italic', marginBottom: 8 },
  translationText: { fontSize: 14, lineHeight: 22 },
});