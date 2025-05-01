<template>
    <div class="content-card">
      <!-- Optional Source Header -->
      <div v-if="sourceName || sourceIcon" class="card-source">
         <img v-if="sourceIcon" :src="sourceIcon" alt="Source Icon" class="source-icon"/>
                
          <span v-if="sourceName" class="source-name">{{ sourceName }}</span>
 
      </div>
  
      <!-- Card Title Bar -->
      <div class="card-title-bar">
        <a v-if="sourceLink" :href="sourceLink" target="_blank" rel="noopener noreferrer" class="source-link">
        {{ title }}
        </a>
        <span v-else-if="title" class="card-title-bar">{{ title }}</span>
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

      <div class="card-content">
        <div class="card-content">
          <p><strong>Publisher : </strong> {{ publisher }}</p>
          <p><strong>Related Initiative:</strong> {{ category }}</p>
          <p><strong>Industry:</strong> {{ industry }}</p>
          <p><strong>Type:</strong> {{ type }}</p>
          <p><strong>Country:</strong> {{ country }}</p>
          <p><strong>Date:</strong> {{ date }}</p>
        </div>
      </div>
      <div class="footer-cards">
        <!-- Tags -->
         <span v-for="tag in tags" :key="tag" class="tag"> {{ tag }} </span>
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
    type: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    publisher: {
      type: String,
      default: '',
    },
    date: {
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
    sourceLink: { // Add the new prop for the URL
      type: String,
      default: '',
    },
  });
  </script>
