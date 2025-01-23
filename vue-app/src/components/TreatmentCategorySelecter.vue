<script setup lang="ts">
import { Translator } from "@/helpers/Translator";
import { useTreatmentCategoryStore } from "@/stores/treatmentCategoryStore";
import { storeToRefs } from "pinia";

const translator = new Translator();
const treatmentCategoryStore = useTreatmentCategoryStore();
const { treatmentCategories, selectedTreatmentCategory } = storeToRefs(
  treatmentCategoryStore
);
</script>

<template>
  <v-select
    v-model="selectedTreatmentCategory"
    density="comfortable"
    :hide-details="true"
    single-line
    label="Kategorie"
    :item-title="(item) => translator.translate(item.name)"
    :items="treatmentCategories"
    :return-object="true"
  ></v-select>
</template>
