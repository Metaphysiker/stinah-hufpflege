import { ref } from "vue";
import { defineStore } from "pinia";

export const useWaitingStore = defineStore("waitingStore", () => {
  const waiting = ref(false);
  const waitingText = ref("Bitte warten. Fenster schliesst automatisch.");
  return { waiting, waitingText };
});
