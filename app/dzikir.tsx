import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Interface disesuaikan dengan isi JSON yang kamu kirim
interface DzikirItem {
  type: string;
  arab: string;
  indo: string; // Ternyata di JSON namanya "indo"
  ulang: string; // Ada jumlah ulangan (misal: 1x, 3x, 33x)
}

export default function DzikirScreen() {
  const router = useRouter();
  const [dzikirData, setDzikirData] = useState<DzikirItem[]>([]);
  const [filteredData, setFilteredData] = useState<DzikirItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');

  const categories = ['Semua', 'Pagi', 'Sore', 'Solat'];

  useEffect(() => {
    fetchDzikir();
  }, []);

  const fetchDzikir = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://muslim-api-three.vercel.app/v1/dzikir');
      const json = await response.json();
      
      // Berdasarkan JSON kamu, data ada di dalam properti "data"
      const result = json.data || [];
      
      setDzikirData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Gagal ambil data dzikir:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (category: string) => {
    setActiveTab(category);
    if (category === 'Semua') {
      setFilteredData(dzikirData);
    } else {
      // Filter berdasarkan kolom "type" di JSON
      const filtered = dzikirData.filter(item => 
        item.type?.toLowerCase() === category.toLowerCase()
      );
      setFilteredData(filtered);
    }
  };

  const renderItem = ({ item, index }: { item: DzikirItem, index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeGroup}>
          <Text style={styles.indexText}>Dzikir #{index + 1}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
          </View>
        </View>
        {/* Menampilkan jumlah ulangan dari JSON */}
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{item.ulang}</Text>
        </View>
      </View>

      {/* Ambil dari item.arab */}
      <Text style={styles.arabicText}>{item.arab}</Text>
      
      <View style={styles.divider} />
      
      {/* Ambil dari item.indo */}
      <Text style={styles.translationText}>{item.indo}</Text>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.simpanButton}>
          <Ionicons name="bookmark-outline" size={16} color="#4B6B63" />
          <Text style={styles.simpanText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4B6B63" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Dzikir</Text>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#4B6B63" />
        </TouchableOpacity>
      </View>

      <View style={styles.topTabContainer}>
        <TouchableOpacity style={[styles.topTab, styles.topTabActive]}>
          <Text style={styles.topTabTextActive}>Dzikir Harian</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topTab}>
          <Text style={styles.topTabText}>Dzikir Duha</Text>
          <View style={styles.developBadge}>
            <Text style={styles.developText}>DEVELOP</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterBtn, activeTab === cat && styles.filterBtnActive]}
            onPress={() => filterData(cat)}
          >
            <Text style={[styles.filterText, activeTab === cat && styles.filterTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4B6B63" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Dzikir tidak ditemukan</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf6ea' },
  appBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    marginTop: Platform.OS === 'android' ? 30 : 0
  },
  appBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A4A4A' },
  topTabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  topTab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: '#E5E7EB' },
  topTabActive: { borderBottomColor: '#7C9C92' },
  topTabText: { color: '#9CA3AF', fontWeight: '600' },
  topTabTextActive: { color: '#4B6B63', fontWeight: 'bold' },
  developBadge: { backgroundColor: '#FFEDD5', paddingHorizontal: 6, borderRadius: 4, marginTop: 2 },
  developText: { fontSize: 8, color: '#C2410C', fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  filterBtn: { flex: 1, backgroundColor: '#fff', paddingVertical: 8, borderRadius: 8, marginRight: 5, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  filterBtnActive: { backgroundColor: '#4B6B63', borderColor: '#4B6B63' },
  filterText: { fontSize: 12, color: '#4B6B63', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  badgeGroup: { flexDirection: 'row', alignItems: 'center' },
  indexText: { fontSize: 12, color: '#9CA3AF', marginRight: 8 },
  typeBadge: { backgroundColor: '#E1F2EF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  typeBadgeText: { fontSize: 10, color: '#4B6B63', fontWeight: 'bold' },
  countBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  countText: { fontSize: 12, fontWeight: 'bold', color: '#4B6B63' },
  arabicText: { fontSize: 24, textAlign: 'right', color: '#333', lineHeight: 45, marginBottom: 15, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 },
  translationText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  simpanButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  simpanText: { fontSize: 12, color: '#4B6B63', marginLeft: 5, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#9CA3AF' }
});