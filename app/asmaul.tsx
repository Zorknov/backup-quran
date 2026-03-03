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
interface AsmaulHusnaItem {
  urutan: number;
  latin: string;
  arab: string;
  arti: string;
}

export default function AsmaulHusnaScreen() {
  const router = useRouter();
  const [data, setData] = useState<AsmaulHusnaItem[]>([]);
  const [filteredData, setFilteredData] = useState<AsmaulHusnaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAsmaulHusna();
  }, []);

  const fetchAsmaulHusna = async () => {
    try {
      const response = await fetch('https://asmaul-husna-api.vercel.app/api/all');
      const json = await response.json();
      
      // Mengambil array dari json.data
      const result = Array.isArray(json.data) ? json.data : [];
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching Asmaul Husna:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter((item) =>
      item.latin.toLowerCase().includes(text.toLowerCase()) ||
      item.arti.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderItem = ({ item }: { item: AsmaulHusnaItem }) => (
    <View style={styles.card}>
      <Text style={styles.numberText}>{item.urutan}</Text>
      <Text style={styles.arabicText}>{item.arab}</Text>
      <Text style={styles.latinText} numberOfLines={1}>{item.latin}</Text>
      <Text style={styles.translationText} numberOfLines={2}>{item.arti}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4B6B63" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Asmaul Husna</Text>
        <TouchableOpacity onPress={fetchAsmaulHusna} style={styles.refreshButton}>
          <Ionicons name="refresh" size={22} color="#4B6B63" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari arab, latin, arti..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4B6B63" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.urutan.toString()}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Data tidak ditemukan.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fcf6ea' 
  },
  appBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    marginTop: Platform.OS === 'android' ? 30 : 0
  },
  backButton: { padding: 5 },
  refreshButton: { padding: 5 },
  appBarTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#4A4A4A' 
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  listContent: { 
    paddingHorizontal: 12, 
    paddingBottom: 20 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 12, 
    margin: 6, 
    flex: 1/3, // Membuat 3 kolom rata
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  numberText: { 
    fontSize: 10, 
    color: '#9CA3AF', 
    position: 'absolute', 
    top: 8, 
    left: 8 
  },
  arabicText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8,
    textAlign: 'center'
  },
  latinText: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#4B6B63', 
    textAlign: 'center' 
  },
  translationText: { 
    fontSize: 10, 
    color: '#6B7280', 
    textAlign: 'center', 
    marginTop: 4 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { 
    color: '#9CA3AF', 
    marginTop: 20 
  }
});