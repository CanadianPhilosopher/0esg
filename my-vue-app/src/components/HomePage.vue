<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading">Loading events...</div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="error-message">
      Error: {{ errorMsg }}
    </div>

    <!-- Data Display -->
    <div v-else>
      <!-- Use a unique ID from Supabase if available for the key -->
      <ContentCard
        v-for="(event, index) in events"
        :key="event.cardTitle || index"
        :title="event.cardTitle"
        :source-name="event.cardSourceName"
        :text-content="event.description"
        :tags="event.cardTags"
        :source-link="event.sourceLink"
        :date="event.date"
      />
      <!-- Add other props from ContentCard as needed -->
    </div>

    <!-- Keep other static cards if needed -->
    <ContentCard
      title="Sweet Baby Inc. detected: What actually happened and why should you care?"
      source-name="theshortcut.com"
      source-icon="https://via.placeholder.com/30/FF0000/FFFFFF?text=S"
      text-content="What started the Sweet Baby Inc. backlash? The controversy began after a Sweet Baby Inc. employee Chris Kindred highlighted a Steam Curator group called 'Sweet Baby Inc. Detected' on X (formerly known as Twitter). Kindred has since deleted these posts but they've been documented below. Sweet Baby Inc. has become the focus of some gamers' ire on social media, but what happened and why should you care? Here's everything you need to know about the latest discourse in the gaming industry from an impartial and fact-based viewpoint."
      :tags="['Event', 'Criminal Behaviour']"
    />

    <ContentCard
      title="Complaint Regarding YouTube Platform Experience"
      source-name="Joshua"
      source-icon="https://via.placeholder.com/30/8B4513/FFFFFF?text=J"
      text-content="I am writing to express my dissatisfaction with the current YouTube platform experience. Lately, I've noticed a significant decline in the quality of recommendations, often receiving irrelevant or repetitive suggestions despite my viewing history and preferences. Furthermore, the frequency and intrusiveness of advertisements have become excessive, often disrupting the viewing experience significantly. This combination makes navigating and enjoying content increasingly frustrating. I request that you investigate these concerns regarding the recommendation algorithms and ad placement policies to improve the overall user experience on the platform."
      :tags="['Review', 'Customer Support Issues']"
    />

    <ContentCard
      title="Estimated Losses Per Year (Column Chart)"
      chart-type="column"
      :tags="['Data']"
    />

    <ContentCard
      title="Estimated Losses by Related Initiative Focus (Bar Chart)"
      chart-type="bar"
      :tags="['Data']"
    />

    <ContentCard
      title="Estimated Losses by Related Initiative Focus (Pie Chart)"
      chart-type="pie"
      :tags="['Data']"
    />

    <EventList />
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import { supabase } from '../supabaseClient';
import ContentCard from './ContentCard.vue';
//import EventList from './EventList.vue';

const events = ref([]); // Reactive variable to store fetched events
const isLoading = ref(true); // Track loading state
const errorMsg = ref(null);   // Store potential error messages

function formatDate(dateString){
  if (!dateString) return 'N/A';
  try { 
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString( undefined, { year: 'numeric'});
  } catch (e) {
    return dateString;
  }
}

function parseTags(tagsData) {
  if (Array.isArray(tagsData)) return tagsData;
  if (typeof tagsData === 'string' && tagsData.length > 0) {
    const cleanedString = tagsData.replace(/[{}"']/g, '');
    return cleanedString.split(',').map(tag => tag.trim()).filter(tag => tag);
  }
  return [];
}

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
    events.value = data.map(item => ({
      cardTitle: `${item.event_headline} (${item.product || 'General'})`,
      cardSourceName: item.producer,
      cardTags: parseTags(item.tags),
      description: item.event_description,
      date: formatDate(item.date_happened),
      sourceLink: item.source1,
    }));

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
