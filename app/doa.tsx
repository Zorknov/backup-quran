import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Tipe data disesuaikan dengan JSON API Anda
interface DoaItem {
  id: number;
  judul: string;
  arab: string;
  latin: string;
  terjemah: string;
}

export default function DoaScreen() {
  const router = useRouter();
  const [doaData, setDoaData] = useState<DoaItem[]>([]);
  const [filteredData, setFilteredData] = useState<DoaItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoa();
  }, []);

  const fetchDoa = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://open-api.my.id/api/doa');
      const data = await response.json();
      
      // Mengambil data dari array JSON
      if (Array.isArray(data)) {
        setDoaData(data);
        setFilteredData(data);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = doaData.filter(item => 
      item.judul.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderItem = ({ item, index }: { item: DoaItem, index: number }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => {
        router.push({
          pathname: "/detail-doa",
          params: { id: item.id }
        } as any);
      }}
    >
      {/* HEADER CARD */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <View style={styles.numberCircle}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
          <Text style={styles.doaTitle}>{item.judul}</Text>
        </View>
        <Ionicons name="chevron-forward-circle" size={24} color="#7C9C92" />
      </View>

      {/* ISI DOA (MUNCUL SEMUA) */}
      <View style={styles.contentContainer}>
        <Text style={styles.arabicMain}>{item.arab}</Text>
        <View style={styles.divider} />
        <Text style={styles.translationMain}>{item.terjemah}</Text>
      </View>

      <Text style={styles.tapInfo}>Ketuk untuk melihat teks latin</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf6ea" />
      
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4B6B63" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Doa Harian</Text>
        <TouchableOpacity onPress={fetchDoa}>
          <Ionicons name="refresh" size={24} color="#4B6B63" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Cari doa harian..."
            style={styles.input}
            value={search}
            onChangeText={handleSearch}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4B6B63" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf6ea' },
  appBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginTop: Platform.OS === 'android' ? 30 : 0 },
  appBarTitle: { fontSize: 20, fontWeight: 'bold', color: '#4A4A4A' },
  searchSection: { paddingHorizontal: 20, marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, height: 50, elevation: 2 },
  input: { flex: 1, marginLeft: 10, fontSize: 14, color: '#333' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', flex: 0.9 },
  numberCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#7C9C92', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  numberText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  doaTitle: { fontSize: 16, fontWeight: 'bold', color: '#4A4A4A' },
  
  contentContainer: { paddingVertical: 5 },
  arabicMain: { fontSize: 26, color: '#333', textAlign: 'right', lineHeight: 48, fontFamily: Platform.OS === 'android' ? 'serif' : 'Arial' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
  translationMain: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  tapInfo: { fontSize: 10, color: '#CCC', textAlign: 'center', marginTop: 15, fontStyle: 'italic' }
});