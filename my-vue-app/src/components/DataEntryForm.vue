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
        <label for="country">Country</label>
        <select
          id="country"
          v-model="formData.countryId"
          :disabled="isReadonly"
          required
        >
        <option disabled value="">Select a country</option>
        <option v-for="country in reference.country" :key="country.id" :value="country.id">
          {{ country.name }}
        </option>
         </select>
      </div>
      <div class="form-group">
        <label for="product">Product</label>
        <input type="text" id="product" v-model="formData.product" required>
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
      <div class="form-group" >
        <label for="industry">Industry</label>
        <select id="industry" v-model="formData.industry" @change="handleIndustryChange">
          <option disabled value="">Select Industry</option>
          <option v-for="option in industryOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
          <option value="other">Other (please specify)</option>
        </select>
        <input 
          v-if="formData.industry === 'other'" 
          type="text" 
          placeholder="Enter your industry" 
          v-model="formData.customIndustry"
          class="input-gap"
        />
      </div>
       <div class="form-group">
        <label for="type">Type</label>
        <select id="type" v-model="formData.type" @change="handleTypeChange">
          <option disabled value="">Select Type</option>
          <option v-for="option in typeOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
          <option value="other">Other (please specify)</option>
        </select>
        <input 
          v-if="formData.type === 'other'" 
          type="text" 
          placeholder="Enter your type" 
          v-model="formData.customType"
          class="input-gap"
        />
      </div>
       <div class="form-group">
        <label for="related-initiative">Category</label>
        <!--<select id="related-initiative" v-model="formData.relatedInitiative" @change="handleCategoryChange">
           <option disabled value="">Select Category</option>
          
           <option value="1"> Escapism Disruption</option>
           <option value="2">Criminal Behavior</option>
           <option value="3">Overclaimed</option>
           <option value="4">Data Right</option>
           <option value="5">Marketing Blacklash</option>
           <option value="other">Other (please specify)</option>
        </select>-->
        <select id="related-initiative" v-model="formData.relatedInitiative" @change="handleCategoryChange">
          <option disabled value="">Select Category</option>
          <option v-for="option in categoryOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
          <option value="other">Other (please specify)</option>
        </select>

        <input 
          v-if="formData.relatedInitiative === 'other'" 
          type="text" 
          placeholder="Enter your type" 
          v-model="formData.customCategory"
          class="input-gap"
        />
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
import { reactive, ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabaseClient';
import { getUserProfile } from '../library/auth';
import Notification from './Notification.vue'; 
const router = useRouter();
const isSubmitting = ref(false);
const typeOptions = [
  { id: 1, label: 'Injection of Modern Day Subjects' },
  { id: 2, label: 'Destruction of Property' },
  { id: 3, label: 'Inclusion of Pronouns' },
  { id: 4, label: 'Sales Underperformance' }
];
const industryOptions = [
  { id: 1, label: 'Video Game' },
  { id: 2, label: 'Entertainment' },
  { id: 3, label: 'Education' }
];

const categoryOptions = [
  { id: 1, label: 'Escapism Disruption' },
  { id: 2, label: 'Criminal Behavior' },
  { id: 3, label: 'Overclaimed' },
  { id: 4, label: 'Data Right' },
  { id: 5, label: 'Marketing Blacklash' }
];
const formData = reactive({
  title: '',
  year: new Date().getFullYear(), 
  producer: '',
  publisher: '',
  source: '',
  industry: '',
  customIndustry: '',
  customType: '',
  type: '',
  relatedInitiative: '',
  customCategory:'',
  tags: '',
  description: '',
  countryId: '',
});
const reference = reactive({
  country: []
})

const isReadonly = ref(false)

onMounted(async () => {
  const { data, error } = await supabase
    .from('country')
    .select('id, name')
    .order('name')

  if (error) {
    console.error('Error fetching countries:', error.message)
  } else {
    reference.country = data
  }
})

async function handleIndustryChange() {
    if (this.formData.industry !== 'other') {
      this.formData.customIndustry = '';
  }
}
async function handleTypeChange() {
    if (this.formData.type !== 'other') {
      this.formData.customType = '';
  }
}
async function handleCategoryChange() {
    if (this.formData.relatedInitiative !== 'other') {
      this.formData.customCategory = '';
  }
}

const notification = reactive({
  message: '',
  type: 'success' // 'success' or 'error'
});

function showNotification(msg, type = 'success') {
  notification.message = msg;
  notification.type = type;
  
  setTimeout(() => {
    notification.message = '';
  }, 5000);
}


async function handleSubmit() {
  isSubmitting.value = true;
  notification.message = 'Success'; 

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
   /* function resolveField(value, customValue) {
    return value === 'other' ? customValue : value;
    }*/
  function resolveField(value, customValue) {
    return value === 'other' ? customValue : Number(value); // ensure value is a number
    }

    const industryToSave = resolveField(formData.industry, formData.customIndustry);
    const typeToSave = resolveField(formData.type, formData.customType);
    const categoryToSave = resolveField(formData.relatedInitiative, formData.customCategory);

    const eventData = {
      event_headline: formData.title,
      date_happened: formData.year, // Assuming YYYY format, store as date start of year
      producer: formData.producer,
      product: formData.product,
      publisher: formData.publisher,
      source1: formData.source, 
      industry: industryToSave, 
      type1: typeToSave, 
      category_text: categoryToSave, 
      country_id: formData.countryId,
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
