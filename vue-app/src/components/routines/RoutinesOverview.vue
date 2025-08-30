<script setup lang="ts">
import { IRoutineSearch } from "@/interfaces/IRoutineSearch";
import { Ref, ref } from "vue";
import ModelsOverview from "../generics/ModelsOverview.vue";

const treatmentSearch: Ref<IRoutineSearch> = ref({
  sortBy: "Date",
  sortOrder: "descending",
  pageSize: 200,
  page: 0,
});
</script>

<template>
  <v-container fluid>
    <ModelsOverview interface-name="IRoutine" :search="treatmentSearch"></ModelsOverview>
  </v-container>
</template>
