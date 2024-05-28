import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap";

// Create Pinia store
const pinia = createPinia();

// Create Vue app instance
const app = createApp(App);

// Use Pinia in the app
app.use(pinia);

// Use the router in the app
app.use(router);

// Mount the app to the #app element
app.mount("#app");
