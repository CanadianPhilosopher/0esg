import { supabase } from '@/supabaseClient';

/**
 * Signup user & create profile
 */
export async function signUpWithProfile(formData) {
  const { email, password, ...profile } = formData;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
          full_name: `${formData.first_name} ${formData.last_name}`,
          username: formData.username,
          phone_number: formData.phone_number
        }
      }
  });

  if (error) return { error };

  const userId = data.user.id;

  const { error: profileError } = await supabase.from('users_profile').insert({
    id: userId,
    ...profile
  });

  if (profileError) return { error: profileError };

  return { data };
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

  if (error) return { error };

  const { data: profile, error: profileError } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) return { error: profileError };

  return { profile };
}

/**
 * Logout
 */
export async function signOut() {
  return await supabase.auth.signOut();
}
