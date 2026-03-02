import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// 1. Local ThemeProvider supaya modul tidak hilang saat module tidak ditemukan
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Optional: read persisted theme or follow system preference here.
    // Left empty to keep the example simple.
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    // 2. Gunakan ThemeProvider kita sendiri agar state isDark bisa diakses global
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="loading" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="detail-surah" />
        <Stack.Screen 
          name="modal" 
          options={{ presentation: 'modal', title: 'Modal', headerShown: true }} 
        />
      </Stack>
      {/* 3. StatusBar akan otomatis menyesuaikan kontras (light/dark) */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}