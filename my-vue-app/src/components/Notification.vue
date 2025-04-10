<!-- src/components/Notification.vue -->
<template>
    <div v-if="visible" :class="['notification', type]">
      <p>{{ message }}</p>
      <button @click="visible = false" class="close-btn">×</button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    message: String,
    type: {
      type: String,
      default: 'success' // or 'error'
    },
    duration: {
      type: Number,
      default: 0
    }
  })
  
  const visible = ref(false) // Start hidden, watcher will make it visible
  
  watch(() => props.message, (newMessage) => {
    if (newMessage) { // If there's a new message
      visible.value = true // Make it visible
      if (props.duration > 0) { // Set timeout only if duration is positive
        setTimeout(() => {
          // Only hide if the message hasn't changed again in the meantime
          if (props.message === newMessage) {
             visible.value = false
          }
        }, props.duration)
      }
    } else { // If message becomes empty, hide immediately
        visible.value = false
    }
  }, { immediate: true }) // Run watcher immediately on component mount
  </script>
  
  <style scoped>
  
  </style>
