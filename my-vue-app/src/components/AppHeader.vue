<template>
    <header class="app-header">
      <div class="logo"> <img src="../assets/img_logo 1.svg" alt="OESG Logo" class="logo-image"> </div>
      <nav class="navigation">
        <router-link to= "/" class="icon-button"> <img src="../assets/home-icon.svg" alt="Home"> </router-link>
        <router-link to= "/writedata" class="icon-button"> <img src="../assets/img-pen.svg" alt="Write"> </router-link>
        <button class="icon-button"><img src="../assets/img-bar.svg" alt="Data"> </button>
        <button class="icon-button"><img src="../assets/img-search.svg" alt="Search"> </button>
        <button class="icon-button"><img src="../assets/img-lonceng.svg" alt="Notification"> </button>
        <button class="icon-button"><img src="../assets/img-menu.svg" alt="Menu"> </button>
        <button id="theme-toggle" class="icon-button" aria-label="Toggle light/dark theme"><img src="../assets/img-bulb.svg" alt="☀️/🌙"> </button>
      </nav>
      <!-- Conditional Log In / Log Out button -->
      <router-link v-if="!userLoggedIn" to="/login" class="login-button">Log In</router-link>
      <button v-else @click="handleLogout" class="login-button">Log Out</button>
    </header>
  </template>

  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter, RouterLink } from 'vue-router';
  import { supabase } from '../supabaseClient'; // Import supabase client
  import { signOut } from '../library/auth'; // Import signOut function

  const router = useRouter();
  const userLoggedIn = ref(false); // Reactive state for login status
  let authListener = null; // To store the auth state change listener

  // Function to handle logout
  async function handleLogout() {
    try {
      const { error } = await signOut();
      if (error) throw error;
      // No need to manually set userLoggedIn to false here,
      // the onAuthStateChange listener will handle it.
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
      // Optionally show a notification to the user
    }
  }

  onMounted(async () => {
    // 1. Check initial session state
    try {
      const { data: { session } } = await supabase.auth.getSession();
      userLoggedIn.value = !!session; // Set initial login state
    } catch (error) {
        console.error("Error checking initial session:", error);
        userLoggedIn.value = false;
    }


    // 2. Listen for auth state changes (login, logout)
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session); // Debug log
      userLoggedIn.value = event === 'SIGNED_IN';
    });
    authListener = data.subscription; // Store the subscription object
  });

  // Clean up the listener when the component is unmounted
  onUnmounted(() => {
    if (authListener) {
      authListener.unsubscribe();
      console.log('Auth listener unsubscribed.'); // Debug log
    }
  });
  </script>
