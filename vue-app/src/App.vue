<script setup lang="ts">
import { inject, ref, watch } from "vue";
import { useTreatmentCategoryStore } from "./stores/treatmentCategoryStore";
import { storeToRefs } from "pinia";
import WaitingComponent from "./components/waiting/WaitingComponent.vue";
import { AxiosStatic } from "axios";
import { TreatmentCategoryService } from "./services/TreatmentCategoryService";
import TreatmentCategorySelecter from "./components/TreatmentCategorySelecter.vue";
import { useUserStore } from "./stores/userStore";
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);
const treatmentCategoryStore = useTreatmentCategoryStore();
const { treatmentCategories, selectedTreatmentCategory } = storeToRefs(
  treatmentCategoryStore
);
const axios: AxiosStatic | undefined = inject("axios");
const treatmentCategoryService = new TreatmentCategoryService(axios);

const setTreatmentCategories = () => {
  treatmentCategoryService.ReadAll().then((response) => {
    treatmentCategories.value = response;
    if (treatmentCategories.value.length > 0) {
      selectedTreatmentCategory.value = treatmentCategories.value[0];
    }
  });
};

const mainKey = ref(0);

watch(selectedTreatmentCategory, () => {
  mainKey.value++;
});

watch(currentUser, () => {
  setTreatmentCategories();
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
              <TreatmentCategorySelecter />
            </div>
          </div>
        </div>
      </v-container>
    </v-app-bar>
    <v-main :key="mainKey"> <RouterView /></v-main>
    <WaitingComponent />
  </v-app>
</template>
