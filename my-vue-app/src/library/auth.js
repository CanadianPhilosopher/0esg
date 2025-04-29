import { supabase } from '@/supabaseClient';

/**
 * Signup user & create profile
 */
export async function signUpWithProfile(formData) {
  const { email, password, ...profile } = formData;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    phone: formData.phone, 
    options: {
        data: {
          full_name: `${formData.first_name} ${formData.last_name}`,
          username: formData.username,
          phoneNumber: formData.phone, 
        }
      }
  });

  if (error) return { error };
  return {data};
}

/**
 * Login user
 */
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Get current user profile
 */
export async function getUserProfile() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  // Return immediately if there's an error getting the user or if no user is found
  if (error || !user) {
    return { user: null, profile: null, error: error || new Error('User not found.') };
  }

  // User is authenticated, now try to get the profile
  const { data: profile, error: profileError } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Return profile error if it occurs, but still include the user object
  if (profileError) {
    return { user, profile: null, error: profileError };
  }

  // Return user and profile (profile might be null if .maybeSingle() found nothing)
  return { user, profile, error: null };
}

/**
 * Logout
 */
export async function signOut() {
  return await supabase.auth.signOut();
}
