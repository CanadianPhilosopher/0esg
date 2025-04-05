// src/components/EventList.vue (or any other component)
<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabaseClient'; // Adjust path if necessary

const events = ref([]); // Reactive variable to store fetched events
const isLoading = ref(true); // Track loading state
const errorMsg = ref(null);   // Store potential error messages

async function fetchEvents() {
  isLoading.value = true;
  errorMsg.value = null;
  try {
    // Use the supabase client to fetch data
    // .from('table_name') specifies the table
    // .select('*') selects all columns
    // You can specify columns like .select('id, product, event_headline')
    const { data, error } = await supabase
      .from('anti_consumer_event') // Your table name
      .select('*')                 // Select all columns for now
      .order('created_at', { ascending: false }); // Optional: Order by creation date

    if (error) {
      // Throw the error to be caught by the catch block
      throw error;
    }

    // If data fetching is successful, update the events ref
    events.value = data;

  } catch (error) {
    console.error("Error fetching events:", error.message);
    errorMsg.value = `Failed to fetch events: ${error.message}`;
  } finally {
    // Set loading to false regardless of success or failure
    isLoading.value = false;
  }
}

// Call fetchEvents when the component is first mounted
onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <div>
    <h1>Anti-Consumer Events</h1>

    <!-- Display loading message -->
    <div v-if="isLoading">Loading events...</div>

    <!-- Display error message -->
    <div v-else-if="errorMsg" style="color: red;">{{ errorMsg }}</div>

    <!-- Display the list of events -->
    <ul v-else-if="events.length > 0">
      <li v-for="event in events" :key="event.id">
        <h2>{{ event.event_headline }} ({{ event.product }})</h2>
        <p><strong>Producer:</strong> {{ event.producer }}</p>
        <p><strong>Description:</strong> {{ event.event_description }}</p>
        <p><strong>Date:</strong> {{ event.date_happened }}</p>
        <p><strong>Source:</strong> <a :href="event.source1" target="_blank" rel="noopener noreferrer">{{ event.source1 }}</a></p>
        <hr />
      </li>
    </ul>

    <!-- Display message if no events are found -->
    <div v-else>No events found.</div>
  </div>
</template>

<style scoped>
/* Add some basic styling if you like */
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
h2 {
  margin-bottom: 5px;
}
p {
  margin: 5px 0;
}
</style>