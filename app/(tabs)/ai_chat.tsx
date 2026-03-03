import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, 
  TouchableOpacity, KeyboardAvoidingView, Platform, 
  StatusBar, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';

export default function AsistenIslamiScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: 1, text: "Assalamualaikum! Saya Asisten Islami AI. Ada yang bisa saya bantu?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // SEMBUNYIKAN NAVBAR
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({ tabBarStyle: { display: 'none' } });
    }
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: { 
            display: 'flex', 
            backgroundColor: '#fff', 
            height: 60,
            borderTopWidth: 1,
            borderTopColor: '#F2EADD'
          },
        });
      }
    };
  }, [navigation]);

  const handleSend = (text: string) => {
    if (text.trim() === '') return;
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        text: "Maa syaa Allah, pertanyaan yang bagus. Mari kita pelajari bersama...",
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCF6EA" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#444" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.aiIconSmall}>
            <Ionicons name="sparkles" size={16} color="white" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Asisten Islami AI</Text>
            <Text style={styles.headerSub}>{isTyping ? 'Sedang mengetik...' : 'Online'}</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        // Offset ini yang mengatur agar input tidak terlalu melayang ke atas
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          style={styles.chatArea}
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.msgWrap, msg.sender === 'user' ? styles.userWrap : styles.aiWrap]}>
              <View style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={{ color: msg.sender === 'user' ? '#fff' : '#444', fontSize: 15 }}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
          {isTyping && <Text style={styles.typingIndicator}>AI sedang memikirkan jawaban...</Text>}
        </ScrollView>

        {/* INPUT AREA - FIX POSISI */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputBar}>
            <TextInput 
              style={styles.input} 
              placeholder="Tanya sesuatu..." 
              placeholderTextColor="#9CA3AF"
              value={input} 
              onChangeText={setInput}
              multiline={true}
            />
            <TouchableOpacity 
              onPress={() => handleSend(input)} 
              style={[styles.sendBtn, { backgroundColor: input.trim() ? '#4B6B63' : '#CBD5E1' }]}
              disabled={!input.trim()}
            >
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FCF6EA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50 
  },
  header: {
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EDE7D9',
  },
  headerTitleContainer: { flexDirection: 'row', marginLeft: 15, alignItems: 'center' },
  aiIconSmall: { backgroundColor: '#7C9C92', padding: 6, borderRadius: 10, marginRight: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  headerSub: { fontSize: 11, color: '#7B8FA1' },
  backBtn: { padding: 5 },

  chatArea: { flex: 1, paddingHorizontal: 20 },
  msgWrap: { marginVertical: 6, maxWidth: '85%' },
  userWrap: { alignSelf: 'flex-end' },
  aiWrap: { alignSelf: 'flex-start' },
  bubble: { padding: 14, borderRadius: 20 },
  userBubble: { backgroundColor: '#4B6B63', borderTopRightRadius: 4 },
  aiBubble: { backgroundColor: '#fff', borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#EDE7D9' },
  typingIndicator: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', marginTop: 5 },

  // FIX: Mengatur container input agar tetap di bawah dan rapi
  inputWrapper: { 
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20, // Jarak aman dari bawah layar
    backgroundColor: '#FCF6EA',
    borderTopWidth: 1,
    borderTopColor: '#EDE7D9'
  },
  inputBar: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    paddingHorizontal: 15, 
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#EDE7D9',
    // Shadow tipis biar elegan
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: '#444',
    maxHeight: 100,
    paddingRight: 10
  },
  sendBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
  }
});