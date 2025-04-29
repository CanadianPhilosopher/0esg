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
        <label for="producer">Publisher</label>
        <input type="text" id="publisher" v-model="formData.publisher" required>
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
  publisher: '',
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
    // 1. Get User (ensure user is logged in)
    const { user, profile, error: authError } = await getUserProfile(); // Destructure user, profile, and error

    // Check if user is actually logged in
    if (authError || !user) {
      throw new Error(authError?.message || 'You must be logged in to submit data.');
    }
    // We have the user, proceed using user.id
    const userId = user.id;

    // 2. Prepare data for Supabase (Map form fields to table columns)
    //    NOTE: Adjust column names and data types as per your 'anti_consumer_event' table schema
    const eventData = {
      event_headline: formData.title,
      date_happened: `${formData.year}-01-01`, // Assuming YYYY format, store as date start of year
      producer: formData.producer,
      publisher: formData.publisher,
      source1: formData.source, 
      industry: formData.industry, 
      type1: formData.type, 
      associated_dossier: formData.relatedInitiative, 
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag), 
      event_description: formData.description,
      user_id: userId 
      
    };
    console.log( 'Payload:', eventData);

    // 3. Insert data into Supabase and select the inserted row (optional)
    const { data, error: insertError } = await supabase
      .from('anti_consumer_event')
      .insert([eventData])
      .select(); // Use .select() instead of deprecated returning option

    if (insertError) {
      // Throw the error to be caught by the outer catch block
      throw insertError;
    }

    // 4. Success: Show notification, clear form, and redirect
    console.log('Inserted row:', data); // Log success
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
