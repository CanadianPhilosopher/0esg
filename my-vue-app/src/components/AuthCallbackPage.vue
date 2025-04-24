<script setup>
import { supabase } from '../supabaseClient'

onMounted(async () => {
  const { data, error } = await supabase.auth.getSessionFromUrl()

  if (error) {
    console.error('Error from URL:', error)
  } else {
    console.log('Session:', data.session)
    // Redirect ke dashboard atau simpan session
  }
})
</script>
