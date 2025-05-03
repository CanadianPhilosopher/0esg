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
import { supabase } from '../supabaseClient';

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
  setTimeout(() => {
    notificationMessage.value = '';
  }, 3000);
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
    showNotification('Signup successful! Check your email to confirm.', 'success');
    setTimeout(() => {
       router.push({ name: 'Home' }); 
    }, 1500); 
  }
}

async function handleLogin() {
  
  const { data, error } = await signIn(loginForm.email, loginForm.password);

  if (error) {
    if (error.message.includes('Email not confirmed')) {
      showNotification('Login failed: Please confirm your email address first.', 'error');
    } else {
      showNotification(`Login failed: ${error.message}`, 'error');
    }
    return;
  }

  const { profile, error: profileError } = await getUserProfile();

  if (profileError) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: insertError } = await supabase.from('users_profile').insert({
        id: user.id,
        email: user.email,
        username: user.user_metadata.username,
        first_name: user.user_metadata.fullName?.split(' ')[0] || '',
        last_name: user.user_metadata.fullName?.split(' ')[1] || '',
        phone_number: user.user_metadata.phoneNumber || '',
      });

      if (insertError) {
        showNotification(`Login succeeded but failed to create profile: ${insertError.message}`, 'error');
        return;
      }
    } else {
        showNotification('Login succeeded, but no user data found.', 'error');
        return;
    }
  }
  showNotification('Success! You have logged in.', 'success');
  setTimeout(() => {
    router.push({ name: 'Home' });
  }, 1500);
}

</script>
