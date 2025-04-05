<template>
  <div id="app-wrapper">
    <AppHeader />
    <main class="main-content">
      <ContentCard
        title="Sweet Baby Inc. detected: What actually happened and why should you care?"
        source-name="theshortcut.com"
        source-icon="https://via.placeholder.com/30/FF0000/FFFFFF?text=S"
        text-content="What started the Sweet Baby Inc. backlash? The controversy began after a Sweet Baby Inc. employee Chris Kindred highlighted a Steam Curator group called 'Sweet Baby Inc. Detected' on X (formerly known as Twitter). Kindred has since deleted these posts but they've been documented below. Sweet Baby Inc. has become the focus of some gamers' ire on social media, but what happened and why should you care? Here's everything you need to know about the latest discourse in the gaming industry from an impartial and fact-based viewpoint."
        :tags="['Event', 'Criminal Behaviour']"
      />

      <ContentCard
        title="Complaint Regarding YouTube Platform Experience"
        source-name="Joshua"
        source-icon="https://via.placeholder.com/30/8B4513/FFFFFF?text=J"
        text-content="I am writing to express my dissatisfaction with the current YouTube platform experience. Lately, I've noticed a significant decline in the quality of recommendations, often receiving irrelevant or repetitive suggestions despite my viewing history and preferences. Furthermore, the frequency and intrusiveness of advertisements have become excessive, often disrupting the viewing experience significantly. This combination makes navigating and enjoying content increasingly frustrating. I request that you investigate these concerns regarding the recommendation algorithms and ad placement policies to improve the overall user experience on the platform."
        :tags="['Review', 'Customer Support Issues']"
      />

       <ContentCard
        title="Estimated Losses Per Year (Column Chart)"
        chart-type="column"
        :tags="['Data']"
      />

      <ContentCard
        title="Estimated Losses by Related Initiative Focus (Bar Chart)"
        chart-type="bar"
        :tags="['Data']"
      />

      <ContentCard
        title="Estimated Losses by Related Initiative Focus (Pie Chart)"
        chart-type="pie"
        :tags="['Data']"
      />

      <EventList />

    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import ContentCard from './components/ContentCard.vue';

// Data for cards could be fetched or defined here if more complex
import EventList from './components/EventList.vue'; // Adjust path if needed

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

