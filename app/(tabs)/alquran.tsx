import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TextInput, 
  ActivityIndicator, TouchableOpacity, StatusBar, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { globalIsPlaying, globalCurrentSurahId } from '../detail-surah'; 

export default function AlQuranScreen() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sync, setSync] = useState({ id: null as any, playing: false });
  const router = useRouter();

  useEffect(() => {
    fetch('https://equran.id/api/v2/surat').then(res => res.json()).then(json => {
      setSurahs(json.data);
      setLoading(false);
    });

    const interval = setInterval(() => {
      setSync({ id: globalCurrentSurahId, playing: globalIsPlaying });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const renderSurah = ({ item }: { item: any }) => {
    const isActive = sync.playing && Number(item.nomor) === Number(sync.id);

    return (
      <TouchableOpacity 
        onPress={() => router.push({ pathname: "/detail-surah", params: { id: String(item.nomor) } })}
        style={[styles.card, isActive && styles.cardActive]}
        activeOpacity={0.7}
      >
        <View style={[styles.numContainer, isActive && styles.numActive]}>
          <Text style={[styles.numText, isActive && { color: '#FFF' }]}>{item.nomor}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.name, isActive && { color: '#C5A358' }]}>{item.namaLatin}</Text>
          <Text style={styles.subText}>{item.arti.toUpperCase()} • {item.jumlahAyat} AYAT</Text>
        </View>

        <View style={styles.rightAction}>
          {isActive ? (
            <View style={styles.playingIcon}>
              <Ionicons name="stats-chart" size={18} color="#C5A358" />
            </View>
          ) : (
            <Text style={styles.arabText}>{item.nama}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={styles.headerLobby}>
        <View>
          <Text style={styles.greeting}>Baca Hari Ini,</Text>
          <Text style={styles.titleLobby}>Al-Quran</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerIcon} 
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#C5A358" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput 
            placeholder="Cari Surah..." 
            style={styles.input} 
            onChangeText={setSearch} 
            placeholderTextColor="#9CA3AF" 
          />
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#C5A358" />
        </View>
      ) : (
        <FlatList
          data={surahs.filter(s => s.namaLatin.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={item => item.nomor.toString()}
          renderItem={renderSurah}
          extraData={sync} 
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {sync.playing && (
        <TouchableOpacity 
          activeOpacity={0.9}
          style={styles.miniPlayer}
          onPress={() => router.push({ pathname: "/detail-surah", params: { id: String(sync.id) } })}
        >
          <View style={styles.miniPlayerInfo}>
            <View style={styles.musicIconCircle}>
              <Ionicons name="musical-notes" size={18} color="white" />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.miniTextLabel}>Sedang Diputar</Text>
              <Text style={styles.miniTextSurah} numberOfLines={1}>
                {surahs.find(s => Number(s.nomor) === Number(sync.id))?.namaLatin}
              </Text>
            </View>
          </View>
          <Ionicons name="play-circle" size={35} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FCF6EA', 
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 40 
  },
  headerLobby: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 25, 
    paddingTop: 20,
    paddingBottom: 10
  },
  greeting: { fontSize: 15, color: '#7B8FA1', fontWeight: '500' },
  titleLobby: { fontSize: 26, fontWeight: '800', color: '#4B6B63' },
  headerIcon: { backgroundColor: '#FFF', padding: 10, borderRadius: 12 }, // Shadow dihapus
  
  searchSection: { paddingHorizontal: 20, marginVertical: 15 },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: 'white', 
    paddingHorizontal: 15, 
    height: 55,
    borderRadius: 16,
    // Shadow & Elevation dihapus
  },
  input: { flex: 1, fontSize: 16, color: '#444' },
  
  listContent: { paddingHorizontal: 20, paddingBottom: 150 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: 'white', 
    marginBottom: 12, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EDE7D9', // Border halus pengganti shadow
    // Shadow & Elevation dihapus
  },
  cardActive: { 
    borderColor: '#C5A358', 
    borderWidth: 1.5,
    backgroundColor: '#FFFDF5' 
  },
  numContainer: { width: 42, height: 42, backgroundColor: '#F8F4E8', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  numActive: { backgroundColor: '#C5A358' },
  numText: { fontSize: 14, fontWeight: '700', color: '#7B8FA1' },
  
  infoContainer: { flex: 1, marginLeft: 15 },
  name: { fontSize: 17, fontWeight: '700', color: '#444' },
  subText: { fontSize: 11, color: '#999', marginTop: 3 },
  
  rightAction: { alignItems: 'flex-end' },
  arabText: { fontSize: 20, color: '#4B6B63', fontWeight: 'bold' },
  playingIcon: { backgroundColor: '#FFF9E6', padding: 8, borderRadius: 10 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  miniPlayer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 20, 
    right: 20, 
    backgroundColor: '#4B6B63', 
    padding: 15, 
    borderRadius: 24, 
    flexDirection: 'row', 
    alignItems: 'center',
    // Shadow & Elevation pada mini player bisa tetap ada agar "melayang", 
    // tapi jika mau dihapus total, kabari ya!
    elevation: 5 
  },
  miniPlayerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  musicIconCircle: { backgroundColor: '#C5A358', padding: 8, borderRadius: 50 },
  miniTextLabel: { color: '#E5E7EB', fontSize: 10, fontWeight: 'bold' },
  miniTextSurah: { color: 'white', fontWeight: 'bold', fontSize: 15 }
});