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
  
  