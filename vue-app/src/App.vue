<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { useTreatmentCategoryStore } from "./stores/treatmentCategoryStore";
import { storeToRefs } from "pinia";
import WaitingComponent from "./components/waiting/WaitingComponent.vue";
import { AxiosStatic } from "axios";
import { TreatmentCategoryService } from "./services/TreatmentCategoryService";
import TreatmentCategorySelecter from "./components/TreatmentCategorySelecter.vue";
import { useUserStore } from "./stores/userStore";
import AuthenticationManager from "./components/authentication/AuthenticationManager.vue";
import router from "./router";
import { LocalStorageHelper } from "./helpers/LocalStorageHelper";
import { Translator } from "./helpers/Translator";
import { CareAreas } from "./enum/CareAreas";
const translator = new Translator();
const localStorageHelper = new LocalStorageHelper();
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
  mainKey.value++;
});

const logout = () => {
  currentUser.value = undefined;
  localStorageHelper.clearCurrentUser();

  router.push("/login");
};

const goToHome = () => {
  router.push("/");
};

const goToHorsesHoofOverview = () => {
  router.push("/horses-hoof-overview");
};

const isHoofcareCurrentTreatmentCategory = computed(() => {
  if (selectedTreatmentCategory.value) {
    return (
      selectedTreatmentCategory.value?.name === CareAreas.Hoofcare.toString()
    );
  }
  return false;
});
</script>

<template>
  <v-app>
    <v-app-bar app :elevation="2" class="noprint">
      <v-container fluid class="h-100">
        <div class="d-flex align-center h-100">
          <div class="me-10" @click="goToHome()">
            <v-app-bar-title>Pflege</v-app-bar-title>
          </div>
          <div>
            <div
              style="width: 12rem"
              class="d-flex align-center h-100"
              v-if="currentUser"
            >
              <TreatmentCategorySelecter />
            </div>
          </div>
          <div class="ms-1" v-if="isHoofcareCurrentTreatmentCategory">
            <v-btn size="x-small" @click="goToHorsesHoofOverview()"
              >Schlechte Hufe</v-btn
            >
          </div>
        </div>
      </v-container>
    </v-app-bar>
    <v-main :key="mainKey"> <RouterView /></v-main>
    <WaitingComponent />
    <AuthenticationManager />
    <v-footer
      border
      app
      absolute
      class="bg-lightgray font-size-rem-6 noprint"
      height="25"
      v-if="currentUser"
    >
      <v-col class="d-flex justify-end">
        <div class="">
          <strong>User:</strong>
          {{ translator.translate(currentUser.username) }}
        </div>
        <div>
          <v-btn @click="logout()" class="ms-2" size="x-small">Ausloggen</v-btn>
        </div>
      </v-col>
    </v-footer>
  </v-app>
</template>
