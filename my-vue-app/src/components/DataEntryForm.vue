<template>
  <div class="data-entry-container">
    <h2>Submit New Data Entry</h2>
    <Notification
      v-if="notification.message"
      :message="notification.message"
      :type="notification.type"
    />
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="formData.title" required>
      </div>
      <div class="form-group">
        <label for="year">Year</label>
        <!-- Assuming year maps to date_happened, might need adjustment -->
        <input type="number" id="year" v-model="formData.year" placeholder="YYYY" required>
      </div>
      <div class="form-group">
        <label for="producer">Producer</label>
        <input type="text" id="producer" v-model="formData.producer" required>
      </div>
      <div class="form-group">
        <label for="source">Source</label>
        <input type="text" id="source" v-model="formData.source" placeholder="https://..." required>
      </div>
      <div class="form-group">
        <label for="industry">Industry</label>
        <!-- Needs options populated -->
        <select id="industry" v-model="formData.industry">
          <option disabled value="">Select Industry</option>
          <!-- Add industry options here -->
        </select>
      </div>
       <div class="form-group">
        <label for="type">Type</label>
         <!-- Needs options populated -->
        <select id="type" v-model="formData.type">
           <option disabled value="">Select Type</option>
           <!-- Add type options here -->
        </select>
      </div>
       <div class="form-group">
        <label for="related-initiative">Related Initiative Focus</label>
         <!-- Needs options populated -->
        <select id="related-initiative" v-model="formData.relatedInitiative">
           <option disabled value="">Select</option>
           <!-- Add initiative options here -->
        </select>
      </div>
      <div class="form-group">
        <label for="tags">Tags (comma-separated)</label>
        <input type="text" id="tags" v-model="formData.tags">
      </div>
      <div class="form-group">
        <label for="description">Description (Optional)</label>
        <textarea id="description" v-model="formData.description"></textarea>
      </div>
      <button type="submit" class="button-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabaseClient';
import { getUserProfile } from '../library/auth';
import Notification from './Notification.vue'; // Import Notification component

const router = useRouter();
const isSubmitting = ref(false);

const formData = reactive({
  title: '',
  year: new Date().getFullYear(), // Default to current year
  producer: '',
  source: '',
  industry: '',
  type: '',
  relatedInitiative: '',
  tags: '',
  description: ''
});

const notification = reactive({
  message: '',
  type: 'success' // 'success' or 'error'
});

function showNotification(msg, type = 'success') {
  notification.message = msg;
  notification.type = type;
  // Optionally clear notification after some time
  setTimeout(() => {
    notification.message = '';
  }, 5000);
}

async function handleSubmit() {
  isSubmitting.value = true;
  notification.message = ''; // Clear previous notifications

  try {
    // 1. Get User ID (ensure user is logged in - handled by route guard later)
    const { profile, error: profileError } = await getUserProfile();
    if (profileError || !profile) {
      throw new Error(profileError?.message || 'You must be logged in to submit data.');
    }
    const userId = profile.id;

    // 2. Prepare data for Supabase (Map form fields to table columns)
    //    NOTE: Adjust column names and data types as per your 'anti_consumer_event' table schema
    const eventData = {
      event_headline: formData.title,
      date_happened: `${formData.year}-01-01`, // Assuming YYYY format, store as date start of year
      producer: formData.producer,
      source1: formData.source, // Assuming source maps to source1
      // industry: formData.industry, // Add if column exists
      // type: formData.type, // Add if column exists
      // related_initiative: formData.relatedInitiative, // Add if column exists
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Store tags as array if column type is text[]
      event_description: formData.description,
      user_id: userId // Link the event to the user who submitted it
      // product: ??? // Need to determine where 'product' comes from if needed for EventList display
    };

    // 3. Insert data into Supabase
    const { error: insertError } = await supabase
      .from('anti_consumer_event')
      .insert([eventData]); // insert expects an array

    if (insertError) {
      throw insertError;
    }

    // 4. Success: Show notification and redirect
    showNotification('Data submitted successfully!', 'success');
    // Clear form (optional)
    Object.keys(formData).forEach(key => formData[key] = ''); // Reset form
    formData.year = new Date().getFullYear(); // Reset year

    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push({ name: 'Home' });
    }, 1500);

  } catch (error) {
    console.error('Error submitting data:', error);
    showNotification(`Error: ${error.message}`, 'error');
  } finally {
    isSubmitting.value = false;
  }
}

// TODO: Populate select options (Industry, Type, Related Initiative)
// This could be done by fetching data from Supabase or defining static lists
</script>
