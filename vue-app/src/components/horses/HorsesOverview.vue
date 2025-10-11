<script setup lang="ts">
import ModelsOverview from "../generics/ModelsOverview.vue";
</script>

<template>
  <ModelsOverview
    interface-name="IHorse"
    sortBy="nextAnyTreatmentDate"
    sortByOrder="asc"
  ></ModelsOverview>
</template>
