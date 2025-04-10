import { createApp } from 'vue';
import router from './router'; // Import the router
import './style.css';
import App from './App.vue';
import { supabase } from './supabaseClient'; // Import Supabase client

const app = createApp(App);
// --- Navigation Guard ---
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    // Check Supabase for current user session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      // Decide how to handle error, maybe redirect to login or show error
      next({ name: 'Login' }); // Redirect to login on error
    } else if (!session) {
      // No active session, redirect to login
      next({ name: 'Login' });
    } else {
      // User is authenticated, proceed to the route
      next();
    }
  } else {
    // Route does not require auth, proceed
    next();
  }
});
// --- End Navigation Guard ---

app.use(router); // Tell the app to use the router

app.mount('#app');
