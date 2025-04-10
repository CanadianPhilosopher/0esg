<template>
  <div id="app-wrapper">
    <AppHeader />
    <main class="main-content">
      <Suspense>
        <template #default>
          <router-view></router-view> <!-- Router will render the current page component here -->
        </template>
        <template #fallback>
          <div>Loading...</div> <!-- Optional: Show a loading message -->
        </template>
      </Suspense>
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
// ContentCard and EventList are no longer directly used here, they belong to the HomePage route component
// import ContentCard from './components/ContentCard.vue';
// import EventList from './components/EventList.vue'; // Adjust path if needed

import { onMounted } from 'vue'; // Impor jika menggunakan <script setup> di App.vue

/**
 * Mengatur tema awal dan menambahkan event listener untuk tombol toggle.
 * @param {string} toggleButtonId - ID dari elemen tombol untuk toggle tema.
 */
function setupThemeToggle(toggleButtonId = 'theme-toggle') {
  const toggleButton = document.getElementById(toggleButtonId);
  const htmlElement = document.documentElement; // Target elemen <html>

  /**
   * Menerapkan tema berdasarkan preferensi tersimpan atau preferensi OS.
   */
  const applyInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    let useDarkTheme = false;

    if (savedTheme) {
      // Gunakan tema yang tersimpan jika ada
      useDarkTheme = savedTheme === 'dark';
    } else {
      // Jika tidak ada, cek preferensi OS
      useDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    htmlElement.classList.toggle('dark', useDarkTheme);
    // Anda tidak perlu class .light karena light adalah default tanpa .dark
  };

  /**
   * Meng-handle klik pada tombol toggle.
   */
  const handleToggleClick = () => {
    const isCurrentlyDark = htmlElement.classList.toggle('dark');
    // Simpan pilihan baru ke localStorage
    localStorage.setItem('theme', isCurrentlyDark ? 'dark' : 'light');
  };

  /**
   * Mendengarkan perubahan preferensi OS saat runtime.
   * Hanya mengubah tema jika pengguna belum menentukan pilihan secara manual.
   */
  const handleOSPreferenceChange = (event) => {
    if (!localStorage.getItem('theme')) { // Hanya jika tidak ada tema tersimpan
      htmlElement.classList.toggle('dark', event.matches);
    }
  };

  // --- Eksekusi ---

  // 1. Terapkan tema awal saat komponen dimuat
  applyInitialTheme();

  // 2. Tambahkan listener ke tombol jika tombolnya ada
  if (toggleButton) {
    toggleButton.addEventListener('click', handleToggleClick);
  } else {
    console.warn(`Tombol toggle tema dengan ID #${toggleButtonId} tidak ditemukan.`);
  }

  // 3. (Opsional) Dengarkan perubahan preferensi OS
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  // Pastikan listener lama dihapus jika fungsi ini dipanggil ulang (jarang terjadi di setup)
  mediaQuery.removeEventListener('change', handleOSPreferenceChange); // Hapus listener lama
  mediaQuery.addEventListener('change', handleOSPreferenceChange);   // Tambah listener baru
}


// --- Cara Menggunakan di Vue <script setup> (misal di App.vue) ---
onMounted(() => {
  setupThemeToggle(/* biarkan default 'theme-toggle' atau ganti ID jika perlu */);
});

// --- Cara Menggunakan di main.js (tanpa <script setup>) ---
// import { createApp } from 'vue'
// import App from './App.vue'
// import './style.css' // Impor CSS Anda
//
// const app = createApp(App)
// app.mount('#app')
//
// // Panggil setelah aplikasi di-mount atau segera
// setupThemeToggle();
// Data for cards could be fetched or defined here if more complex

</script>
