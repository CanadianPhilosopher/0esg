import { supabase } from '@/supabaseClient';

/**
 * Signup user & create profile
 */
export async function signUpWithProfile({email, password, username, first_name, last_name, phone_number, avatarFile}) {
 // return await supabase.auth.signUp({

 const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    //phone: formData.phone, 
    options: {
        data: {
          username,
          first_name,
          last_name,
          phone_number 
        }
      }
  });

  if (error) return { error };
  const userId = signUpData.user?.id;
  const user = signUpData.user;
  if (!userId) {
    return { error: new Error('User ID not available. Check if email confirmation is required.') };
  }
  let avatarUrl = null;
  if (avatarFile) {
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`public/${userId}`, avatarFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      return { error: uploadError };
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(`public/${userId}`);
    
    avatarUrl = publicUrlData.publicUrl;
  }

  const { error: profileError } = await supabase.from('users_profile').insert({
    id: userId,
    email,
    username,
    first_name,
    last_name,
    phone_number,
    avatar_url: avatarUrl
  });

  return { error: profileError };
}


export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function getUserProfile() {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log("Current user:", user);
  if (userError || !user) {
    console.error("No user or user fetch error:", userError);
    return { data: null, error: userError || new Error("No user found") };
  }

  const { data: profile, error: profileError } = await supabase
    .from("users_profile")
    .select("*")
    .eq("id", user.id)
    .maybeSingle(); // ✅ prevents the "multiple or no rows" crash
  console.log("Fetched profile:", profile);

  if (profileError) {
    console.error("Failed to load profile:", profileError.message);
    return { data: null, error: profileError };
  }

  if (!profile) {
    console.warn("No profile found for user:", user.id);
    return { data: null, error: new Error("Profile not found") };
  }

  return { data: profile, error: null };
}


/**
 * Logout
 */
export async function signOut() {
  return await supabase.auth.signOut();
}
