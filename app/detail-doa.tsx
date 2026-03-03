import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Share,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface DoaDetail {
  id: string;
  judul: string;
  arab: string;
  latin: string;
  terjemah: string;
}

export default function DetailDoaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<DoaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await fetch(`https://open-api.my.id/api/doa/${id}`);
      const json = await response.json();
      // API ini biasanya mengembalikan array berisi satu objek
      const result = Array.isArray(json) ? json[0] : json;
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onShare = async () => {
    if (!data) return;
    try {
      await Share.share({
        message: `${data.judul}\n\n${data.arab}\n\nArtinya: ${data.terjemah}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#4B6B63" /></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4B6B63" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bacaan Doa</Text>
        <TouchableOpacity onPress={onShare}>
          <Ionicons name="share-social-outline" size={24} color="#4B6B63" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{data?.judul}</Text>
          <View style={styles.line} />
          
          <Text style={styles.arabic}>{data?.arab}</Text>
          
          <Text style={styles.label}>Latin</Text>
          <Text style={styles.latin}>{data?.latin}</Text>

          <Text style={styles.label}>Terjemahan</Text>
          <Text style={styles.translation}>{data?.terjemah}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf6ea' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginTop: Platform.OS === 'android' ? 30 : 0 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A4A4A' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 25, elevation: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#4B6B63', textAlign: 'center', marginBottom: 15 },
  line: { height: 1, backgroundColor: '#EEE', marginBottom: 25 },
  arabic: { fontSize: 30, textAlign: 'right', color: '#333', lineHeight: 55, marginBottom: 20, fontFamily: Platform.OS === 'android' ? 'serif' : 'Arial' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#7C9C92', marginTop: 20, marginBottom: 5, textTransform: 'uppercase' },
  latin: { fontSize: 16, color: '#4B6B63', fontStyle: 'italic', lineHeight: 24 },
  translation: { fontSize: 16, color: '#6B7280', lineHeight: 26 }
});