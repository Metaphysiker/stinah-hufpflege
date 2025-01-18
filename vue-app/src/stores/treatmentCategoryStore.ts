import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { ITreatmentCategory } from "@/interfaces/ITreatmentCategory";

export const useTreatmentCategoryStore = defineStore(
  "treatmentCategoryStore",
  () => {
    const selectedTreatmentCategory: Ref<ITreatmentCategory | undefined> =
      ref(undefined);
    return { selectedTreatmentCategory };
  }
);
