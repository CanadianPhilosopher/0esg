 <template>
   <Notification
  v-if="notificationMessage"
  :message="notificationMessage"
  :type="notificationType"
/>

  <div class="login-signup-container">
    <div class="form-section">
      <h2>Log In</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-username">Email Address</label>
          <input type="text" id="login-username" v-model="loginForm.email" placeholder="email@janesfakedomain.net" required>
        </div>
        <div class="form-group password-group">
          <label for="login-password">Password</label>
          <input :type="loginPasswordVisible ? 'text' : 'password'" id="login-password" v-model="loginForm.password" required>
         
        </div>
        <button type="submit" class="button-primary">Log In</button>
      </form>
    </div>

    <div class="separator">or</div>

    <div class="form-section">
      <h2>Sign Up</h2>
      <form @submit.prevent="handleSignup">
        <div class="form-row">
           <div class="form-group">
             <label for="signup-firstname">First name</label>
             <input type="text" id="signup-firstname" v-model="signupForm.firstName" placeholder="Jane" required>
           </div>
           <div class="form-group">
             <label for="signup-lastname">Last name</label>
             <input type="text" id="signup-lastname" v-model="signupForm.lastName" placeholder="Smitherton" required>
           </div>
        </div>
        <div class="form-group">
          <label for="signup-username">Username</label>
          <input type="text" id="signup-username" v-model="signupForm.username" placeholder="Jane123" required>
        </div>
        <div class="form-group">
          <label for="signup-email">Email address</label>
          <input type="email" id="signup-email" v-model="signupForm.email" placeholder="email@janesfakedomain.net" required>
        </div>
        <div class="form-group">
          <label for="signup-phone">Phone Number</label>
          <input type="tel" id="signup-phone" v-model="signupForm.phone" placeholder="+1 415 324 567">
        </div>
         <div class="form-group">
          <label for="signup-password">Password</label>
          <input type="password" id="signup-password" v-model="signupForm.password" required>
        </div>
        <div class="form-group">
          <label for="signup-confirm-password">Confirm Password</label>
          <input type="password" id="signup-confirm-password" v-model="signupForm.confirmPassword" required>
        </div>
        <button type="submit" class="button-primary">Sign Up</button>
      </form>
    </div>
  </div>
 
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import { signUpWithProfile, signIn, getUserProfile } from '../library/auth';
import Notification from '../components/Notification.vue'

const router = useRouter(); // Initialize router

const loginForm = reactive({
  email: '',
  password: ''
});

const signupForm = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

const notificationMessage = ref('');
const notificationType = ref('success');

function showNotification(msg, type = 'success') {
  notificationMessage.value = msg;
  notificationType.value = type;
}


async function handleSignup() {
  if (signupForm.password !== signupForm.confirmPassword) {
    showNotification('Passwords do not match!', 'error')
    return
  }

  const { error } = await signUpWithProfile({
    email: signupForm.email,
    password: signupForm.password,
    username: signupForm.username,
    first_name: signupForm.firstName,
    last_name: signupForm.lastName,
    phone_number: signupForm.phone
  });

  if (error) {
    showNotification(`Signup failed: ${error.message}`, 'error')
  } else {
    showNotification('Signup successful! Check your email to confirm.', 'success')
  }
}

async function handleLogin() {
  const { data, error } = await signIn(loginForm.email, loginForm.password);

  if (error) {
    // Handle specific error for unconfirmed email
    if (error.message.includes('Email not confirmed')) {
       showNotification('Login failed: Please confirm your email address first.', 'error');
    } else {
       showNotification(`Login failed: ${error.message}`, 'error');
    }
  } else {
    // Login successful, fetch profile to confirm everything is okay
    const { profile, error: profileError } = await getUserProfile();

    if (profileError) {
      // Even if login succeeded, profile fetch failed - might indicate an issue
      // e.g., user exists in auth but not in profiles table
      showNotification(`Login succeeded but failed to load profile: ${profileError.message}. Please contact support.`, 'error');
      // Decide if you still want to redirect or handle this differently
      // For now, we won't redirect if the profile is missing/errored
    } else {
      console.log('Logged in as:', profile.username);
      showNotification(`Welcome ${profile.first_name || profile.username}! Redirecting...`, 'success');
      // Redirect to Home page after successful login and profile fetch
      setTimeout(() => {
         router.push({ name: 'Home' }); // Assuming you have a route named 'Home' in src/router.js
      }, 1500); // Short delay to allow user to see the welcome message
    }
  }
}
</script>
