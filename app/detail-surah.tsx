import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, FlatList, ActivityIndicator, 
  SafeAreaView, TouchableOpacity, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// --- STATE GLOBAL (WAJIB EXPORT) ---
export let globalSound: Audio.Sound | null = null;
export let globalIsPlaying = false;
export let globalCurrentSurahId: string | null = null;
export let globalCurrentAyat: number | null = null;
export let globalStopRequest = false;

export default function DetailSurah() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isMounted = useRef(true);
  
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [sync, setSync] = useState({ ayat: null as any, playing: false, id: null as any });

  // 1. FUNGSI STOP
  const stopAudio = async () => {
    globalStopRequest = true;
    globalIsPlaying = false;
    if (globalSound) {
      try {
        await globalSound.stopAsync();
        await globalSound.unloadAsync();
      } catch (e) {}
    }
    globalSound = null;
  };

  // 2. LOGIKA PUTAR & AUTOPLAY (HANDLING BACK ACTION)
  const playFullSurah = async (surahData: any) => {
    if (!surahData?.ayat) return;

    // Toggle Stop jika surah yang sama diklik lagi
    if (Number(globalCurrentSurahId) === Number(surahData.nomor) && globalIsPlaying && globalSound) {
      await stopAudio();
      return;
    }

    await stopAudio();
    globalStopRequest = false;
    globalIsPlaying = true;
    globalCurrentSurahId = String(surahData.nomor);

    try {
      await Audio.setAudioModeAsync({ 
        staysActiveInBackground: true, 
        shouldDuckAndroid: true,
        playsInSilentModeIOS: true 
      });

      for (const ayat of surahData.ayat) {
        if (globalStopRequest || Number(globalCurrentSurahId) !== Number(surahData.nomor)) break;

        globalCurrentAyat = ayat.nomorAyat;

        const { sound } = await Audio.Sound.createAsync(
          { uri: ayat.audio['05'] },
          { shouldPlay: true }
        );
        globalSound = sound;

        await new Promise((resolve) => {
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) resolve(true);
            if (globalStopRequest) resolve(false);
          });
        });

        if (globalSound) { await globalSound.unloadAsync(); globalSound = null; }
      }

      // --- LOGIKA AUTOPLAY NEXT ---
      if (!globalStopRequest && globalIsPlaying) {
        const nextId = Number(surahData.nomor) + 1;
        if (nextId <= 114) {
          globalCurrentSurahId = String(nextId);
          globalCurrentAyat = 1;

          // JIKA MASIH DI DETAIL: Ganti Halaman
          if (isMounted.current) {
            router.replace({ pathname: "/detail-surah", params: { id: String(nextId) } });
          } else {
            // JIKA SUDAH DI LOBBY: Fetch & Play di Background
            const res = await fetch(`https://equran.id/api/v2/surat/${nextId}`);
            const nextJson = await res.json();
            if (nextJson.data) playFullSurah(nextJson.data);
          }
        } else {
          await stopAudio();
        }
      }
    } catch (e) {
      globalIsPlaying = false;
    }
  };

  // 3. MONITOR SYNC
  useEffect(() => {
    const timer = setInterval(() => {
      setSync({ id: globalCurrentSurahId, ayat: globalCurrentAyat, playing: globalIsPlaying });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // 4. FETCH DATA
  useEffect(() => {
    isMounted.current = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://equran.id/api/v2/surat/${id}`);
        const json = await res.json();
        if (isMounted.current) {
          setDetail(json.data);
          // Auto-trigger jika pindah surah (Autoplay)
          if (globalIsPlaying && Number(globalCurrentSurahId) === Number(id) && !globalSound) {
            playFullSurah(json.data);
          }
        }
      } catch (e) {} finally { if (isMounted.current) setLoading(false); }
    };
    loadData();
    return () => { isMounted.current = false; };
  }, [id]);

  const isCurrentSurahActive = sync.playing && Number(sync.id) === Number(id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#4A4A4A" />
        </TouchableOpacity>
        <Text style={styles.title}>{detail?.namaLatin || 'Loading...'}</Text>
        <Text style={styles.arabicHeader}>{detail?.nama}</Text>
      </View>

      {loading ? <ActivityIndicator size="large" color="#C5A358" style={{marginTop: 50}} /> : (
        <FlatList
          data={detail?.ayat}
          keyExtractor={(item) => item.nomorAyat.toString()}
          renderItem={({ item }) => (
            <View style={[styles.ayatCard, (isCurrentSurahActive && sync.ayat === item.nomorAyat) && styles.ayatActive]}>
              <Text style={styles.badgeText}>{item.nomorAyat}</Text>
              <Text style={styles.arabText}>{item.teksArab}</Text>
              <Text style={styles.indoText}>{item.teksIndonesia}</Text>
            </View>
          )}
          ListHeaderComponent={
            <TouchableOpacity 
              style={[styles.btnPlay, isCurrentSurahActive && {backgroundColor: '#C5A358'}]}
              onPress={() => playFullSurah(detail)}
            >
              <Ionicons name={isCurrentSurahActive ? "stop-circle" : "play-circle"} size={26} color="white" />
              <Text style={styles.btnPlayText}>{isCurrentSurahActive ? "Berhenti" : "Putar Full Surah"}</Text>
            </TouchableOpacity>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF7E9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: 'white', paddingTop: 50 },
  backBtn: { padding: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#4A4A4A' },
  arabicHeader: { fontSize: 22, color: '#7B8FA1', fontWeight: 'bold' },
  btnPlay: { flexDirection: 'row', backgroundColor: '#7B8FA1', margin: 20, padding: 16, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnPlayText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  ayatCard: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#F0F0F0' },
  ayatActive: { backgroundColor: '#FFF9E6', borderLeftWidth: 5, borderLeftColor: '#C5A358' },
  badgeText: { color: '#7B8FA1', fontWeight: 'bold', marginBottom: 10 },
  arabText: { fontSize: 26, textAlign: 'right', fontWeight: 'bold', color: '#333', lineHeight: 45 },
  indoText: { marginTop: 12, color: '#666', fontSize: 14, lineHeight: 20 }
});