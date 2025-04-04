<template>
    <div class="content-card">
      <!-- Optional Source Header -->
      <div v-if="sourceName || sourceIcon" class="card-source">
         <img v-if="sourceIcon" :src="sourceIcon" alt="Source Icon" class="source-icon"/>
         <span v-if="sourceName" class="source-name">{{ sourceName }}</span>
      </div>
  
      <!-- Card Title Bar -->
      <div class="card-title-bar">
        {{ title }}
      </div>
  
      <!-- Card Content -->
      <div class="card-content">
        <slot name="content">
          <!-- Default content or placeholder -->
          <p v-if="textContent">{{ textContent }}</p>
          <div v-else-if="chartType === 'column'" class="chart-placeholder chart-column">
              Column Chart Placeholder
          </div>
           <div v-else-if="chartType === 'bar'" class="chart-placeholder chart-bar">
              Bar Chart Placeholder
          </div>
           <div v-else-if="chartType === 'pie'" class="chart-placeholder chart-pie">
              Pie Chart Placeholder
          </div>
        </slot>
      </div>
  
      <!-- Tags -->
      <div class="card-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
  
      <!-- Actions -->
      <div class="card-actions">
        <button class="action-icon"> <img src="../assets/img-share.svg" alt="Share"></button>
        <button class="action-icon"><img src="../assets/img-comment.svg" alt="Comment"></button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    sourceName: {
      type: String,
      default: '',
    },
    sourceIcon: {
        type: String, // URL to the icon image
        default: ''
    },
    textContent: {
      type: String,
      default: '',
    },
    chartType: { // 'column', 'bar', 'pie', or null/undefined
      type: String,
      default: null,
    },
    tags: {
      type: Array,
      default: () => [], // Default to an empty array
    },
  });
  </script>
  
  <style scoped>
  .content-card {
    background-color: #fff;
    border: 1px solid #f0e68c; /* Light yellow border */
    border-radius: 8px;
    margin-bottom: 20px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 10px; /* Space between sections */
  }
  
  .card-source {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px; /* Space below source */
      font-size: 0.9em;
      color: #555;
  }
  
  .source-icon {
      width: 24px; /* Adjust size */
      height: 24px;
      border-radius: 50%; /* Make it round if needed */
      object-fit: cover; /* Handle image aspect ratio */
  }
  
  .source-name {
      font-weight: bold;
  }
  
  
  .card-title-bar {
    background-color: #a7d7c5; /* Teal color */
    color: #333; /* Or white depending on contrast */
    padding: 8px 12px;
    font-weight: bold;
    border-radius: 4px;
    font-size: 1.1em;
  }
  
  .card-content {
    color: #333;
    line-height: 1.6;
    font-size: 0.95em;
    min-height: 50px; /* Ensure some space even if empty */
  }
  
  .card-content p {
      margin: 0; /* Remove default paragraph margin */
  }
  
  
  .chart-placeholder {
    border: 1px dashed #ccc;
    padding: 20px;
    text-align: center;
    color: #aaa;
    min-height: 150px; /* Give charts some height */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
  }
  
  /* Specific chart placeholder styles can be added if needed */
  .chart-column { /* Style specific for column chart placeholders */ }
  .chart-bar { /* Style specific for bar chart placeholders */ }
  .chart-pie { /* Style specific for pie chart placeholders */ }
  
  
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* Space between tags */
  }
  
  .tag {
    background-color: #f0ad4e; /* Yellow tag color */
    color: #444; /* Darker text for yellow */
    padding: 4px 10px;
    border-radius: 12px; /* Pill shape */
    font-size: 0.85em;
    font-weight: 500;
  }
  
  .card-actions {
    display: flex;
    gap: 10px; /* Space between action icons */
    margin-top: 5px; /* Space above actions */
  }
  
  .action-icon {
    background: none;
    border: none;
    cursor: pointer;
    color: #777;
    font-size: 1.2em; /* Adjust icon size */
    padding: 5px;
  }
  .action-icon:hover {
    color: #333;
  }
  
  /* Basic placeholder styling */
  .action-icon {
    font-family: monospace; /* Just to make placeholders look distinct */
    font-size: 0.9em;
    border: 1px dashed #ccc;
    padding: 2px 4px;
  }
  </style>