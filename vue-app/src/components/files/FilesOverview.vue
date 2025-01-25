<script setup lang="ts">
import { Ref, ref } from "vue";
import ModelsOverview from "../generics/ModelsOverview.vue";
import { IFileSearch } from "@/interfaces/IFileSearch";

const treatmentSearch: Ref<IFileSearch> = ref({
  sortBy: "Date",
  sortOrder: "descending",
  pageSize: 200,
  page: 0,
});
</script>

<template>
  <v-container fluid>
    <ModelsOverview
      interface-name="IFile"
      :search="treatmentSearch"
    ></ModelsOverview>
  </v-container>
</template>
