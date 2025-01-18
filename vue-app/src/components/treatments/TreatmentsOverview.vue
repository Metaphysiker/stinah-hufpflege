<script setup lang="ts">
import { ITreatmentSearch } from "@/interfaces/ITreatmentSearch";
import { Ref, ref } from "vue";
import ModelsOverview from "../generics/ModelsOverview.vue";

const treatmentSearch: Ref<ITreatmentSearch> = ref({
  sortBy: "Date",
  sortOrder: "descending",
  pageSize: 200,
  page: 0,
});
</script>

<template>
  <v-container fluid>
    <ModelsOverview
      interface-name="ITreatment"
      :search="treatmentSearch"
    ></ModelsOverview>
  </v-container>
</template>
