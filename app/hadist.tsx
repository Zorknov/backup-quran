import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Interface data API
interface HaditsItem {
  number: number;
  title: string;
  arab: string;
  indo: string;
}

export default function HaditsScreen() {
  const router = useRouter();
  const [haditsData, setHaditsData] = useState<HaditsItem[]>([]);
  const [filteredData, setFilteredData] = useState<HaditsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHadits();
  }, []);

  const fetchHadits = async () => {
    try {
      const response = await fetch('https://muslim-api-three.vercel.app/v1/hadits');
      const json = await response.json();
      
      // Pastikan json.data ada dan berbentuk array
      const result = Array.isArray(json.data) ? json.data : [];
      setHaditsData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching hadits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredData(haditsData);
      return;
    }
    const filtered = haditsData.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Komponen Card
  const renderItem = ({ item }: { item: HaditsItem }) => {
    // Safety check supaya tidak crash kalau ada data item yang null
    if (!item) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.haditsTitle} numberOfLines={1}>
            {item.title || "Tanpa Judul"}
          </Text>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>#{item.number}</Text>
          </View>
        </View>

        <Text style={styles.arabicText}>{item.arab}</Text>
        <Text style={styles.translationText}>{item.indo}</Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.simpanButton} activeOpacity={0.7}>
            <Ionicons name="bookmark-outline" size={16} color="#4B6B63" />
            <Text style={styles.simpanText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconPadding}>
          <Ionicons name="arrow-back" size={24} color="#4B6B63" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Hadits</Text>
        <TouchableOpacity style={styles.iconPadding}>
          <Ionicons name="bookmark-outline" size={24} color="#4B6B63" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari judul hadits..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4B6B63" />
          <Text style={styles.loadingText}>Memuat Hadits...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => item?.number?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Tambahan: jika data kosong
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Hadits tidak ditemukan.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF6EA' },
  appBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    marginTop: Platform.OS === 'android' ? 30 : 0
  },
  iconPadding: { padding: 5 },
  appBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A4A4A' },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    padding: 20, 
    marginBottom: 15, 
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  haditsTitle: { fontSize: 15, fontWeight: '700', color: '#374151', flex: 1 },
  numberBadge: { backgroundColor: '#E1F2EF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  numberText: { fontSize: 11, color: '#4B6B63', fontWeight: 'bold' },
  arabicText: { fontSize: 22, textAlign: 'right', color: '#333', lineHeight: 40, marginBottom: 15 },
  translationText: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  simpanButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  simpanText: { fontSize: 12, color: '#4B6B63', marginLeft: 6, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { marginTop: 10, color: '#4B6B63' },
  emptyText: { color: '#9CA3AF' }
});