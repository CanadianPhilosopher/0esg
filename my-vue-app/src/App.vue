<template>
  <div id="app-wrapper">
    <AppHeader />
    <main class="main-content">
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

    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import ContentCard from './components/ContentCard.vue';

// Data for cards could be fetched or defined here if more complex
</script>

<style>
/* Global styles (or move to a separate main.css file) */
body {
  margin: 0;
  font-family: 'Arial Narrow Bold', sans-serif; /* Use a common sans-serif font */
  background-color: #f4f4f4; /* Light gray background for the page */
  color: #333;
}

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
 /*padding: 20px;
  /*max-width: 900px; /* Max width similar to the image */
  margin: 0 auto; /* Center the content area */
  width: 100%;
  box-sizing: border-box;
}

/* Add other global styles if needed */
</style>