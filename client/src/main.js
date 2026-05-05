import './assets/tailwind.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useUserStore } from './stores/userStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize store state from sessionStorage to persist login state across reloads
// sessionStorage is cleared when the browser tab is closed, forcing re-login on reopen
const userStore = useUserStore();
if (sessionStorage.getItem('token') && sessionStorage.getItem('user')) {
  userStore.setToken(sessionStorage.getItem('token'));
  userStore.setUser(JSON.parse(sessionStorage.getItem('user')));
}

app.mount('#app');