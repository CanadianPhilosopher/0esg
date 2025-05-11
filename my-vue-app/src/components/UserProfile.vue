<template>
    <div class="profile-container">
      <h2>User Profile</h2>
  
      <div v-if="loading" class="loading-message">
        Loading profile...
      </div>
  
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
  
      <div v-if="profile && !loading && !error" class="profile-details">
        <div class="profile-item avatar-item">
          <label>Avatar:</label>
          <img :src="profile.avatar_url || defaultAvatar" alt="User Avatar" class="avatar-image" />
        </div>

        <div class="profile-item">
          <label>Username:</label>
          <span>{{ profile.username }}</span>
        </div>
        <div class="profile-item">
          <label>Email:</label>
          <span>{{ userEmail }}</span> 
        </div>
        <div class="profile-item">
          <label>First Name:</label>
          <span>{{ profile.first_name || '-' }}</span> 
        </div>
        <div class="profile-item">
          <label>Last Name:</label>
          <span>{{ profile.last_name || '-' }}</span>
        </div>
        <div class="profile-item">
          <label>Phone Number:</label>
          <span>{{ profile.phone_number || '-' }}</span>
        </div>
        <div class="profile-item">
          <label>Last Updated:</label>
          <span>{{ profile.updated_at ? new Date(profile.updated_at).toLocaleString() : '-' }}</span>
        </div>
  
        <!-- Anda bisa menambahkan tombol Edit Profile di sini nanti -->
        <!-- <button @click="goToEditProfile">Edit Profile</button> -->
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { supabase } from '../supabaseClient'; 
  import { getUserProfile } from '../library/auth'; 
  import defaultAvatar from '../assets/img-profile.svg';
  
  const profile = ref(null);
  const userEmail = ref('');
  const loading = ref(true);
  const error = ref(null);
  
  onMounted(async () => {
    loading.value = true;
    error.value = null;
    profile.value = null; 
  
    try {
      // 1. Dapatkan sesi pengguna saat ini untuk email
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) {
          throw new Error("User not logged in.");
      }
      userEmail.value = session.user.email || 'Email not available';
  
      const { data: fetchedProfile, error: profileError } = await getUserProfile();

      if (profileError) throw profileError;
  
      if (fetchedProfile) {
        profile.value = fetchedProfile;
      } else {
        
        profile.value = { username: 'N/A', first_name: '', last_name: '', phone_number: '', updated_at: null }; 
        console.warn("Profile data not found for this user.");
        // error.value = "Profile details not found."; // Atau tampilkan error
      }
  
    } catch (err) {
      console.error('Error fetching profile:', err);
      error.value = `Failed to load profile: ${err.message}`;
      profile.value = null; // Pastikan profile null jika error
    } finally {
      loading.value = false;
    }
  });
  
  
 
  const router = useRouter();
  function goToEditProfile() {
    router.push('/edit-profile');
  }
  
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .loading-message,
  .error-message {
    text-align: center;
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 4px;
  }
  
  .loading-message {
    color: #555;
  }
  
  .error-message {
    color: #d9534f; /* Merah untuk error */
    background-color: #f2dede;
    border: 1px solid #ebccd1;
  }
  
  .profile-details {
    margin-top: 1rem;
  }
  
  .profile-item {
    display: flex;
    justify-content: space-between;
    padding: 0.8rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .profile-item:last-child {
    border-bottom: none;
  }
  
  .profile-item label {
    font-weight: bold;
    color: #555;
    margin-right: 1rem;
  }
  
  .profile-item span {
    color: #333;
    text-align: right;
  }
  
  /* Style untuk tombol edit jika ditambahkan */
  /*
  button {
    display: block;
    width: fit-content;
    margin: 2rem auto 0;
    padding: 0.7rem 1.5rem;
    background-color: #5cb85c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  button:hover {
    background-color: #4cae4c;
  }
  */
  </style>
