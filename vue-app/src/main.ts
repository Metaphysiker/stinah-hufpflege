/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import "./assets/main.css";

// Plugins
import { registerPlugins } from "@/plugins";
import router from "./router";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

import axiosInstanceProvider from "./plugins/AxiosInstanceProvider";

import { createPinia } from "pinia";
const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);

registerPlugins(app);
app.use(axiosInstanceProvider);

app.mount("#app");
