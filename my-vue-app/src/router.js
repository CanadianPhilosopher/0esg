import { createRouter, createWebHistory } from 'vue-router';
// App.vue is the main layout, not a route component itself
import HomePage from './components/HomePage.vue';
import LoginPage from './components/LoginPage.vue';
import DataEntryForm from './components/DataEntryForm.vue'; // Import the new form component

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage // Use the HomePage component for the root path
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/writedata',
    name: 'WriteData',
    component: DataEntryForm,
    //meta: { requiresAuth: true } // Mark this route as requiring authentication
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
