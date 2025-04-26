<script setup lang="ts">
import { inject, onMounted, ref, Ref } from "vue";
import HorsesHoofOverview from "../components/horses/HorsesHoofOverview.vue";
import { IHorse } from "@/interfaces/IHorse";
import { HorseService } from "@/services/HorseService";
import { AxiosStatic } from "axios";
const horses: Ref<IHorse[]> = ref([]);
const axios: AxiosStatic | undefined = inject("axios");
const horseService = new HorseService(axios);

onMounted(() => {
  horseService.ReadAll().then((response) => {
    const horsesWithBadHoof = response.filter((horse) =>
      horse.summaryHoofCheckStatusOfLastTreatment.includes("NotOkay")
    );

    horses.value = horsesWithBadHoof;
  });
});
</script>
<template>
  <v-container fluid>
    <HorsesHoofOverview :horses="horses"></HorsesHoofOverview>
  </v-container>
</template>
