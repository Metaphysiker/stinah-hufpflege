import { ref } from "vue";
import { defineStore } from "pinia";

export const useApiErrorHandlerStore = defineStore(
  "apiErrorHandlerStore",
  () => {
    const showDialog = ref(false);
    const message = ref("Ein Fehler ist aufgetreten.");
    return { showDialog, message };
  }
);
