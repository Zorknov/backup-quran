import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  TouchableOpacity, SafeAreaView, Platform, FlatList, ActivityIndicator,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- INTERFACE UNTUK TYPESCRIPT ---
interface Article {
  guid: string;
  title: string;
  pubDate: string;
  author: string;
  description: string;
  thumbnail: string;
  enclosure?: {
    link?: string;
  };
}

const CATEGORIES = ["Semua", "Islam", "Ramadhan", "Ibadah", "Kisah Nabi", "Tafsir"];

export default function ArtikelScreen() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // --- AMBIL DATA DARI API ---
  useEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://republika.co.id/rss/khazanah')
      .then((response) => response.json())
      .then((json) => {
        setArticles(json.items);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // --- RENDER CARD ARTIKEL ---
  const renderArticleCard = ({ item }: { item: Article }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.enclosure?.link || item.thumbnail || 'https://via.placeholder.com/150' }} 
        style={styles.cardImage} 
      />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>KHAZANAH</Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(item.pubDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        
        <Text style={styles.cardSnippet} numberOfLines={2}>
          {item.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.authorText}>{item.author || 'Redaksi Republika'}</Text>
          <TouchableOpacity style={styles.readMoreBtn} activeOpacity={0.7}>
            <Text style={styles.readMoreText}>Baca Selengkapnya</Text>
            <Ionicons name="share-outline" size={14} color="#9CA3AF" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf6ea" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="newspaper-outline" size={28} color="#4A4A4A" />
          <Text style={styles.headerTitle}>Artikel</Text>
        </View>
        <Text style={styles.headerSubtitle}>Berita dan artikel Islami terkini</Text>
      </View>

      {/* CATEGORIES FILTER */}
      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat, index) => (
            <React.Fragment key={cat}>
              <TouchableOpacity onPress={() => setActiveCategory(cat)} style={styles.categoryItem}>
                <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
              {index < CATEGORIES.length - 1 && <Text style={styles.dot}>•</Text>}
            </React.Fragment>
          ))}
        </ScrollView>
      </View>

      {/* LOADING STATE */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#C5A358" />
          <Text style={{ marginTop: 10, color: '#9CA3AF' }}>Mengambil berita...</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.guid}
          renderItem={renderArticleCard}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          // Fitur Pull to Refresh
          onRefresh={() => {
            setLoading(true);
            // Re-fetch logic here
          }}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf6ea' },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 20, 
    marginBottom: 15 
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#4A4A4A', marginLeft: 10 },
  headerSubtitle: { fontSize: 13, color: '#9CA3AF', marginTop: 5 },
  
  categoryWrapper: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
  categoryScroll: { paddingHorizontal: 20, alignItems: 'center' },
  categoryItem: { paddingVertical: 8 },
  categoryText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  categoryTextActive: { color: '#C5A358', fontWeight: 'bold' },
  dot: { marginHorizontal: 8, color: '#D1D5DB' },

  listPadding: { padding: 20, paddingBottom: 30 },
  card: { 
    backgroundColor: 'white', 
    borderRadius: 15, 
    marginBottom: 20, 
    overflow: 'hidden',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 } 
  },
  cardImage: { width: '100%', height: 200, resizeMode: 'cover' },
  cardContent: { padding: 15 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  categoryBadgeText: { fontSize: 10, color: '#9CA3AF', fontWeight: 'bold' },
  dateText: { fontSize: 11, color: '#9CA3AF' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#4A4A4A', lineHeight: 22, marginBottom: 10 },
  cardSnippet: { fontSize: 12, color: '#6B7280', lineHeight: 18 },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 15, 
    paddingTop: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#F9FAFB' 
  },
  authorText: { fontSize: 11, color: '#9CA3AF' },
  readMoreBtn: { flexDirection: 'row', alignItems: 'center' },
  readMoreText: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' }
});