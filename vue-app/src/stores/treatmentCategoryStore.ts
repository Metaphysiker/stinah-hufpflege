import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useTreatmentCategoryStore = defineStore(
  "treatmentCategoryStore",
  () => {
    const selectedTreatmentCategory: Ref<string | undefined> = ref(undefined);
    return { selectedTreatmentCategory };
  }
);
