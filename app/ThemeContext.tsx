import React, { createContext, useContext, useState } from 'react';

// Membuat "wadah" untuk tema
const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  // Fungsi untuk ganti tema
  const toggleTheme = () => setIsDark(!isDark);

  // Definisi warna untuk masing-masing mode
  const colors = {
    bg: isDark ? '#121212' : '#FDF7E9',        // Latar belakang utama
    card: isDark ? '#1E1E1E' : '#FFFFFF',      // Warna kartu & search bar
    text: isDark ? '#FFFFFF' : '#4A4A4A',      // Warna teks utama
    border: isDark ? '#333333' : '#EEEEEE',    // Warna garis tipis
    subText: '#9CA3AF',                        // Warna teks tambahan
    primary: '#C5A358',                        // Warna emas/aksen
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook agar halaman lain bisa mengambil warna dengan mudah
export const useTheme = () => useContext(ThemeContext);