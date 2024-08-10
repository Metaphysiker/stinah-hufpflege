<script setup lang="ts">
import DateSelecter from "@/dates/DateSelecter.vue";
import { ITreatment } from "@/interfaces/ITreatment";
const treatmentToBeEdited = defineModel({
  required: true,
  type: Object as () => ITreatment,
});
</script>
<template>
  <DateSelecter label="Datum" v-model="treatmentToBeEdited.date" />

  <v-textarea
    label="Notiz"
    v-model="treatmentToBeEdited.note"
    variant="outlined"
  ></v-textarea>
</template>
