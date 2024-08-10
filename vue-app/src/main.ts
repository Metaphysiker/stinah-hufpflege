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

const app = createApp(App);
app.use(router);

registerPlugins(app);
app.use(axiosInstanceProvider);

app.mount("#app");
