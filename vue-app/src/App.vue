<script setup lang="ts">
import { onMounted } from "vue";
import { treatmentCategories } from "./lists/TreatmentCategories";
import { useTreatmentCategoryStore } from "./stores/treatmentCategoryStore";
import { storeToRefs } from "pinia";
import { Translator } from "./helpers/Translator";
import WaitingComponent from "./components/waiting/WaitingComponent.vue";

const translator = new Translator();
const treatmentCategoryStore = useTreatmentCategoryStore();
const { selectedTreatmentCategory } = storeToRefs(treatmentCategoryStore);

onMounted(() => {
  if (treatmentCategories.length > 0) {
    selectedTreatmentCategory.value = treatmentCategories[0];
  }
});
</script>

<template>
  <v-app>
    <v-app-bar app :elevation="2">
      <v-container fluid class="h-100">
        <div class="d-flex align-center h-100">
          <div class="me-10"><v-app-bar-title>Pflege</v-app-bar-title></div>
          <div>
            <div style="width: 12rem" class="d-flex align-center h-100">
              <v-select
                v-model="selectedTreatmentCategory"
                density="comfortable"
                :hide-details="true"
                single-line
                label="Kategorie"
                :item-title="(item) => translator.translate(item)"
                :items="treatmentCategories"
              ></v-select>
            </div>
          </div>
        </div>
      </v-container>
    </v-app-bar>
    <v-main> <RouterView /></v-main>

    <WaitingComponent />
  </v-app>
</template>
